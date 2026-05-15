import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const rawUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

// Remove trailing slash and warn if URL contains /rest/v1 (common misconfiguration)
const supabaseUrl = rawUrl.replace(/\/$/, '')
if (import.meta.env.DEV && supabaseUrl.includes('/rest/v1')) {
  console.warn('[Supabase] VITE_SUPABASE_URL deve ser a URL base do projeto, sem /rest/v1. Ex: https://xxxx.supabase.co')
}

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)
