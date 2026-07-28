// Deno edge function: the accepting contact calls this with a token or code.
// Runs entirely with the service-role client because the accepting user has
// no RLS access to the inviter's circle_invites row or profile — this
// function is the only path that can flip a contact from 'pending' to
// 'connected'.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

interface TrustedContactLike {
  id?: unknown
  status?: unknown
  [key: string]: unknown
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return jsonResponse({ error: 'Missing Authorization header' }, 401)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userError,
    } = await callerClient.auth.getUser()

    if (userError || !user) {
      return jsonResponse({ error: 'Not authenticated' }, 401)
    }

    let body: { token?: unknown; code?: unknown }
    try {
      body = await req.json()
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400)
    }

    const token = typeof body.token === 'string' ? body.token : null
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : null

    if (!token && !code) {
      return jsonResponse({ error: 'token or code is required' }, 400)
    }

    const admin = createClient(supabaseUrl, serviceRoleKey)

    const inviteQuery = admin.from('circle_invites').select('*')
    const { data: invite, error: inviteError } = token
      ? await inviteQuery.eq('token', token).maybeSingle()
      : await inviteQuery.eq('code', code!).maybeSingle()

    if (inviteError) {
      return jsonResponse({ error: inviteError.message }, 500)
    }

    if (!invite) {
      return jsonResponse(
        { error: 'We could not find that invite. Check the link or code and try again.' },
        404
      )
    }

    const isExpired = invite.status === 'pending' && new Date(invite.expires_at) < new Date()

    if (invite.status === 'expired' || isExpired) {
      if (isExpired) {
        await admin.from('circle_invites').update({ status: 'expired' }).eq('id', invite.id)
      }
      return jsonResponse(
        { error: 'This invite has expired. Ask them to send you a new one.' },
        410
      )
    }

    if (invite.status !== 'pending') {
      return jsonResponse({ error: `This invite has already been ${invite.status}.` }, 409)
    }

    const now = new Date().toISOString()
    const { error: updateInviteError } = await admin
      .from('circle_invites')
      .update({ status: 'accepted', accepted_by: user.id, accepted_at: now })
      .eq('id', invite.id)

    if (updateInviteError) {
      return jsonResponse({ error: updateInviteError.message }, 500)
    }

    const { data: inviterProfile, error: profileError } = await admin
      .from('profiles')
      .select('name, app_state')
      .eq('id', invite.inviter_id)
      .maybeSingle()

    if (profileError) {
      return jsonResponse({ error: profileError.message }, 500)
    }

    const appState = (inviterProfile?.app_state ?? {}) as {
      trustedContacts?: TrustedContactLike[]
      [key: string]: unknown
    }
    const trustedContacts = Array.isArray(appState.trustedContacts) ? appState.trustedContacts : []
    const updatedContacts = trustedContacts.map((contact) =>
      contact && typeof contact === 'object' && contact.id === invite.contact_id
        ? { ...contact, status: 'connected' }
        : contact
    )

    const { error: upsertError } = await admin.from('profiles').upsert(
      {
        id: invite.inviter_id,
        app_state: { ...appState, trustedContacts: updatedContacts },
      },
      { onConflict: 'id' }
    )

    if (upsertError) {
      return jsonResponse({ error: upsertError.message }, 500)
    }

    let inviterName = inviterProfile?.name ?? null
    if (!inviterName) {
      const { data: authUserData } = await admin.auth.admin.getUserById(invite.inviter_id)
      inviterName = authUserData?.user?.email ?? 'your contact'
    }

    return jsonResponse({ inviterName })
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500)
  }
})
