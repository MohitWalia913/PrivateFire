'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseBrowserClient: SupabaseClient | null = null

function getRequiredPublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export function getSupabaseBrowserClient(): SupabaseClient {
  if (supabaseBrowserClient) {
    return supabaseBrowserClient
  }

  const supabaseUrl = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseAnonKey = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  supabaseBrowserClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseBrowserClient
}
