import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { createSupabaseServerAuthClient } from '@/lib/supabase/server-auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (!tokenHash || !type) {
    redirect('/login?error=Invalid+verification+link')
  }

  const supabase = await createSupabaseServerAuthClient()
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  })

  if (error) {
    redirect('/login?error=Email+verification+failed')
  }

  redirect(next)
}
