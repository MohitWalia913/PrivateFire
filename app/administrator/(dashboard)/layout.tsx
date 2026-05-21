import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin/auth'

export default async function AdministratorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdminSession()
  if (!admin) {
    redirect('/administrator/login')
  }

  return <>{children}</>
}
