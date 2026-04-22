type CacheEntry = {
  value: unknown
  expiresAt: number
}

const responseCache = new Map<string, CacheEntry>()

export const CALFIRE_CACHE_TTL_MS = 5 * 60 * 1000

export async function getCalFireCached<T>(url: string, ttlMs = CALFIRE_CACHE_TTL_MS): Promise<T> {
  const now = Date.now()
  const existing = responseCache.get(url)
  if (existing && existing.expiresAt > now) {
    return existing.value as T
  }

  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`CAL FIRE upstream failed: ${res.status}`)
  }

  const data = (await res.json()) as T
  responseCache.set(url, {
    value: data,
    expiresAt: now + ttlMs,
  })
  return data
}
