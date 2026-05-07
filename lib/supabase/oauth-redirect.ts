/** Blocks open redirects — only allow same-origin paths (safe for server + client). */
export function oauthSafeNext(raw: string | null): string {
  if (!raw || raw.startsWith('//')) return '/dashboard'
  return raw.startsWith('/') ? raw : '/dashboard'
}
