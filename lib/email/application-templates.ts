import 'server-only'

type ApplicationDetails = {
  fullName: string
  email: string
  phone?: string
  addressLine?: string
  propertyType?: string
  homeValue?: string
  currentInsurance?: string
  notes?: string
}

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'https://app.privatefire.com'
}

function renderEmailShell({
  preheader,
  title,
  intro,
  bodyHtml,
  ctaLabel,
  ctaUrl,
}: {
  preheader: string
  title: string
  intro: string
  bodyHtml: string
  ctaLabel?: string
  ctaUrl?: string
}): string {
  const actionHtml =
    ctaLabel && ctaUrl
      ? `
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 18px;">
          <tr>
            <td align="center" style="border-radius:999px;background:#f97316;">
              <a href="${ctaUrl}" style="display:inline-block;padding:14px 24px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                ${ctaLabel}
              </a>
            </td>
          </tr>
        </table>
      `
      : ''

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background:#f8f7f5;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f7f5;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#ea580c,#9a3412);padding:28px 28px 24px;">
                <div style="font-size:30px;line-height:1;margin-bottom:10px;">🔥</div>
                <div style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:0.2px;">PRIVATE FIRE</div>
                <div style="font-size:13px;color:#ffedd5;margin-top:8px;">${preheader}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;color:#111827;">${title}</h1>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#4b5563;">
                  ${intro}
                </p>
                ${actionHtml}
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;border-top:1px solid #e5e7eb;background:#fff7ed;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#9a3412;">© 2026 Private Fire. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function buildAdminApplicationEmail(action: 'submitted' | 'updated', details: ApplicationDetails): string {
  return renderEmailShell({
    preheader: 'Application operations',
    title: action === 'submitted' ? 'New application submitted' : 'Application updated',
    intro:
      action === 'submitted'
        ? 'A new Private Fire application was submitted and is now pending review.'
        : 'An existing Private Fire application was updated by the applicant.',
    ctaLabel: 'Open Dashboard',
    ctaUrl: `${appUrl()}/dashboard/bids`,
    bodyHtml: `
      <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#374151;"><strong>Name:</strong> ${details.fullName}</p>
      <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#374151;"><strong>Email:</strong> ${details.email}</p>
      <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#374151;"><strong>Phone:</strong> ${details.phone || 'Not provided'}</p>
      <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#374151;"><strong>Address:</strong> ${details.addressLine || 'Not provided'}</p>
      <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#374151;"><strong>Property Type:</strong> ${details.propertyType || 'Not provided'}</p>
      <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#374151;"><strong>Home Value:</strong> ${details.homeValue || 'Not provided'}</p>
      <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#374151;"><strong>Current Insurance:</strong> ${details.currentInsurance || 'Not provided'}</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#374151;"><strong>Notes:</strong> ${details.notes || 'None provided'}</p>
    `,
  })
}

export function buildApplicantSubmittedOrUpdatedEmail(firstName: string, action: 'submitted' | 'updated'): string {
  return renderEmailShell({
    preheader: 'Application status update',
    title: action === 'submitted' ? 'Application received' : 'Application updated',
    intro:
      action === 'submitted'
        ? `Hi ${firstName}, we received your Private Fire application and your status is now pending review.`
        : `Hi ${firstName}, we received your updated Private Fire application details.`,
    ctaLabel: 'View Application',
    ctaUrl: `${appUrl()}/dashboard/bids`,
    bodyHtml: `
      <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#6b7280;">
        Our underwriting team will review your property details and contact you within 2-3 business days.
      </p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
        If you need to add more information, reply to this email and we will assist.
      </p>
    `,
  })
}

export function buildApplicantApprovedEmail(firstName: string): string {
  return renderEmailShell({
    preheader: 'Coverage activation',
    title: 'Congratulations - your application is approved',
    intro: `Hi ${firstName}, great news. Your Private Fire application has been approved and your coverage is now active.`,
    ctaLabel: 'Open Dashboard',
    ctaUrl: `${appUrl()}/dashboard`,
    bodyHtml: `
      <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#6b7280;">
        Your account now has active coverage status and full access to fire alerts, monitoring, and protection tools.
      </p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
        Welcome to the Private Fire protected network.
      </p>
    `,
  })
}

export function buildApplicantRejectedEmail(firstName: string): string {
  return renderEmailShell({
    preheader: 'Application status update',
    title: 'Your application status was updated',
    intro: `Hi ${firstName}, your application approval status was updated by our team.`,
    ctaLabel: 'Review Status',
    ctaUrl: `${appUrl()}/dashboard/bids`,
    bodyHtml: `
      <p style="margin:0 0 10px;font-size:13px;line-height:1.6;color:#6b7280;">
        At this time your application is not marked as approved. This can happen when additional review is required.
      </p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#6b7280;">
        Please reply to this email if you want help with next steps or additional documentation.
      </p>
    `,
  })
}
