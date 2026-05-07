import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { authCookieOptions } from '@/lib/supabase/auth-cookies'
import { oauthSafeNext } from '@/lib/supabase/oauth-redirect'

/** PKCE callback: exchange happens here so verifier is read from request cookies (recommended for Next.js). */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const origin = url.origin

  const errRaw =
    url.searchParams.get('error_description') || url.searchParams.get('error')

  const nextPath = oauthSafeNext(url.searchParams.get('next'))

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const q = new URLSearchParams({
      error: 'Supabase public URL/key is missing in environment.',
    })
    return NextResponse.redirect(`${origin}/login?${q}`)
  }

  if (errRaw) {
    const q = new URLSearchParams({
      error: errRaw.replace(/\+/g, ' ').slice(0, 400),
    })
    return NextResponse.redirect(`${origin}/login?${q}`)
  }

  const code = url.searchParams.get('code')
  if (!code) {
    const q = new URLSearchParams({
      error:
        'OAuth returned no authorization code — confirm Redirect URLs include ' +
        `${origin}/auth/callback in Supabase.`,
    })
    return NextResponse.redirect(`${origin}/login?${q}`)
  }

  const cookieOpts = authCookieOptions()

  /** Single response object so Set-Cookie from exchange merges into the redirect */
  let response = NextResponse.redirect(new URL(nextPath, origin))

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    ...(cookieOpts ? { cookieOptions: cookieOpts } : {}),
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const q = new URLSearchParams({ error: error.message.slice(0, 400) })
    return NextResponse.redirect(`${origin}/login?${q}`)
  }

  return response
}
