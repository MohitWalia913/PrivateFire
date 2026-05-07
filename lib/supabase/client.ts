'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { authCookieOptions } from '@/lib/supabase/auth-cookies'

let supabaseBrowserClient: SupabaseClient | null = null

function getRequiredPublicEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'): string {
  // In Next.js client code, env vars must be accessed statically.
  // Dynamic index access like process.env[name] is not inlined in the browser bundle.
  const value =
    name === 'NEXT_PUBLIC_SUPABASE_URL'
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseBrowserClient must only run in the browser')
  }

  if (supabaseBrowserClient) {
    return supabaseBrowserClient
  }

  const supabaseUrl = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseAnonKey = getPublicSupabaseKey()

  /*
   * @supabase/ssr createBrowserClient stores the PKCE code verifier in cookies (not localStorage),
   * so it survives redirects. OAuth code exchange completes in `app/auth/callback/route.ts` using the
   * same cookies sent on that request — do not rely on client-side exchangeCodeForSession for PKCE.
   */
  const cookieExtras = authCookieOptions()

  supabaseBrowserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    ...(cookieExtras ? { cookieOptions: cookieExtras } : {}),
  })
  return supabaseBrowserClient
}

