'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Application = {
  userId: string
  name: string
  email: string
  phone: string
  address: string
  propertyType: string
  homeValue: string
  hasInsurance: string
  additionalInfo: string | null
  submitted: boolean
  approved: boolean
  submittedAt: string | null
  status: string
}

type Filter = 'all' | 'received' | 'pending' | 'approved' | 'submitted'

export default function AdminApplicationsClient({ adminEmail }: { adminEmail: string }) {
  const [applications, setApplications] = useState<Application[]>([])
  const [filter, setFilter] = useState<Filter>('received')
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch(`/api/admin/applications?filter=${filter}`)
        if (cancelled || !res.ok) return
        const json = await res.json()
        setApplications(json.applications || [])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [filter, reloadKey])

  const selectFilter = (next: Filter) => {
    setFilter(next)
    setLoading(true)
    setMessage('')
  }

  const approve = async (userId: string) => {
    setApproving(userId)
    setMessage('')
    try {
      const res = await fetch('/api/admin/applications/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (!res.ok) {
        setMessage('Approval failed.')
        return
      }
      setMessage('Application approved and customer notified by email.')
      setReloadKey(k => k + 1)
    } catch {
      setMessage('Approval failed.')
    } finally {
      setApproving(null)
    }
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: 'received', label: 'Received (pending)' },
    { id: 'submitted', label: 'All submitted' },
    { id: 'approved', label: 'Approved' },
    { id: 'all', label: 'All records' },
  ]

  return (
    <AdminShell
      adminEmail={adminEmail}
      title="Applications"
      description="Review submitted coverage applications and approve members."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => selectFilter(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === t.id
                ? 'bg-orange-500 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {message ? (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>
            {loading ? 'Loading…' : `${applications.length} application(s)`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!loading && applications.length === 0 ? (
            <p className="text-sm text-gray-500">No applications in this filter.</p>
          ) : (
            applications.map(app => (
              <div
                key={app.userId}
                className="rounded-xl border border-gray-200 bg-gray-50/50 p-4"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{app.name}</p>
                    <p className="text-sm text-gray-600">{app.email}</p>
                    <p className="text-xs text-gray-500 mt-1">{app.address}</p>
                  </div>
                  <Badge
                    variant={
                      app.status === 'approved'
                        ? 'success'
                        : app.status === 'pending'
                          ? 'warning'
                          : 'outline'
                    }
                  >
                    {app.status}
                  </Badge>
                </div>
                <div className="mb-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
                  <span>Property: {app.propertyType}</span>
                  <span>Value: {app.homeValue || '—'}</span>
                  <span>Insurance: {app.hasInsurance || '—'}</span>
                </div>
                {app.additionalInfo ? (
                  <p className="mb-3 text-xs text-gray-500">{app.additionalInfo}</p>
                ) : null}
                {app.submitted && !app.approved ? (
                  <Button
                    size="sm"
                    disabled={approving === app.userId}
                    onClick={() => void approve(app.userId)}
                  >
                    {approving === app.userId ? 'Approving…' : 'Approve application'}
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </AdminShell>
  )
}
