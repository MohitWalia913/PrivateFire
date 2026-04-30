import { NextRequest, NextResponse } from 'next/server'

import { sendEmailWithResend } from '@/lib/email/resend'
import { getSupabaseServerClient } from '@/lib/supabase/server'

function getRequiredEnv(name: 'SUPABASE_STATUS_WEBHOOK_SECRET'): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

type WebhookRecord = {
  user_id?: string
  approved?: boolean
}

type WebhookPayload = {
  type?: string
  table?: string
  record?: WebhookRecord
  old_record?: WebhookRecord
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret')
    const expected = getRequiredEnv('SUPABASE_STATUS_WEBHOOK_SECRET')
    if (!secret || secret !== expected) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const payload = (await req.json()) as WebhookPayload
    if (payload.table !== 'coverage_applications') {
      return NextResponse.json({ success: true, skipped: 'non-coverage table' })
    }

    const newApproved = Boolean(payload.record?.approved)
    const oldApproved = Boolean(payload.old_record?.approved)
    const userId = payload.record?.user_id

    // Only send when approval actually changes.
    if (!userId || newApproved === oldApproved) {
      return NextResponse.json({ success: true, skipped: 'no approval state change' })
    }

    const supabase = getSupabaseServerClient()
    const { data: app, error: appError } = await supabase
      .from('coverage_applications')
      .select('first_name, email')
      .eq('user_id', userId)
      .maybeSingle()

    if (appError) throw appError
    if (!app?.email) return NextResponse.json({ success: true, skipped: 'no applicant email' })

    if (newApproved) {
      await sendEmailWithResend({
        to: app.email,
        subject: 'Your Private Fire application was approved',
        html: `
          <h2>Your application is approved</h2>
          <p>Hi ${app.first_name || 'there'},</p>
          <p>Great news - your Private Fire application has been approved and your coverage is now active.</p>
          <p>You can log in to your dashboard to view your updated status and alert settings.</p>
        `,
      })
    } else {
      await sendEmailWithResend({
        to: app.email,
        subject: 'Your Private Fire application status was updated',
        html: `
          <h2>Application status updated</h2>
          <p>Hi ${app.first_name || 'there'},</p>
          <p>Your application approval status was updated by our team.</p>
          <p>Please log in to your dashboard for the latest status, or reply to this email if you have questions.</p>
        `,
      })
    }

    return NextResponse.json({ success: true, sent: true, approved: newApproved })
  } catch (error) {
    console.error('Supabase status webhook email error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
