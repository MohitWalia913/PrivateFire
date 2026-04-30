import 'server-only'

type SendEmailArgs = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

function getRequiredEnv(name: 'RESEND_API_KEY'): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

function getFromEmail(): string {
  const explicitFrom =
    process.env.RESEND_FROM_EMAIL ||
    process.env.RESEND_SENDER_EMAIL ||
    process.env.SMTP_FROM_EMAIL

  if (explicitFrom) return explicitFrom

  // Fallback to your configured sender to avoid silent failures when env naming differs.
  return 'nooreply@contact.privatefire.com'
}

export async function sendEmailWithResend({ to, subject, html, replyTo }: SendEmailArgs) {
  const apiKey = getRequiredEnv('RESEND_API_KEY')
  const from = getFromEmail()

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
