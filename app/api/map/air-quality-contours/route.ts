import { NextRequest, NextResponse } from 'next/server'
import type { FeatureCollection } from 'geojson'
import { normalizeAirNowBbox } from '@/lib/map-bbox'
import { airNowKmlToFeatureCollection } from '@/lib/airnow-contours'

/** Matches AirNow contour map DATE parameter (UTC hour). */
function contourDateUtcHour(): string {
  const d = new Date()
  d.setUTCMinutes(0, 0, 0)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const h = String(d.getUTCHours()).padStart(2, '0')
  return `${y}-${m}-${day}T${h}`
}

async function fetchContourKml(path: string, bbox: string, dateHour: string, apiKey: string): Promise<string | null> {
  const headers = {
    Accept: 'application/vnd.google-earth.kml+xml, application/xml, text/xml, */*',
    'User-Agent': 'PrivateFire/1.0 (+https://www.privatefire.com map proxy)',
  }

  const tryFetch = async (upperKey: boolean) => {
    const u = new URL(`https://www.airnowapi.org/aq/kml/${path}/`)
    u.searchParams.set('DATE', dateHour)
    u.searchParams.set('BBOX', bbox)
    u.searchParams.set('SRS', 'EPSG:4326')
    if (upperKey) u.searchParams.set('API_KEY', apiKey)
    else u.searchParams.set('api_key', apiKey)
    const r = await fetch(u.toString(), { headers, cache: 'no-store' })
    if (!r.ok) return null
    return await r.text()
  }

  return (await tryFetch(true)) ?? (await tryFetch(false))
}

function mergeFeatures(a: FeatureCollection, b: FeatureCollection): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [...a.features, ...b.features],
  }
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.AIRNOW_API_KEY?.trim()
  if (!apiKey) {
    return NextResponse.json({ type: 'FeatureCollection', features: [] }, { status: 503 })
  }

  const sp = req.nextUrl.searchParams
  const southIn = Number(sp.get('south'))
  const westIn = Number(sp.get('west'))
  const northIn = Number(sp.get('north'))
  const eastIn = Number(sp.get('east'))

  if (![southIn, westIn, northIn, eastIn].every(n => Number.isFinite(n))) {
    return NextResponse.json({ error: 'Invalid bbox' }, { status: 400 })
  }

  const { south, west, north, east } = normalizeAirNowBbox({
    south: southIn,
    west: westIn,
    north: northIn,
    east: eastIn,
  })

  const bboxStr = `${west},${south},${east},${north}`
  const dateHour = contourDateUtcHour()

  let merged: FeatureCollection = { type: 'FeatureCollection', features: [] }

  const ozoneXml = await fetchContourKml('Ozone', bboxStr, dateHour, apiKey)
  if (ozoneXml?.includes('<')) {
    merged = mergeFeatures(merged, airNowKmlToFeatureCollection(ozoneXml, 'O3'))
  }

  let pmXml =
    (await fetchContourKml('PM25', bboxStr, dateHour, apiKey)) ??
    (await fetchContourKml('PM2.5', bboxStr, dateHour, apiKey))
  if (pmXml?.includes('<')) {
    merged = mergeFeatures(merged, airNowKmlToFeatureCollection(pmXml, 'PM25'))
  }

  return NextResponse.json({
    ...merged,
    attribution:
      'Contour overlays: EPA AirNow KML (O₃ / PM2.5) — preliminary; see https://docs.airnowapi.org/webservices',
    generatedAt: new Date().toISOString(),
    bbox: { south, west, north, east },
    contourDateUtc: dateHour,
  })
}
