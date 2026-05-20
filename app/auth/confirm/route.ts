import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { createSupabaseServerAuthClient } from '@/lib/supabase/server-auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  /**
   * Some Supabase email templates/providers return PKCE `code` links.
   * Delegate those to callback exchange flow instead of showing false invalid-link errors.
   */
  if (code) {
    const qs = searchParams.toString()
    redirect(`/auth/callback${qs ? `?${qs}` : ''}`)
  }

  if (!tokenHash || !type) {
    // Avoid scary false negatives for pre-fetched/altered links; user can still sign in.
    redirect('/login')
  }

  const supabase = await createSupabaseServerAuthClient()
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  })

  if (error) {
    const msg = (error.message || '').toLowerCase()
    const alreadyHandled =
      msg.includes('expired') ||
      msg.includes('already') ||
      msg.includes('used') ||
      msg.includes('invalid token') ||
      msg.includes('token has expired')
    if (alreadyHandled) {
      redirect('/login')
    }
    redirect('/login?error=Email+verification+failed')
  }

  redirect(next)
}
