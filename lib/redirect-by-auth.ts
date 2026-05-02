import 'server-only'

import { redirect } from 'next/navigation'
import { createSupabaseServerAuthClient } from '@/lib/supabase/server-auth'

/** Sends authenticated users to the dashboard and everyone else to login. */
export async function redirectToDashboardOrLogin(): Promise<never> {
  const supabase = await createSupabaseServerAuthClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }
  redirect('/login')
}
