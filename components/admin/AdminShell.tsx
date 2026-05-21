'use client'

import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminShell({
  adminEmail,
  title,
  description,
  children,
}: {
  adminEmail: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#f4f4f5]">
      <AdminSidebar adminEmail={adminEmail} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
          {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
