'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Customer = {
  userId: string
  name: string
  email: string
  phone: string | null
  location: string
  coverageStatus: string
  applicationSubmitted: boolean
  applicationApproved: boolean
  submittedAt: string | null
}

export default function AdminCustomersClient({ adminEmail }: { adminEmail: string }) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch('/api/admin/customers')
        if (res.ok) {
          const json = await res.json()
          setCustomers(json.customers || [])
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const statusVariant = (s: string) => {
    if (s === 'active') return 'success' as const
    if (s === 'pending') return 'warning' as const
    return 'outline' as const
  }

  return (
    <AdminShell adminEmail={adminEmail} title="Customers" description="Registered users and coverage status.">
      <Card>
        <CardHeader>
          <CardTitle>All customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-500">Loading…</p>
          ) : customers.length === 0 ? (
            <p className="text-sm text-gray-500">No customer profiles yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Location</th>
                    <th className="py-2 pr-3">Coverage</th>
                    <th className="py-2">Application</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.userId} className="border-b border-gray-100 hover:bg-gray-50/80">
                      <td className="py-3 pr-3 font-medium text-gray-900">{c.name}</td>
                      <td className="py-3 pr-3 text-gray-600">{c.email}</td>
                      <td className="py-3 pr-3 text-gray-600">{c.location}</td>
                      <td className="py-3 pr-3">
                        <Badge variant={statusVariant(c.coverageStatus)}>{c.coverageStatus}</Badge>
                      </td>
                      <td className="py-3 text-gray-600">
                        {c.applicationApproved
                          ? 'Approved'
                          : c.applicationSubmitted
                            ? 'Submitted'
                            : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  )
}
