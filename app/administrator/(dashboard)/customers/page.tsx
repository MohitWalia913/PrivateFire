import { getAdminSession } from '@/lib/admin/auth'
import AdminCustomersClient from '@/components/admin/AdminCustomersClient'

export default async function AdminCustomersPage() {
  const admin = await getAdminSession()
  if (!admin) return null

  return <AdminCustomersClient adminEmail={admin.email} />
}
