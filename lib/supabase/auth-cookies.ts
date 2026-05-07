/** Optional shared cookie domain e.g. `privatefire.com` across `app.` / `www.` (see env). */
export function authCookieOptions(): { domain: string } | undefined {
  const raw =
    typeof process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN === 'string'
      ? process.env.NEXT_PUBLIC_AUTH_COOKIE_DOMAIN.trim()
      : ''
  if (!raw) return undefined
  return { domain: raw.replace(/^\./, '') }
}
