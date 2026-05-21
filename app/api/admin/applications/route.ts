import { NextResponse } from 'next/server'
import { adminApiGuard } from '@/lib/admin/api-guard'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { error } = await adminApiGuard()
  if (error) return error

  const filter = new URL(req.url).searchParams.get('filter') || 'all'

  const supabase = getSupabaseServerClient()
  const { data, error: dbError } = await supabase
    .from('coverage_applications')
    .select('*')
    .order('submitted_at', { ascending: false, nullsFirst: false })

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  let rows = data || []
  if (filter === 'submitted') rows = rows.filter(r => r.submitted)
  if (filter === 'pending') rows = rows.filter(r => r.submitted && !r.approved)
  if (filter === 'approved') rows = rows.filter(r => r.approved)
  if (filter === 'received') rows = rows.filter(r => r.submitted && !r.approved)

  const applications = rows.map(r => ({
    userId: r.user_id,
    name: `${r.first_name} ${r.last_name}`.trim(),
    email: r.email,
    phone: r.phone,
    address: `${r.address}, ${r.city}, ${r.state} ${r.zip}`.trim(),
    propertyType: r.property_type,
    homeValue: r.home_value,
    hasInsurance: r.has_insurance,
    additionalInfo: r.additional_info,
    submitted: r.submitted,
    approved: r.approved,
    submittedAt: r.submitted_at,
    approvedAt: r.approved_at,
    status: r.approved ? 'approved' : r.submitted ? 'pending' : 'draft',
  }))

  return NextResponse.json({ applications })
}
