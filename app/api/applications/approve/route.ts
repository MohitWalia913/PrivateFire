import { NextRequest, NextResponse } from 'next/server'

import { buildApplicantApprovedEmail } from '@/lib/email/application-templates'
import { sendEmailWithResend } from '@/lib/email/resend'
import { getSupabaseServerClient } from '@/lib/supabase/server'

function getRequiredEnv(name: 'ADMIN_APPROVAL_SECRET'): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export async function POST(req: NextRequest) {
  try {
    const providedSecret = req.headers.get('x-admin-secret')
    const expectedSecret = getRequiredEnv('ADMIN_APPROVAL_SECRET')

    if (!providedSecret || providedSecret !== expectedSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const userId = body?.userId as string | undefined
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const approvedAt = new Date().toISOString()

    const { error: appUpdateError } = await supabase
      .from('coverage_applications')
      .update({
        approved: true,
        approved_at: approvedAt,
      })
      .eq('user_id', userId)

    if (appUpdateError) throw appUpdateError

    const { error: profileUpdateError } = await supabase
      .from('user_profiles')
      .update({
        coverage_status: 'active',
      })
      .eq('user_id', userId)

    if (profileUpdateError) throw profileUpdateError

    const { data: app, error: appFetchError } = await supabase
      .from('coverage_applications')
      .select('first_name, email')
      .eq('user_id', userId)
      .maybeSingle()

    if (appFetchError) throw appFetchError

    if (app?.email) {
      await sendEmailWithResend({
        to: app.email,
        subject: 'Your Private Fire application was approved',
        html: buildApplicantApprovedEmail(app.first_name || 'there'),
      })
    }

    return NextResponse.json({ success: true, approvedAt })
  } catch (error) {
    console.error('Application approval error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
