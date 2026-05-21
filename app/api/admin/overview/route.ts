import { NextResponse } from 'next/server'
import { adminApiGuard } from '@/lib/admin/api-guard'
import { getAdminNotificationEmail } from '@/lib/admin/config'
import {
  MAP_DATA_SOURCES,
  getActiveWmsLayers,
  getOverlayLayerStatus,
  countActiveLayerStack,
} from '@/lib/admin/map-status'
import { getCalFireIncidentsFromMapdataCsv } from '@/lib/calfire-mapdata-csv'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const { error } = await adminApiGuard()
  if (error) return error

  const supabase = getSupabaseServerClient()

  const [
    { count: customerCount },
    { data: applications },
  ] = await Promise.all([
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('coverage_applications')
      .select('user_id, submitted, approved, submitted_at, approved_at'),
  ])

  const incidents = getCalFireIncidentsFromMapdataCsv(true)

  const apps = applications || []
  const submitted = apps.filter(a => a.submitted)
  const pending = submitted.filter(a => !a.approved)
  const approved = submitted.filter(a => a.approved)
  const activeIncidents = incidents.filter(i => i.IsActive).length

  const statusCounts = {
    not_covered: 0,
    pending: 0,
    active: 0,
  }
  const { data: profiles } = await supabase.from('user_profiles').select('coverage_status')
  for (const p of profiles || []) {
    const s = p.coverage_status as keyof typeof statusCounts
    if (s in statusCounts) statusCounts[s]++
  }

  const layerStack = countActiveLayerStack()

  return NextResponse.json({
    adminNotificationEmail: getAdminNotificationEmail(),
    stats: {
      customers: customerCount ?? 0,
      applicationsTotal: apps.length,
      applicationsSubmitted: submitted.length,
      applicationsPending: pending.length,
      applicationsApproved: approved.length,
      activeFires: activeIncidents,
      coverageStatus: statusCounts,
    },
    charts: {
      applicationsByStatus: [
        { label: 'Pending review', value: pending.length, color: '#eab308' },
        { label: 'Approved', value: approved.length, color: '#22c55e' },
        { label: 'Draft / not submitted', value: apps.length - submitted.length, color: '#94a3b8' },
      ],
      coverageByStatus: [
        { label: 'Active', value: statusCounts.active, color: '#22c55e' },
        { label: 'Pending', value: statusCounts.pending, color: '#eab308' },
        { label: 'Not covered', value: statusCounts.not_covered, color: '#94a3b8' },
      ],
    },
    dataSources: MAP_DATA_SOURCES,
    activeLayers: {
      basemaps: ['streets', 'satellite', 'terrain'],
      wms: getActiveWmsLayers(),
      overlays: getOverlayLayerStatus(),
      summary: layerStack,
    },
  })
}
