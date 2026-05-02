import { NextRequest, NextResponse } from 'next/server'

/** Esri Living Atlas — USA wildfire current incident polygons (includes CA). */
const PERIMETERS_LAYER =
  'https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/USA_Wildfires_v1/FeatureServer/1/query'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const south = Number(sp.get('south'))
  const west = Number(sp.get('west'))
  const north = Number(sp.get('north'))
  const east = Number(sp.get('east'))

  if (![south, west, north, east].every(n => Number.isFinite(n)) || south >= north || west >= east) {
    return NextResponse.json({ type: 'FeatureCollection', features: [], error: 'invalid_bbox' })
  }

  const span = Math.max(north - south, east - west)
  if (span > 12) {
    return NextResponse.json({
      type: 'FeatureCollection',
      features: [],
      notice: 'Zoom in for active perimeter polygons (large bbox skipped).',
    })
  }

  const geom = {
    xmin: west,
    ymin: south,
    xmax: east,
    ymax: north,
    spatialReference: { wkid: 4326 },
  }

  const u = new URL(PERIMETERS_LAYER)
  u.searchParams.set('f', 'geojson')
  u.searchParams.set('where', '1=1')
  u.searchParams.set('outFields', '*')
  u.searchParams.set('returnGeometry', 'true')
  u.searchParams.set('geometry', JSON.stringify(geom))
  u.searchParams.set('geometryType', 'esriGeometryEnvelope')
  u.searchParams.set('inSR', '4326')
  u.searchParams.set('spatialRel', 'esriSpatialRelIntersects')
  u.searchParams.set('outSR', '4326')
  u.searchParams.set('resultRecordCount', '2000')

  try {
    const res = await fetch(u.toString(), { next: { revalidate: 300 } })
    if (!res.ok) return NextResponse.json({ type: 'FeatureCollection', features: [] })
    const data = await res.json()
    return NextResponse.json({
      ...data,
      attribution: 'Active fire perimeters: Esri Living Atlas / interagency contributors',
    })
  } catch {
    return NextResponse.json({ type: 'FeatureCollection', features: [] })
  }
}
