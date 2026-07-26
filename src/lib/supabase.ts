import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Guard Mode] Missing Supabase environment variables.\n' +
      'Copy .env.example to .env.local and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.\n' +
      'Auth features will not work until these are configured.'
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
