import { NextRequest, NextResponse } from 'next/server'

import { buildAdminApplicationEmail, buildApplicantSubmittedOrUpdatedEmail } from '@/lib/email/application-templates'
import { sendEmailWithResend } from '@/lib/email/resend'

const ADMIN_EMAIL = 'laythenmartines0@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      action,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zip,
      propertyType,
      homeValue,
      currentInsurance,
      notes,
    } = body as Record<string, string | undefined>

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 })
    }

    const fullName = `${firstName} ${lastName}`.trim()
    const safeNotes = notes?.trim() || 'None provided'
    const safeFirstName = firstName.trim() || 'there'

    const normalizedAction = action === 'updated' ? 'updated' : 'submitted'
    const adminSubject =
      normalizedAction === 'updated'
        ? `Application updated: ${fullName}`
        : `New application submitted: ${fullName}`
    const userSubject =
      normalizedAction === 'updated'
        ? 'Your Private Fire application was updated'
        : 'We received your Private Fire application'

    await sendEmailWithResend({
      to: ADMIN_EMAIL,
      subject: adminSubject,
      replyTo: email,
      html: buildAdminApplicationEmail(normalizedAction, {
        fullName,
        email,
        phone,
        addressLine: `${address || ''}, ${city || ''}, ${state || ''} ${zip || ''}`.trim(),
        propertyType,
        homeValue,
        currentInsurance,
        notes: safeNotes,
      }),
    })

    await sendEmailWithResend({
      to: email,
      subject: userSubject,
      html: buildApplicantSubmittedOrUpdatedEmail(safeFirstName, normalizedAction),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Application email notification error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
