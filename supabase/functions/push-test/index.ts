// Deno edge function: dev-only loop to prove Web Push actually reaches a
// device. Sends the caller's own push_subscriptions a test notification and
// reports per-subscription delivery status. Never swallows failures — a
// 404/410 from the push service means the endpoint is gone, so we also prune
// that subscription row.
import webpush from 'npm:web-push@3.6.7'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, jsonResponse } from '../_shared/cors.ts'

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
    const vapidSubject = Deno.env.get('VAPID_SUBJECT')
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')
    const appUrl = Deno.env.get('APP_URL') ?? ''

    if (!vapidSubject || !vapidPublicKey || !vapidPrivateKey) {
      return jsonResponse(
        { error: 'Server is missing VAPID_SUBJECT / VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY secrets' },
        500
      )
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

    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)

    const admin = createClient(supabaseUrl, serviceRoleKey)
    const { data: subscriptions, error: subsError } = await admin
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', user.id)

    if (subsError) {
      return jsonResponse({ error: subsError.message }, 500)
    }

    if (!subscriptions || subscriptions.length === 0) {
      return jsonResponse({ results: [], error: 'No push subscriptions for this user yet.' })
    }

    const payload = JSON.stringify({
      title: 'Sotto test',
      body: 'Push is working',
      url: appUrl,
    })

    const results = await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          )
          return { id: sub.id, ok: true, status: 201 }
        } catch (err) {
          const status = (err as { statusCode?: number } | undefined)?.statusCode ?? 0
          if (status === 404 || status === 410) {
            await admin.from('push_subscriptions').delete().eq('id', sub.id)
          }
          return {
            id: sub.id,
            ok: false,
            status,
            error: err instanceof Error ? err.message : 'Unknown error',
          }
        }
      })
    )

    return jsonResponse({ results })
  } catch (err) {
    return jsonResponse({ error: err instanceof Error ? err.message : 'Unexpected error' }, 500)
  }
})
