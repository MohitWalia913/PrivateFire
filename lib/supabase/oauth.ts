import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { oauthSafeNext } from '@/lib/supabase/oauth-redirect'

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
