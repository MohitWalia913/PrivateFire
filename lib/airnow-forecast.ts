/** Helpers for AirNow “forecast / latLong” sampling — see https://docs.airnowapi.org/webservices */

export type ForecastAgg = {
  reportingArea: string
  stateCode: string
  lat: number
  lng: number
  pm25?: { aqi: number; cat: string }
  o3?: { aqi: number; cat: string }
}

export function forecastGridPoints(
  south: number,
  west: number,
  north: number,
  east: number,
  grid = 3,
): Array<{ lat: number; lng: number }> {
  const pts: Array<{ lat: number; lng: number }> = []
  const rows = Math.min(5, Math.max(2, grid))
  const cols = rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lat = south + ((north - south) * (r + 0.5)) / rows
      const lng = west + ((east - west) * (c + 0.5)) / cols
      pts.push({ lat, lng })
    }
  }
  return pts
}

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let q = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      q = !q
      continue
    }
    if (!q && ch === ',') {
      out.push(cur)
      cur = ''
      continue
    }
    cur += ch
  }
  out.push(cur)
  return out
}

export function parseForecastCsv(text: string): Array<Record<string, string>> {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const headers = parseCsvLine(lines[0]).map(h => h.replace(/^"|"$/g, ''))
  const rows: Array<Record<string, string>> = []
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]).map(c => c.replace(/^"|"$/g, ''))
    const o: Record<string, string> = {}
    headers.forEach((key, j) => {
      o[key] = cells[j] ?? ''
    })
    rows.push(o)
  }
  return rows
}

function extractForecastRowsJson(raw: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(raw)) return raw as Array<Record<string, unknown>>
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    for (const k of ['data', 'Data', 'forecast', 'Forecast']) {
      const v = o[k]
      if (Array.isArray(v)) return v as Array<Record<string, unknown>>
    }
  }
  return []
}

function jsonRowToStrings(r: Record<string, unknown>): Record<string, string> {
  const o: Record<string, string> = {}
  for (const [k, v] of Object.entries(r)) {
    o[k] = v == null ? '' : String(v)
  }
  return o
}

export function feedForecastRow(
  agg: Map<string, ForecastAgg>,
  row: Record<string, string>,
  dateTarget: string,
): void {
  const df = (row.DateForecast || '').trim()
  if (df !== dateTarget) return

  const lat = parseFloat(row.Latitude)
  const lng = parseFloat(row.Longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

  const area = row.ReportingArea || 'Forecast area'
  const key = `${area}|${lat.toFixed(2)}|${lng.toFixed(2)}`
  const aqiN = parseInt(row.AQI, 10)
  const aqi = Number.isFinite(aqiN) ? aqiN : -1
  const cat = row.CategoryName || ''
  const pname = (row.ParameterName || '').toUpperCase()

  let cur = agg.get(key)
  if (!cur) {
    cur = { reportingArea: area, stateCode: row.StateCode || '', lat, lng }
    agg.set(key, cur)
  }
  if (pname.includes('PM2')) cur.pm25 = { aqi, cat }
  else if (pname.includes('O3') || pname.includes('OZON')) cur.o3 = { aqi, cat }
}

async function fetchForecastAtPoint(
  lat: number,
  lng: number,
  apiKey: string,
  dateStr: string,
  headers: Record<string, string>,
): Promise<Array<Record<string, string>>> {
  const attempts: { upperKey: boolean; format: string }[] = [
    { upperKey: true, format: 'application/json' },
    { upperKey: false, format: 'application/json' },
    { upperKey: true, format: 'text/csv' },
    { upperKey: false, format: 'text/csv' },
  ]

  for (const { upperKey, format } of attempts) {
    const u = new URL('https://www.airnowapi.org/aq/forecast/latLong/')
    u.searchParams.set('latitude', lat.toFixed(5))
    u.searchParams.set('longitude', lng.toFixed(5))
    u.searchParams.set('date', dateStr)
    u.searchParams.set('distance', '50')
    u.searchParams.set('format', format)
    if (upperKey) u.searchParams.set('API_KEY', apiKey)
    else u.searchParams.set('api_key', apiKey)

    try {
      const r = await fetch(u.toString(), { headers, cache: 'no-store' })
      const t = await r.text()
      if (!r.ok || !t.trim()) continue

      const trimmed = t.trim()
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        const raw = JSON.parse(trimmed) as unknown
        const rows = extractForecastRowsJson(raw)
        if (rows.length > 0) return rows.map(jsonRowToStrings)
      }

      if (trimmed.includes('DateForecast')) {
        const csvRows = parseForecastCsv(t)
        if (csvRows.length > 0) return csvRows
      }
    } catch {
      continue
    }
  }

  return []
}

/** Aggregate forecast reporting-area rows across a sampled bbox grid (limits upstream calls). */
export async function fetchForecastSitesForBBox(opts: {
  south: number
  west: number
  north: number
  east: number
  apiKey: string
  headers: Record<string, string>
  grid?: number
}): Promise<Map<string, ForecastAgg>> {
  const dateStr = new Date().toISOString().slice(0, 10)
  const pts = forecastGridPoints(opts.south, opts.west, opts.north, opts.east, opts.grid ?? 3)
  const agg = new Map<string, ForecastAgg>()

  for (const p of pts) {
    const rows = await fetchForecastAtPoint(p.lat, p.lng, opts.apiKey, dateStr, opts.headers)
    for (const row of rows) feedForecastRow(agg, row, dateStr)
  }

  return agg
}
