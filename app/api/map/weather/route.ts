import { NextRequest, NextResponse } from 'next/server'

/**
 * Open-Meteo (free, no key): sample grid of current temp, humidity, wind in a bbox.
 * @see https://open-meteo.com/en/docs
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const south = Number(sp.get('south'))
  const west = Number(sp.get('west'))
  const north = Number(sp.get('north'))
  const east = Number(sp.get('east'))
  const cols = Math.min(12, Math.max(3, Number(sp.get('cols')) || 7))
  const rows = Math.min(12, Math.max(3, Number(sp.get('rows')) || 5))

  if (![south, west, north, east].every(n => Number.isFinite(n)) || south >= north || west >= east) {
    return NextResponse.json({ error: 'Invalid bbox: need south, west, north, east' }, { status: 400 })
  }

  const latStep = rows > 1 ? (north - south) / (rows - 1) : 0
  const lonStep = cols > 1 ? (east - west) / (cols - 1) : 0
  const latitudes: number[] = []
  const longitudes: number[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      latitudes.push(south + r * latStep)
      longitudes.push(west + c * lonStep)
    }
  }

  const u = new URL('https://api.open-meteo.com/v1/forecast')
  u.searchParams.set('latitude', latitudes.map(n => n.toFixed(4)).join(','))
  u.searchParams.set('longitude', longitudes.map(n => n.toFixed(4)).join(','))
  u.searchParams.set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m')
  u.searchParams.set('wind_speed_unit', 'mph')
  u.searchParams.set('temperature_unit', 'fahrenheit')

  const res = await fetch(u.toString(), { next: { revalidate: 0 } })
  if (!res.ok) {
    return NextResponse.json({ error: 'Open-Meteo request failed' }, { status: 502 })
  }

  const raw = (await res.json()) as {
    current?: {
      temperature_2m?: number | number[]
      relative_humidity_2m?: number | number[]
      wind_speed_10m?: number | number[]
      wind_direction_10m?: number | number[]
    }
  }

  const cur = raw.current
  if (!cur) {
    return NextResponse.json({ attribution: 'Open-Meteo.com', grid: [], generatedAt: new Date().toISOString() })
  }

  const asArr = (v: number | number[] | undefined, len: number): (number | null)[] => {
    if (v === undefined) return Array(len).fill(null)
    if (Array.isArray(v)) return v.map(x => (typeof x === 'number' ? x : null))
    return Array(len).fill(v)
  }

  const n = latitudes.length
  const tempArr = asArr(cur.temperature_2m, n)
  const humArr = asArr(cur.relative_humidity_2m, n)
  const wsArr = asArr(cur.wind_speed_10m, n)
  const wdArr = asArr(cur.wind_direction_10m, n)

  const grid = latitudes.map((lat, i) => ({
    lat,
    lng: longitudes[i],
    temperatureF: tempArr[i] ?? null,
    humidityPct: humArr[i] ?? null,
    windMph: wsArr[i] ?? null,
    windDeg: wdArr[i] ?? null,
  }))

  return NextResponse.json({
    attribution: 'Weather: Open-Meteo.com',
    generatedAt: new Date().toISOString(),
    grid,
  })
}
