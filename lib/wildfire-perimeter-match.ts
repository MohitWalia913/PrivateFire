import type { CalFireIncident } from '@/lib/calfire'
import { pointInGeoJSON } from '@/lib/geo-point-in-polygon'

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\bfire\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function nameScore(incidentName: string, perimeterName: string): number {
  const a = norm(incidentName)
  const b = norm(perimeterName)
  if (!a || !b) return 0
  if (a === b) return 95
  if (b.includes(a) || a.includes(b)) return 75
  const ta = new Set(a.split(' ').filter(Boolean))
  const tb = new Set(b.split(' ').filter(Boolean))
  let overlap = 0
  for (const w of ta) if (tb.has(w) && w.length > 2) overlap++
  if (overlap >= 2) return 55
  if (overlap === 1) return 35
  return 0
}

function acreHarmony(esriAcres: unknown, incidentAcres: number): number {
  const g = typeof esriAcres === 'number' ? esriAcres : Number(esriAcres)
  if (!Number.isFinite(g) || g <= 0 || incidentAcres <= 0) return 0
  const r = g / incidentAcres
  if (r >= 0.2 && r <= 5) return 22
  if (r >= 0.08 && r <= 12) return 12
  return 0
}

export type PerimeterPickResult = {
  feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
  score: number
}

/**
 * Pick the Living Atlas perimeter feature that best matches a CAL FIRE point incident.
 */
export function pickMatchingPerimeter(
  features: GeoJSON.Feature[],
  incident: CalFireIncident,
): PerimeterPickResult | null {
  const lng = incident.Longitude
  const lat = incident.Latitude
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null

  let best: PerimeterPickResult | null = null

  for (const f of features) {
    if (!f.geometry) continue
    if (f.geometry.type !== 'Polygon' && f.geometry.type !== 'MultiPolygon') continue

    const props = (f.properties || {}) as Record<string, unknown>
    const incLabel = String(props.IncidentName ?? props.Label ?? props.ComplexName ?? '').trim()
    let score = nameScore(incident.Name, incLabel)

    const irwin = props.IRWINID != null ? String(props.IRWINID).trim() : ''
    const uid = String(incident.UniqueId ?? '').trim()
    if (irwin && uid && (irwin === uid || irwin.includes(uid) || uid.includes(irwin))) {
      score += 85
    }

    score += acreHarmony(props.GISAcres, incident.AcresBurned || 0)

    try {
      if (pointInGeoJSON(lng, lat, f.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon)) {
        score += 48
      }
    } catch {
      continue
    }

    if (!best || score > best.score) {
      best = { feature: f as GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>, score }
    }
  }

  if (!best) return null

  const props = (best.feature.properties || {}) as Record<string, unknown>
  const uid = String(incident.UniqueId ?? '').trim()
  let inside = false
  try {
    inside = pointInGeoJSON(lng, lat, best.feature.geometry)
  } catch {
    return null
  }
  const irwinOk = irwinMatches(props, uid)
  const acresPts = acreHarmony(props.GISAcres, incident.AcresBurned || 0)
  const nm = nameScore(incident.Name, String(props.IncidentName ?? props.Label ?? '').trim())

  const trustworthy =
    irwinOk ||
    inside ||
    (nm >= 75 && acresPts >= 12) ||
    (nm >= 55 && acresPts >= 22 && best.score >= 85)

  if (!trustworthy) return null

  return best
}

function irwinMatches(props: Record<string, unknown>, uid: string): boolean {
  if (!uid || uid.length < 4) return false
  const irwin = props.IRWINID != null ? String(props.IRWINID).trim() : ''
  return !!(irwin && (irwin === uid || irwin.includes(uid) || uid.includes(irwin)))
}
