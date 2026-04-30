import { NextRequest, NextResponse } from 'next/server'

import { sendEmailWithResend } from '@/lib/email/resend'

const ADMIN_EMAIL = 'laythenmartines0@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
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

    await sendEmailWithResend({
      to: ADMIN_EMAIL,
      subject: `New application submitted: ${fullName}`,
      replyTo: email,
      html: `
        <h2>New Private Fire Application</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Address:</strong> ${address || ''}, ${city || ''}, ${state || ''} ${zip || ''}</p>
        <p><strong>Property Type:</strong> ${propertyType || 'Not provided'}</p>
        <p><strong>Home Value:</strong> ${homeValue || 'Not provided'}</p>
        <p><strong>Current Fire Insurance:</strong> ${currentInsurance || 'Not provided'}</p>
        <p><strong>Additional Notes:</strong> ${safeNotes}</p>
      `,
    })

    await sendEmailWithResend({
      to: email,
      subject: 'We received your Private Fire application',
      html: `
        <h2>Application received</h2>
        <p>Hi ${firstName},</p>
        <p>Thanks for submitting your Private Fire application. Our team will review your details and contact you within 2-3 business days.</p>
        <p>If you need to add details, reply to this email.</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Application email notification error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
