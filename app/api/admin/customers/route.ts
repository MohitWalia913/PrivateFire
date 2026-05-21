import { NextResponse } from 'next/server'
import { adminApiGuard } from '@/lib/admin/api-guard'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  const { error } = await adminApiGuard()
  if (error) return error

  const supabase = getSupabaseServerClient()

  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select(
      'user_id, first_name, last_name, phone, city, state, zip_code, coverage_status, created_at, updated_at',
    )
    .order('updated_at', { ascending: false })

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  const userIds = (profiles || []).map(p => p.user_id)
  const { data: applications } = userIds.length
    ? await supabase
        .from('coverage_applications')
        .select('user_id, email, submitted, approved, submitted_at')
        .in('user_id', userIds)
    : { data: [] }

  const appByUser = new Map((applications || []).map(a => [a.user_id, a]))

  const customers = (profiles || []).map(p => {
    const app = appByUser.get(p.user_id)
    return {
      userId: p.user_id,
      name: [p.first_name, p.last_name].filter(Boolean).join(' ') || '—',
      email: app?.email ?? '—',
      phone: p.phone,
      location: [p.city, p.state, p.zip_code].filter(Boolean).join(', ') || '—',
      coverageStatus: p.coverage_status,
      applicationSubmitted: !!app?.submitted,
      applicationApproved: !!app?.approved,
      submittedAt: app?.submitted_at,
      updatedAt: p.updated_at,
    }
  })

  return NextResponse.json({ customers })
}
