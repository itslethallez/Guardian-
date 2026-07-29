import { supabase } from './supabase'

export type EnablePushResult = 'subscribed' | 'denied' | 'unsupported'

// Standard VAPID key conversion: browsers want the applicationServerKey as a
// Uint8Array, VAPID public keys are handed out as URL-safe base64.
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null
  }
  return navigator.serviceWorker.register('/sw.js')
}

export async function enablePush(): Promise<EnablePushResult> {
  if (
    !('serviceWorker' in navigator) ||
    !('PushManager' in window) ||
    !('Notification' in window)
  ) {
    return 'unsupported'
  }

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
  if (!vapidPublicKey) {
    console.error('[Sotto] Missing VITE_VAPID_PUBLIC_KEY — cannot subscribe to push.')
    return 'unsupported'
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    return 'denied'
  }

  const registration = await registerServiceWorker()
  if (!registration) {
    return 'unsupported'
  }

  const activeRegistration = await navigator.serviceWorker.ready

  let subscription: PushSubscription
  try {
    subscription =
      (await activeRegistration.pushManager.getSubscription()) ??
      (await activeRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      }))
  } catch (err) {
    console.error('[Sotto] Push subscription failed:', err)
    return 'unsupported'
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('[Sotto] Cannot save push subscription: no authenticated user.')
    return 'unsupported'
  }

  const json = subscription.toJSON()
  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: user.id,
      endpoint: subscription.endpoint,
      p256dh: json.keys?.p256dh ?? '',
      auth: json.keys?.auth ?? '',
      user_agent: navigator.userAgent,
    },
    { onConflict: 'endpoint' }
  )

  if (error) {
    console.error('[Sotto] Failed to save push subscription:', error.message)
    return 'unsupported'
  }

  return 'subscribed'
}
