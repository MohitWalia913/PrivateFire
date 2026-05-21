/** Primary master admin (dashboard + Resend notifications). */
export const MASTER_ADMIN_EMAIL = 'lgm10@humboldt.edu'

export function getMasterAdminEmail(): string {
  return process.env.MASTER_ADMIN_EMAIL?.trim() || MASTER_ADMIN_EMAIL
}

/** Admin notification inbox for Resend (new/updated applications). */
export function getAdminNotificationEmail(): string {
  return (
    process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    getMasterAdminEmail()
  )
}

/** Emails allowed to access /administrator and admin APIs. */
export function getAdminAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAILS?.trim()
  const fromEnv = raw
    ? raw.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
    : []
  const master = getMasterAdminEmail().toLowerCase()
  const notify = getAdminNotificationEmail().toLowerCase()
  return [...new Set([master, notify, ...fromEnv])]
}

export function adminApplicationsUrl(): string {
  const base = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://app.privatefire.com'
  return `${base.replace(/\/$/, '')}/administrator/applications`
}
