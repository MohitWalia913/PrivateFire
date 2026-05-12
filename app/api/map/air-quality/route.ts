import { NextRequest, NextResponse } from 'next/server'
import { normalizeAirNowBbox } from '@/lib/map-bbox'
import { fetchForecastSitesForBBox, type ForecastAgg } from '@/lib/airnow-forecast'

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
  kind: 'observation' | 'forecast'
  reportingArea?: string | null
  stateCode?: string | null
  forecastDate?: string | null
  /** Human-readable PM2.5 / O₃ lines when kind === forecast */
  forecastSummary?: string | null
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

function extractObservationRows(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    for (const k of ['data', 'Data', 'observations', 'Observations', 'results', 'Results']) {
      const v = o[k]
      if (Array.isArray(v)) return v
    }
  }
  return []
}

/** AirNow expects UTC hour bounds like 2026-05-12T14 (see ACT / docs.airnowapi.org). */
function airNowUtcHourRange(): { startdate: string; enddate: string } {
  const end = new Date()
  end.setUTCMinutes(0, 0, 0)
  const start = new Date(end.getTime() - 2 * 3600 * 1000)
  const fmt = (d: Date) => {
    const y = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')
    const h = String(d.getUTCHours()).padStart(2, '0')
    return `${y}-${m}-${day}T${h}`
  }
  return { startdate: fmt(start), enddate: fmt(end) }
}

function parseAirNowPayload(raw: unknown): Omit<AirQualitySite, 'kind'>[] {
  const rows = extractObservationRows(raw)
  const out: Omit<AirQualitySite, 'kind'>[] = []
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

function forecastAggToSites(agg: Map<string, ForecastAgg>, forecastDayUtc: string): AirQualitySite[] {
  const out: AirQualitySite[] = []
  for (const a of agg.values()) {
    const parts: string[] = []
    if (a.pm25 && a.pm25.aqi >= 0) parts.push(`PM2.5 ${a.pm25.aqi} (${a.pm25.cat})`)
    if (a.o3 && a.o3.aqi >= 0) parts.push(`O₃ ${a.o3.aqi} (${a.o3.cat})`)
    if (parts.length === 0) continue

    const aqis = [a.pm25?.aqi, a.o3?.aqi].filter((x): x is number => x != null && x >= 0)
    const worst = Math.max(...aqis)
    let cat = ''
    if (a.pm25 && worst === a.pm25.aqi) cat = a.pm25.cat
    else if (a.o3 && worst === a.o3.aqi) cat = a.o3.cat

    out.push({
      kind: 'forecast',
      lat: a.lat,
      lng: a.lng,
      aqi: worst,
      parameter: 'Forecast',
      category: cat || null,
      siteName: a.reportingArea,
      observedUtc: null,
      reportingArea: a.reportingArea,
      stateCode: a.stateCode || null,
      forecastDate: forecastDayUtc,
      forecastSummary: parts.join(' · '),
    })
  }
  return out
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.AIRNOW_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json(
      {
        sites: [] as AirQualitySite[],
        observations: [] as AirQualitySite[],
        forecasts: [] as AirQualitySite[],
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
  const { startdate, enddate } = airNowUtcHourRange()

  const headers = {
    Accept: 'application/json',
    'User-Agent': 'PrivateFire/1.0 (+https://www.privatefire.com map proxy)',
  }

  type Attempt = { parameters: string; useUtcHours: boolean }
  const attempts: Attempt[] = [
    { parameters: 'PM25', useUtcHours: true },
    { parameters: 'pm25', useUtcHours: true },
    { parameters: 'PM25', useUtcHours: false },
    { parameters: 'pm25', useUtcHours: false },
  ]

  let bodyText = ''
  let upstreamStatus = 502

  for (const a of attempts) {
    const u = new URL(AIRNOW_DATA_URL)
    u.searchParams.set('bbox', bbox)
    u.searchParams.set('parameters', a.parameters)
    u.searchParams.set('monitortype', '0')
    u.searchParams.set('datatype', 'B')
    u.searchParams.set('format', 'application/json')
    u.searchParams.set('verbose', '1')
    u.searchParams.set('includerawconcentrations', '0')
    if (a.useUtcHours) {
      u.searchParams.set('startdate', startdate)
      u.searchParams.set('enddate', enddate)
    }
    u.searchParams.set('api_key', apiKey)

    try {
      const r = await fetch(u.toString(), { headers, cache: 'no-store' })
      bodyText = await r.text()
      upstreamStatus = r.status
      if (r.ok) break
      if (r.status !== 400 && r.status !== 404 && r.status !== 422) break
    } catch {
      bodyText = 'network error'
      upstreamStatus = 502
      break
    }
  }

  const upstreamOk = upstreamStatus >= 200 && upstreamStatus < 300

  if (!upstreamOk) {
    const clientStatus =
      upstreamStatus === 401 || upstreamStatus === 403 ? upstreamStatus : upstreamStatus === 429 ? 429 : 502
    return NextResponse.json(
      {
        error: `AirNow error ${upstreamStatus}`,
        detail: bodyText.slice(0, 800),
        sites: [] as AirQualitySite[],
        observations: [] as AirQualitySite[],
        forecasts: [] as AirQualitySite[],
      },
      { status: clientStatus },
    )
  }

  let raw: unknown
  try {
    raw = JSON.parse(bodyText) as unknown
  } catch {
    return NextResponse.json(
      {
        error: 'Invalid JSON from AirNow',
        detail: bodyText.slice(0, 300),
        sites: [] as AirQualitySite[],
        observations: [] as AirQualitySite[],
        forecasts: [] as AirQualitySite[],
      },
      { status: 502 },
    )
  }

  const rawObs = parseAirNowPayload(raw)
  const byKey = new Map<string, AirQualitySite>()
  for (const o of rawObs) {
    const site: AirQualitySite = { ...o, kind: 'observation' }
    const key = `${site.lat.toFixed(4)},${site.lng.toFixed(4)}`
    const prev = byKey.get(key)
    const prevAqi = prev?.aqi ?? -1
    const nextAqi = site.aqi ?? -1
    if (!prev || nextAqi >= prevAqi) byKey.set(key, site)
  }
  const observations = [...byKey.values()]

  const forecastDayUtc = new Date().toISOString().slice(0, 10)
  let forecasts: AirQualitySite[] = []
  try {
    const agg = await fetchForecastSitesForBBox({
      south,
      west,
      north,
      east,
      apiKey,
      headers,
      grid: 3,
    })
    forecasts = forecastAggToSites(agg, forecastDayUtc)
  } catch {
    forecasts = []
  }

  const sites = [...observations, ...forecasts]

  return NextResponse.json({
    attribution:
      'Air quality: U.S. EPA AirNow — observations (/aq/data/) and forecast reporting areas (/aq/forecast/latLong/). Preliminary; not for regulatory use.',
    disclaimer:
      'AirNow data are preliminary. See https://www.airnow.gov/ and https://docs.airnowapi.org/webservices .',
    generatedAt: new Date().toISOString(),
    bbox: { south, west, north, east },
    observations,
    forecasts,
    sites,
  })
}
