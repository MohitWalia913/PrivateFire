import { NextRequest, NextResponse } from 'next/server'

import { sendEmailWithResend } from '@/lib/email/resend'
import { getSupabaseServerClient } from '@/lib/supabase/server'

type IncomingAlert = {
  name: string
  distanceMiles: number
  acres: number
  contained: number
}

function matchesThreshold(threshold: 'any' | 'major' | 'critical', alert: IncomingAlert): boolean {
  if (threshold === 'any') return true
  if (threshold === 'major') return alert.acres >= 100 || alert.contained < 75
  return alert.contained < 25
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userId = body?.userId as string | undefined
    const alerts = (body?.alerts || []) as IncomingAlert[]

    if (!userId || !Array.isArray(alerts)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    const [{ data: settings }, { data: app }, { data: existingNotifications }] = await Promise.all([
      supabase
        .from('user_alert_settings')
        .select('email_alerts, alert_radius_miles, threshold')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('coverage_applications')
        .select('email, first_name')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('user_alert_notifications')
        .select('incident_name')
        .eq('user_id', userId),
    ])

    if (!settings?.email_alerts || !app?.email) {
      return NextResponse.json({ success: true, sent: 0 })
    }

    const alreadySent = new Set((existingNotifications || []).map(r => r.incident_name))
    const candidateAlerts = alerts
      .filter(a => a.distanceMiles <= settings.alert_radius_miles)
      .filter(a => matchesThreshold(settings.threshold, a))
      .filter(a => !alreadySent.has(a.name))
      .slice(0, 5)

    if (candidateAlerts.length === 0) {
      return NextResponse.json({ success: true, sent: 0 })
    }

    await sendEmailWithResend({
      to: app.email,
      subject: `${candidateAlerts.length} new wildfire alert${candidateAlerts.length > 1 ? 's' : ''} near your property`,
      html: `
        <h2>Private Fire Alert Update</h2>
        <p>Hi ${app.first_name || 'there'},</p>
        <p>We detected new fire activity within your configured alert radius.</p>
        <ul>
          ${candidateAlerts
            .map(
              a =>
                `<li><strong>${a.name}</strong> - ${a.distanceMiles.toFixed(1)} mi away, ${a.acres.toLocaleString()} acres, ${a.contained}% contained</li>`,
            )
            .join('')}
        </ul>
        <p>Open your dashboard for live map and updates.</p>
      `,
    })

    const { error: insertError } = await supabase.from('user_alert_notifications').insert(
      candidateAlerts.map(a => ({
        user_id: userId,
        incident_name: a.name,
      })),
    )

    if (insertError) {
      console.error('Failed to store alert notification records:', insertError)
    }

    return NextResponse.json({ success: true, sent: candidateAlerts.length })
  } catch (error) {
    console.error('Alert dispatch error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
