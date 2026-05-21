import 'server-only'

import { createSupabaseServerAuthClient } from '@/lib/supabase/server-auth'
import { getAdminAllowlist, getMasterAdminEmail } from '@/lib/admin/config'

export type AdminSession = {
  userId: string
  email: string
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSupabaseServerAuthClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return null

  const email = user.email.toLowerCase()
  const allowlist = getAdminAllowlist()
  const role = (user.user_metadata?.role as string | undefined)?.toLowerCase()
  const isMasterAdmin =
    email === getMasterAdminEmail().toLowerCase() ||
    user.user_metadata?.is_master_admin === true

  if (isMasterAdmin || role === 'admin' || allowlist.includes(email)) {
    return { userId: user.id, email: user.email }
  }

  return null
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession()
  if (!session) {
    throw new Error('UNAUTHORIZED')
  }
  return session
}
