'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseBrowserClient: SupabaseClient | null = null

function getRequiredPublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'): string {
  const value = process.env[name]

  if (!value) {
    const message = `Missing required environment variable: ${name}. Please ensure this is set in your Vercel environment variables or .env.local file.`
    console.error(message)
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')))
    throw new Error(message)
  }

  return value
}

function getPublicSupabaseKey(): string {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const resolvedKey = anonKey || publishableKey

  if (!resolvedKey) {
    const message = 'Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. Please ensure this is set in your Vercel environment variables or .env.local file.'
    console.error(message)
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')))
    throw new Error(message)
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

