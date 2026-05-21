'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Flame,
  LogOut,
  Map,
} from 'lucide-react'

const nav = [
  { href: '/administrator/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/administrator/customers', label: 'Customers', icon: Users },
  { href: '/administrator/applications', label: 'Applications', icon: FileText },
]

export default function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Private Fire</p>
          <p className="text-sm font-semibold text-gray-900">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2 border-t border-gray-200 p-3">
        <p className="truncate px-3 text-xs text-gray-500" title={adminEmail}>
          {adminEmail}
        </p>
        <Link
          href="/map"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <Map className="h-4 w-4" />
          Public map
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>
    </aside>
  )
}
