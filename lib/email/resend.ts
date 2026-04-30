import 'server-only'

type SendEmailArgs = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

function getRequiredEnv(name: 'RESEND_API_KEY' | 'RESEND_FROM_EMAIL'): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export async function sendEmailWithResend({ to, subject, html, replyTo }: SendEmailArgs) {
  const apiKey = getRequiredEnv('RESEND_API_KEY')
  const from = getRequiredEnv('RESEND_FROM_EMAIL')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      reply_to: replyTo,
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Resend API error (${response.status}): ${errText}`)
  }
}
