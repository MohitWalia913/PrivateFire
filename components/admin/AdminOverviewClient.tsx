'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { BarChart } from '@/components/admin/BarChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type OverviewPayload = {
  adminNotificationEmail: string
  stats: {
    customers: number
    applicationsSubmitted: number
    applicationsPending: number
    applicationsApproved: number
    activeFires: number
  }
  charts: {
    applicationsByStatus: Array<{ label: string; value: number; color: string }>
    coverageByStatus: Array<{ label: string; value: number; color: string }>
  }
  dataSources: Array<{ name: string; type: string; endpoint: string; status: string }>
  activeLayers: {
    basemaps: string[]
    wms: Array<{ id: string; label: string; category: string }>
    overlays: Array<{ id: string; label: string; provider: string; enabledByDefault: boolean }>
    summary: { wmsOn: number; overlaysOn: number; basemapViews: number; total: number }
  }
}

export default function AdminOverviewClient({ adminEmail }: { adminEmail: string }) {
  const [data, setData] = useState<OverviewPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch('/api/admin/overview')
        if (res.ok) setData(await res.json())
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <AdminShell adminEmail={adminEmail} title="Overview" description="Loading dashboard…">
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      </AdminShell>
    )
  }

  if (!data) {
    return (
      <AdminShell adminEmail={adminEmail} title="Overview" description="Unable to load admin data.">
        <p className="text-sm text-red-600">Failed to load overview. Check service role key and Supabase tables.</p>
      </AdminShell>
    )
  }

  const statCards = [
    { label: 'Customers', value: data.stats.customers },
    { label: 'Submitted apps', value: data.stats.applicationsSubmitted },
    { label: 'Pending review', value: data.stats.applicationsPending },
    { label: 'Approved', value: data.stats.applicationsApproved },
    { label: 'Active CAL FIRE incidents', value: data.stats.activeFires },
  ]

  return (
    <AdminShell
      adminEmail={adminEmail}
      title="Overview"
      description="Live map data sources, active layers, and application pipeline."
    >
      <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
        <strong>Admin notification email (Resend):</strong>{' '}
        <code className="rounded bg-white px-1.5 py-0.5">{data.adminNotificationEmail}</code>
        <span className="ml-2 text-orange-700">— new & updated applications are sent here.</span>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map(s => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-2xl">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>Received vs approved vs draft</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart items={data.charts.applicationsByStatus} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer coverage</CardTitle>
            <CardDescription>Profile coverage_status counts</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart items={data.charts.coverageByStatus} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current data sources</CardTitle>
            <CardDescription>APIs and feeds used by the map today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                    <th className="py-2 pr-2">Source</th>
                    <th className="py-2 pr-2">Type</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dataSources.map(src => (
                    <tr key={src.name} className="border-b border-gray-100">
                      <td className="py-2.5 pr-2 font-medium text-gray-900">{src.name}</td>
                      <td className="py-2.5 pr-2 text-gray-600">{src.type}</td>
                      <td className="py-2.5">
                        <Badge
                          variant={
                            src.status === 'active'
                              ? 'success'
                              : src.status === 'partial'
                                ? 'warning'
                                : 'outline'
                          }
                        >
                          {src.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active map layers</CardTitle>
            <CardDescription>
              Default-on stack: {data.activeLayers.summary.total} layers · basemap views: satellite + terrain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">WMS (default on)</p>
              <ul className="space-y-1 text-sm text-gray-700">
                {data.activeLayers.wms.map(l => (
                  <li key={l.id}>
                    {l.label} <span className="text-gray-400">({l.category})</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Overlays (working toggles)</p>
              <ul className="space-y-1 text-sm">
                {data.activeLayers.overlays.map(o => (
                  <li key={o.id} className="flex items-center justify-between gap-2">
                    <span className="text-gray-700">{o.label}</span>
                    <Badge variant={o.enabledByDefault ? 'success' : 'outline'}>
                      {o.enabledByDefault ? 'default on' : 'toggle'}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  )
}
