import { getSupabaseBrowserClient } from '@/lib/supabase/client'

/** Blocks open redirects — only allow same-origin paths. */
export function oauthSafeNext(raw: string | null): string {
  if (!raw || raw.startsWith('//')) return '/dashboard'
  return raw.startsWith('/') ? raw : '/dashboard'
}

/** Google OAuth via Supabase. Configure provider + redirect URLs in the Supabase dashboard first. */
export async function signInWithGoogle(opts?: { next?: string }) {
  const next = oauthSafeNext(opts?.next ?? '/dashboard')
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`

  const supabase = getSupabaseBrowserClient()
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })

  return { error }
}
