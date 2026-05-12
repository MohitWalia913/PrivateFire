import { NextRequest, NextResponse } from 'next/server'
import { normalizeAirNowBbox } from '@/lib/map-bbox'

/** @see https://github.com/briandconnelly/airnow — AirNow bbox query shape */
const AIRNOW_DATA_URL = 'https://www.airnowapi.org/aq/data/'

export type AirQualitySite = {
  lat: number
  lng: number
  aqi: number | null
  parameter: string | null
  category: string | null
  siteName: string | null
  observedUtc: string | null
}

function num(r: Record<string, unknown>, ...keys: string[]): number | null {
  for (const k of keys) {
    const v = r[k]
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v)
  }
  return null
}

function str(r: Record<string, unknown>, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = r[k]
    if (typeof v === 'string' && v.trim() !== '') return v.trim()
  }
  return null
}

function parseAirNowPayload(raw: unknown): AirQualitySite[] {
  const rows = Array.isArray(raw) ? raw : []
  const out: AirQualitySite[] = []
  for (const item of rows) {
    if (!item || typeof item !== 'object') continue
    const r = item as Record<string, unknown>
    const lat = num(r, 'Latitude', 'latitude')
    const lng = num(r, 'Longitude', 'longitude')
    if (lat == null || lng == null) continue
    const aqi = num(r, 'AQI', 'aqi')
    const parameter = str(r, 'ParameterName', 'Parameter', 'parameter')
    const category =
      str(r, 'Category.Name', 'category_name', 'categoryName') ??
      (r['Category'] && typeof r['Category'] === 'object'
        ? str(r['Category'] as Record<string, unknown>, 'Name', 'name')
        : null)
    const siteName = str(r, 'SiteName', 'site_name', 'siteName')
    const observedUtc = str(r, 'UTC', 'datetime_observed', 'DateObserved')
    out.push({ lat, lng, aqi, parameter, category, siteName, observedUtc })
  }
  return out
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.AIRNOW_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json(
      {
        sites: [] as AirQualitySite[],
        attribution: 'Air quality: U.S. EPA AirNow — preliminary observations, not for regulatory use.',
      },
      { status: 503 },
    )
  }

  const sp = req.nextUrl.searchParams
  const southIn = Number(sp.get('south'))
  const westIn = Number(sp.get('west'))
  const northIn = Number(sp.get('north'))
  const eastIn = Number(sp.get('east'))

  if (![southIn, westIn, northIn, eastIn].every(n => Number.isFinite(n))) {
    return NextResponse.json({ error: 'Invalid bbox: need south, west, north, east' }, { status: 400 })
  }

  const { south, west, north, east } = normalizeAirNowBbox({
    south: southIn,
    west: westIn,
    north: northIn,
    east: eastIn,
  })

  const bbox = `${west},${south},${east},${north}`
  const u = new URL(AIRNOW_DATA_URL)
  u.searchParams.set('bbox', bbox)
  u.searchParams.set('parameters', 'pm25')
  u.searchParams.set('monitortype', '0')
  u.searchParams.set('datatype', 'B')
  u.searchParams.set('format', 'application/json')
  u.searchParams.set('verbose', '1')
  u.searchParams.set('includerawconcentrations', '0')
  u.searchParams.set('api_key', apiKey)

  let res: Response
  try {
    res = await fetch(u.toString(), {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    })
  } catch {
    return NextResponse.json({ error: 'AirNow request failed (network)' }, { status: 502 })
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return NextResponse.json(
      {
        error: `AirNow error ${res.status}`,
        detail: text.slice(0, 500),
        sites: [] as AirQualitySite[],
      },
      { status: 502 },
    )
  }

  let raw: unknown
  try {
    raw = await res.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON from AirNow' }, { status: 502 })
  }

  const rawSites = parseAirNowPayload(raw)
  const byKey = new Map<string, AirQualitySite>()
  for (const s of rawSites) {
    const key = `${s.lat.toFixed(4)},${s.lng.toFixed(4)}`
    const prev = byKey.get(key)
    const prevAqi = prev?.aqi ?? -1
    const nextAqi = s.aqi ?? -1
    if (!prev || nextAqi >= prevAqi) byKey.set(key, s)
  }
  const sites = [...byKey.values()]

  return NextResponse.json({
    attribution: 'Air quality: U.S. EPA AirNow — preliminary observations, not for regulatory use.',
    disclaimer:
      'AirNow data are preliminary. See https://www.airnow.gov/ and https://docs.airnowapi.org/ .',
    generatedAt: new Date().toISOString(),
    bbox: { south, west, north, east },
    sites,
  })
}
