import { NextRequest, NextResponse } from 'next/server'

import { buildApplicantApprovedEmail, buildApplicantRejectedEmail } from '@/lib/email/application-templates'
import { sendEmailWithResend } from '@/lib/email/resend'
import { getSupabaseServerClient } from '@/lib/supabase/server'

function getRequiredEnv(name: 'SUPABASE_STATUS_WEBHOOK_SECRET'): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function getProvidedSecret(req: NextRequest): string | null {
  const direct = req.headers.get('x-webhook-secret')
  if (direct) return direct

  const auth = req.headers.get('authorization')
  if (auth?.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim()
  }

  const querySecret = req.nextUrl.searchParams.get('secret')
  if (querySecret) return querySecret

  return null
}

function toBoolean(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true') return true
    if (normalized === 'false') return false
  }
  if (typeof value === 'number') {
    if (value === 1) return true
    if (value === 0) return false
  }
  return null
}

type WebhookRecord = {
  user_id?: string
  approved?: boolean
}

type WebhookPayload = {
  type?: string
  schema?: string
  table?: string
  record?: WebhookRecord
  old_record?: WebhookRecord
  oldRecord?: WebhookRecord
}

export async function POST(req: NextRequest) {
  try {
    const secret = getProvidedSecret(req)
    const expected = getRequiredEnv('SUPABASE_STATUS_WEBHOOK_SECRET')
    if (!secret || secret !== expected) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const payload = (await req.json()) as WebhookPayload
    if (payload.table && payload.table !== 'coverage_applications') {
      return NextResponse.json({ success: true, skipped: 'non-coverage table' })
    }

    const oldRecord = payload.old_record || payload.oldRecord
    const newApproved = toBoolean(payload.record?.approved)
    const oldApproved = toBoolean(oldRecord?.approved)
    const userId = payload.record?.user_id

    // Only send when approval actually changes.
    if (!userId || newApproved === null) {
      return NextResponse.json({ success: true, skipped: 'missing user or approved value' })
    }
    if (oldApproved !== null && newApproved === oldApproved) {
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
        html: buildApplicantApprovedEmail(app.first_name || 'there'),
      })
    } else {
      await sendEmailWithResend({
        to: app.email,
        subject: 'Your Private Fire application was marked not approved',
        html: buildApplicantRejectedEmail(app.first_name || 'there'),
      })
    }

    return NextResponse.json({ success: true, sent: true, approved: newApproved })
  } catch (error) {
    console.error('Supabase status webhook email error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
