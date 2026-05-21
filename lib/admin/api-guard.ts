import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin/auth'

export async function adminApiGuard() {
  const admin = await getAdminSession()
  if (!admin) {
    return { admin: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { admin, error: null }
}
