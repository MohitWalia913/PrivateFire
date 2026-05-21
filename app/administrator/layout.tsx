import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin/auth'

export default async function AdministratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdminSession()
  if (!admin) {
    redirect('/login?error=Admin+access+required')
  }

  return <>{children}</>
}
