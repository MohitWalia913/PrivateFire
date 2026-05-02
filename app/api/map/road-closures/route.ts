import { NextRequest, NextResponse } from 'next/server'

/** Caltrans wildfire-related emergency road closures (ArcGIS FeatureServer). */
const FEATURE_LAYER =
  'https://services1.arcgis.com/8CpMUd3fdw6aXef7/arcgis/rest/services/Caltrans_Wildfire_Emergency_Road_Closures/FeatureServer/0/query'

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
  if (span > 8) {
    return NextResponse.json({
      type: 'FeatureCollection',
      features: [],
      notice: 'Zoom in (bbox too large for road closure query).',
    })
  }

  const geom = {
    xmin: west,
    ymin: south,
    xmax: east,
    ymax: north,
    spatialReference: { wkid: 4326 },
  }

  const u = new URL(FEATURE_LAYER)
  u.searchParams.set('f', 'geojson')
  u.searchParams.set('where', '1=1')
  u.searchParams.set('outFields', '*')
  u.searchParams.set('returnGeometry', 'true')
  u.searchParams.set('geometry', JSON.stringify(geom))
  u.searchParams.set('geometryType', 'esriGeometryEnvelope')
  u.searchParams.set('inSR', '4326')
  u.searchParams.set('spatialRel', 'esriSpatialRelIntersects')
  u.searchParams.set('outSR', '4326')

  try {
    const res = await fetch(u.toString(), { next: { revalidate: 60 } })
    if (!res.ok) return NextResponse.json({ type: 'FeatureCollection', features: [] }, { status: 200 })
    const data = await res.json()
    return NextResponse.json({
      ...data,
      attribution: 'Road closures: Caltrans (CA Open Data)',
    })
  } catch {
    return NextResponse.json({ type: 'FeatureCollection', features: [] })
  }
}
