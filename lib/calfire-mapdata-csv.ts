import { readFileSync, statSync } from 'fs'
import { join } from 'path'
import type { CalFireIncident } from '@/lib/calfire'

const CSV_PATH = join(process.cwd(), 'app', 'mapdataall.csv')

/** Minimal RFC‑4180–style CSV parse (handles quotes, commas, CRLF, and newlines inside quoted fields). */
function parseCsvCells(content: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0

  const pushField = () => {
    row.push(field)
    field = ''
  }

  while (i < content.length) {
    const c = content[i]

    if (inQuotes) {
      if (c === '"') {
        if (content[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      field += c
      i++
      continue
    }

    switch (c) {
      case '"':
        inQuotes = true
        i++
        break
      case ',':
        pushField()
        i++
        break
      case '\r':
        i++
        break
      case '\n':
        pushField()
        if (row.length > 1 || row[0]?.length > 0) rows.push(row)
        row = []
        i++
        break
      default:
        field += c
        i++
    }
  }

  pushField()
  if (row.length > 1 || row[0]?.length > 0) rows.push(row)
  return rows
}

function parseNum(raw: string, fallback = 0): number {
  const n = Number(String(raw ?? '').trim())
  return Number.isFinite(n) ? n : fallback
}

function csvBool(raw: string | undefined): boolean {
  const t = String(raw ?? '').trim().toUpperCase()
  return t === 'Y' || t === 'TRUE'
}

function nullIfEmpty(raw: string | undefined): string | null {
  const s = String(raw ?? '').trim()
  return s.length ? s : null
}

const HEADER_FIELDS = [
  'incident_name',
  'incident_is_final',
  'incident_date_last_update',
  'incident_date_created',
  'incident_administrative_unit',
  'incident_administrative_unit_url',
  'incident_county',
  'incident_location',
  'incident_acres_burned',
  'incident_containment',
  'incident_control',
  'incident_cooperating_agencies',
  'incident_longitude',
  'incident_latitude',
  'incident_type',
  'incident_id',
  'incident_url',
  'incident_date_extinguished',
  'incident_dateonly_extinguished',
  'incident_dateonly_created',
  'is_active',
  'calfire_incident',
  'notification_desired',
] as const

function rowToIncident(cells: string[]): CalFireIncident | null {
  if (cells.length < HEADER_FIELDS.length) return null
  const r: Record<string, string> = {}
  for (let j = 0; j < HEADER_FIELDS.length; j++) {
    r[HEADER_FIELDS[j]] = cells[j] ?? ''
  }

  const lat = parseNum(r.incident_latitude, NaN)
  const lng = parseNum(r.incident_longitude, NaN)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null
  if (lat === 0 && lng === 0) return null
  if (lat === 1 && lng === 1) return null

  const name = String(r.incident_name ?? '').trim()

  return {
    Name: name,
    Final: csvBool(r.incident_is_final),
    Updated: String(r.incident_date_last_update ?? '').trim(),
    Started: String(r.incident_date_created ?? '').trim(),
    AdminUnit: nullIfEmpty(r.incident_administrative_unit),
    AdminUnitUrl: nullIfEmpty(r.incident_administrative_unit_url),
    County: String(r.incident_county ?? '').trim(),
    Location: String(r.incident_location ?? '').trim(),
    AcresBurned: parseNum(r.incident_acres_burned, 0),
    PercentContained: parseNum(r.incident_containment, 0),
    ControlStatement: nullIfEmpty(r.incident_control),
    AgencyNames: nullIfEmpty(r.incident_cooperating_agencies),
    Longitude: lng,
    Latitude: lat,
    Type: String(r.incident_type ?? '').trim() || 'Wildfire',
    UniqueId: String(r.incident_id ?? '').trim(),
    Url: nullIfEmpty(r.incident_url),
    ExtinguishedDate: nullIfEmpty(r.incident_date_extinguished),
    ExtinguishedDateOnly: nullIfEmpty(r.incident_dateonly_extinguished),
    StartedDateOnly: nullIfEmpty(r.incident_dateonly_created),
    IsActive: csvBool(r.is_active),
    CalFireIncident: csvBool(r.calfire_incident),
    NotificationDesired: csvBool(r.notification_desired),
  }
}

type Cache = { mtimeMs: number; all: CalFireIncident[] }

let cache: Cache | null = null

function loadAllFromDisk(): CalFireIncident[] {
  const st = statSync(CSV_PATH)
  if (cache && cache.mtimeMs === st.mtimeMs) return cache.all

  const raw = readFileSync(CSV_PATH, 'utf8').replace(/^\uFEFF/, '')
  const rows = parseCsvCells(raw)
  if (rows.length < 2) {
    cache = { mtimeMs: st.mtimeMs, all: [] }
    return cache.all
  }

  const header = rows[0].map(h => h.trim().toLowerCase())
  const expected = HEADER_FIELDS.map(h => h.toLowerCase())
  if (header.length < expected.length || !expected.every((h, idx) => header[idx] === h)) {
    cache = { mtimeMs: st.mtimeMs, all: [] }
    return cache.all
  }

  const all: CalFireIncident[] = []
  for (let i = 1; i < rows.length; i++) {
    const inc = rowToIncident(rows[i])
    if (inc) all.push(inc)
  }

  cache = { mtimeMs: st.mtimeMs, all }
  return all
}

/** `includeInactive` matches upstream `inactive=true` (all incidents with coordinates). */
export function getCalFireIncidentsFromMapdataCsv(includeInactive: boolean): CalFireIncident[] {
  const all = loadAllFromDisk()
  if (includeInactive) return all
  return all.filter(i => i.IsActive)
}

export function calFireIncidentsToGeoJson(incidents: CalFireIncident[]) {
  return {
    type: 'FeatureCollection' as const,
    features: incidents.map(p => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [p.Longitude, p.Latitude] as [number, number],
      },
      properties: p,
    })),
  }
}
