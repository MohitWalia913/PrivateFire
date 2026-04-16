import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, phone, email } = body

    // Log the lead (in production, send email to info@webds.com via Resend/SendGrid/etc.)
    console.log('=== NEW LEAD FROM PRIVATE FIRE ===')
    console.log(`Name: ${firstName} ${lastName}`)
    console.log(`Email: ${email}`)
    console.log(`Phone: ${phone}`)
    console.log(`Time: ${new Date().toISOString()}`)
    console.log('===================================')

    // TODO: Integrate email service (Resend/SendGrid) to forward to info@webds.com
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'leads@privatefireapp.com',
    //   to: 'info@webds.com',
    //   subject: `New Fire Protection Lead: ${firstName} ${lastName}`,
    //   html: `<p>Name: ${firstName} ${lastName}</p><p>Email: ${email}</p><p>Phone: ${phone}</p>`
    // })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
