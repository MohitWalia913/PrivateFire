import { NextRequest, NextResponse } from 'next/server'

/** Shelters, hospitals, staging — OpenStreetMap Overpass (subset). */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const south = Number(sp.get('south'))
  const west = Number(sp.get('west'))
  const north = Number(sp.get('north'))
  const east = Number(sp.get('east'))

  if (![south, west, north, east].every(n => Number.isFinite(n)) || south >= north || west >= east) {
    return NextResponse.json({ type: 'FeatureCollection', features: [] }, { status: 400 })
  }

  if (north - south > 0.5 || east - west > 0.5) {
    return NextResponse.json({
      type: 'FeatureCollection',
      features: [],
      notice: 'Zoom in — emergency POI query limited for performance.',
    })
  }

  const q = `
[out:json][timeout:25];
(
  node["amenity"="hospital"](${south},${west},${north},${east});
  node["amenity"="clinic"](${south},${west},${north},${east});
  node["amenity"="shelter"](${south},${west},${north},${east});
  node["emergency"="assembly_point"](${south},${west},${north},${east});
  node["amenity"="police"](${south},${west},${north},${east});
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
        lat?: number
        lon?: number
        center?: { lat: number; lon: number }
        tags?: Record<string, string>
      }
      const lat = o.lat ?? o.center?.lat
      const lng = o.lon ?? o.center?.lon
      if (typeof lat !== 'number' || typeof lng !== 'number') continue
      features.push({
        type: 'Feature',
        properties: o.tags || {},
        geometry: { type: 'Point', coordinates: [lng, lat] },
      })
    }

    return NextResponse.json({
      type: 'FeatureCollection',
      features,
      attribution: 'Emergency POIs: © OpenStreetMap contributors (verify before ops use)',
    })
  } catch {
    return NextResponse.json({ type: 'FeatureCollection', features: [] })
  }
}
