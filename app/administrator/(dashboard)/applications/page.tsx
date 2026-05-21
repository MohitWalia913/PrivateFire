import { getAdminSession } from '@/lib/admin/auth'
import AdminApplicationsClient from '@/components/admin/AdminApplicationsClient'

export default async function AdminApplicationsPage() {
  const admin = await getAdminSession()
  if (!admin) return null

  return <AdminApplicationsClient adminEmail={admin.email} />
}
