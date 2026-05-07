'use client'

import { createBrowserClient, type SupabaseClient } from '@supabase/ssr'

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
  if (supabaseBrowserClient) {
    return supabaseBrowserClient
  }

  const supabaseUrl = getRequiredPublicEnv('NEXT_PUBLIC_SUPABASE_URL')
  const supabaseAnonKey = getPublicSupabaseKey()

  const cookieDomainRaw =
    typeof process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN === 'string'
      ? process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN.trim()
      : ''

  /*
   * @supabase/ssr createBrowserClient stores the PKCE code verifier in cookies (not localStorage),
   * so it survives redirects. Plain @supabase/supabase-js loses the verifier easily (subdomain hops,
   * storage partitioning, strict browser policies).
   */
  supabaseBrowserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    ...(cookieDomainRaw ? { cookieOptions: { domain: cookieDomainRaw.replace(/^\./, '') } } : {}),
  })
  return supabaseBrowserClient
}

