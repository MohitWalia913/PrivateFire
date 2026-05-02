import { NextRequest, NextResponse } from 'next/server'

/**
 * OpenStreetMap via Overpass API — hydrants, tanks, reservoirs (subset).
 * Rate-limited public service; keep bbox small.
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const south = Number(sp.get('south'))
  const west = Number(sp.get('west'))
  const north = Number(sp.get('north'))
  const east = Number(sp.get('east'))

  if (![south, west, north, east].every(n => Number.isFinite(n)) || south >= north || west >= east) {
    return NextResponse.json({ type: 'FeatureCollection', features: [] }, { status: 400 })
  }

  const latSpan = north - south
  const lonSpan = east - west
  if (latSpan > 0.35 || lonSpan > 0.35) {
    return NextResponse.json({
      type: 'FeatureCollection',
      features: [],
      notice: 'Zoom in — water assets query limited to ~25 mi boxes.',
    })
  }

  const q = `
[out:json][timeout:25];
(
  node["emergency"="fire_hydrant"](${south},${west},${north},${east});
  node["amenity"="drinking_water"](${south},${west},${north},${east});
  node["man_made"="water_tower"](${south},${west},${north},${east});
  node["natural"="spring"](${south},${west},${north},${east});
  way["water"="reservoir"](${south},${west},${north},${east});
);
out center;
`.trim()

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(q)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      next: { revalidate: 300 },
    })
    if (!res.ok) return NextResponse.json({ type: 'FeatureCollection', features: [] })
    const osm = (await res.json()) as { elements?: unknown[] }

    const features: Array<{
      type: 'Feature'
      properties: Record<string, unknown>
      geometry: { type: 'Point'; coordinates: [number, number] }
    }> = []
    for (const el of osm.elements || []) {
      const o = el as {
        type: string
        lat?: number
        lon?: number
        center?: { lat: number; lon: number }
        tags?: Record<string, string>
        id: number
      }
      const lat = o.lat ?? o.center?.lat
      const lng = o.lon ?? o.center?.lon
      if (typeof lat !== 'number' || typeof lng !== 'number') continue
      const tags = o.tags || {}
      let kind = 'water'
      if (tags.emergency === 'fire_hydrant') kind = 'hydrant'
      else if (tags.water === 'reservoir' || (o.type === 'way' && tags.natural)) kind = 'reservoir'
      else if (tags.man_made === 'water_tower') kind = 'tower'

      features.push({
        type: 'Feature',
        properties: { ...tags, _kind: kind },
        geometry: { type: 'Point', coordinates: [lng, lat] },
      })
    }

    return NextResponse.json({
      type: 'FeatureCollection',
      features,
      attribution: 'Water features: © OpenStreetMap contributors',
    })
  } catch {
    return NextResponse.json({ type: 'FeatureCollection', features: [] })
  }
}
