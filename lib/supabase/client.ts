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

function getPublicSupabaseKey(): string {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const resolvedKey = anonKey || publishableKey

  if (!resolvedKey) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)')
  }

  return resolvedKey
}

export function getSupabaseBrowserClient(): SupabaseClient {
  if (supabaseBrowserClient) {
    return supabaseBrowserClient
  }

  const supabaseUrl = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseAnonKey = getPublicSupabaseKey()

  supabaseBrowserClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseBrowserClient
}
