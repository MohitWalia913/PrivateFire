import { NextResponse } from 'next/server'
import { adminApiGuard } from '@/lib/admin/api-guard'
import { buildApplicantApprovedEmail } from '@/lib/email/application-templates'
import { sendEmailWithResend } from '@/lib/email/resend'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { error } = await adminApiGuard()
  if (error) return error

  const body = (await req.json()) as { userId?: string }
  const userId = body.userId?.trim()
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const supabase = getSupabaseServerClient()
  const approvedAt = new Date().toISOString()

  const { error: appUpdateError } = await supabase
    .from('coverage_applications')
    .update({ approved: true, approved_at: approvedAt })
    .eq('user_id', userId)

  if (appUpdateError) {
    return NextResponse.json({ error: appUpdateError.message }, { status: 500 })
  }

  const { error: profileUpdateError } = await supabase
    .from('user_profiles')
    .update({ coverage_status: 'active' })
    .eq('user_id', userId)

  if (profileUpdateError) {
    return NextResponse.json({ error: profileUpdateError.message }, { status: 500 })
  }

  const { data: app } = await supabase
    .from('coverage_applications')
    .select('first_name, email')
    .eq('user_id', userId)
    .maybeSingle()

  if (app?.email) {
    try {
      await sendEmailWithResend({
        to: app.email,
        subject: 'Your Private Fire application was approved',
        html: buildApplicantApprovedEmail(app.first_name || 'there'),
      })
    } catch (e) {
      console.warn('Approval email failed:', e)
    }
  }

  return NextResponse.json({ success: true, approvedAt })
}
