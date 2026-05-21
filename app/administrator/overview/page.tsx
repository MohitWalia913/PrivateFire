import { getAdminSession } from '@/lib/admin/auth'
import AdminOverviewClient from '@/components/admin/AdminOverviewClient'

export default async function AdminOverviewPage() {
  const admin = await getAdminSession()
  if (!admin) return null

  return <AdminOverviewClient adminEmail={admin.email} />
}
