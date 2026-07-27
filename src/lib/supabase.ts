import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.')
  if (parts.length !== 3) {
    return null
  }

  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const normalized = payload + '='.repeat((4 - (payload.length % 4)) % 4)
    return JSON.parse(atob(normalized)) as Record<string, unknown>
  } catch {
    return null
  }
}

function isBrowserSafeSupabaseKey(key: string): boolean {
  if (key.startsWith('sb_secret_')) {
    return false
  }

  const payload = decodeJwtPayload(key)
  if (!payload) {
    return true
  }

  return payload.role !== 'service_role'
}

const hasRequiredEnv = Boolean(supabaseUrl && supabaseAnonKey)
const hasBrowserSafeKey = supabaseAnonKey ? isBrowserSafeSupabaseKey(supabaseAnonKey) : false

export const isSupabaseConfigured = hasRequiredEnv && hasBrowserSafeKey
export const supabaseConfigError = !hasRequiredEnv
  ? 'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).'
  : !hasBrowserSafeKey
    ? 'Supabase key is using a secret/service_role key. Use your Supabase anon/publishable key for browser apps.'
    : null

if (supabaseConfigError) {
  console.error(`[Guard Mode] ${supabaseConfigError}`)
}

const fallbackUrl = 'https://placeholder.supabase.co'
const fallbackAnonKey = 'placeholder-anon-key'
const resolvedUrl = isSupabaseConfigured ? (supabaseUrl ?? fallbackUrl) : fallbackUrl
const resolvedAnonKey = isSupabaseConfigured ? (supabaseAnonKey ?? fallbackAnonKey) : fallbackAnonKey

// Use a safe fallback client so the app still renders when env vars are missing.
export const supabase = createClient(resolvedUrl, resolvedAnonKey)
