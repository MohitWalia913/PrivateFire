import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/** Optional `.privatefire.com` style sharing across subdomains; leave unset for host-only cookies. */
function authCookieOptions(): { domain: string } | undefined {
  const raw =
    typeof process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN === 'string'
      ? process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN.trim()
      : ''
  if (!raw) return undefined
  return { domain: raw.replace(/^\./, '') }
}

/** Refresh auth cookies on each navigation (required when using SSR Supabase cookie storage). */
export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const cookieExtras = authCookieOptions()

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    ...(cookieExtras ? { cookieOptions: cookieExtras } : {}),
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  await supabase.auth.getUser()

  return supabaseResponse
}
