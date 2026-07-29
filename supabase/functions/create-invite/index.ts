// Deno edge function: create a circle_invites row for the calling (inviter)
// user and return a shareable code + link. Requires the caller to be
// authenticated; the row is written with the service-role client so RLS
// (inviter-only access) still protects reads/writes made directly by clients.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

// Unambiguous code alphabet: no O/0 or I/1.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 6
const MAX_CODE_ATTEMPTS = 10

function generateCode(): string {
  let body = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    body += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return `GRD-${body}`
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
    const appUrl = Deno.env.get('APP_URL')

    if (!appUrl) {
      return jsonResponse({ error: 'Server is missing the APP_URL secret' }, 500)
    }

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

    let body: { contactId?: unknown; name?: unknown; phone?: unknown }
    try {
      body = await req.json()
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400)
    }

    const { contactId, name, phone } = body
    if (typeof contactId !== 'string' || contactId.trim().length === 0) {
      return jsonResponse({ error: 'contactId is required' }, 400)
    }

    const admin = createClient(supabaseUrl, serviceRoleKey)

    let inviteRow: { token: string; code: string } | null = null
    let lastError: { message: string } | null = null

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const code = generateCode()
      const { data, error } = await admin
        .from('circle_invites')
        .insert({
          inviter_id: user.id,
          contact_id: contactId,
          code,
          invitee_name: typeof name === 'string' ? name : null,
          invitee_phone: typeof phone === 'string' ? phone : null,
        })
        .select('token, code')
        .single()

      if (!error) {
        inviteRow = data
        break
      }

      // 23505 = unique_violation — someone else already holds this code, retry.
      if (error.code === '23505') {
        lastError = error
        continue
      }

      return jsonResponse({ error: error.message }, 500)
    }

    if (!inviteRow) {
      return jsonResponse(
        { error: lastError?.message ?? 'Could not generate a unique invite code' },
        500
      )
    }

    return jsonResponse({
      token: inviteRow.token,
      code: inviteRow.code,
      url: `${appUrl}/join/${inviteRow.token}`,
    })
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500)
  }
})
