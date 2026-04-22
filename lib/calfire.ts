export type CalFireIncident = {
  Name: string
  Final: boolean
  Updated: string
  Started: string
  AdminUnit: string | null
  AdminUnitUrl: string | null
  County: string
  Location: string
  AcresBurned: number
  PercentContained: number
  ControlStatement: string | null
  AgencyNames: string | null
  Longitude: number
  Latitude: number
  Type: string
  UniqueId: string
  Url: string | null
  ExtinguishedDate: string | null
  ExtinguishedDateOnly: string | null
  StartedDateOnly: string | null
  IsActive: boolean
  CalFireIncident: boolean
  NotificationDesired: boolean
}

type GeoJsonFeature = {
  type: string
  geometry: { type: string; coordinates: [number, number] }
  properties: CalFireIncident
}

type GeoJsonResponse = {
  type: string
  features: GeoJsonFeature[]
}

const LIST_URL = '/api/calfire/list'
const GEOJSON_URL = '/api/calfire/geojson'
export const CALFIRE_REFRESH_MS = 5 * 60 * 1000

export async function fetchCalFireList(inactive = true): Promise<CalFireIncident[]> {
  const res = await fetch(`${LIST_URL}?inactive=${inactive}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`CAL FIRE list failed: ${res.status}`)
  const data = (await res.json()) as CalFireIncident[]
  return Array.isArray(data) ? data : []
}

export async function fetchCalFireGeoJson(inactive = true): Promise<CalFireIncident[]> {
  const res = await fetch(`${GEOJSON_URL}?inactive=${inactive}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`CAL FIRE geojson failed: ${res.status}`)
  const data = (await res.json()) as GeoJsonResponse
  return Array.isArray(data?.features)
    ? data.features.map(feature => feature.properties).filter(item => Number(item?.Latitude) && Number(item?.Longitude))
    : []
}

export function toRelativeTime(timestamp: string): string {
  if (!timestamp) return 'Updated recently'
  const then = new Date(timestamp).getTime()
  if (Number.isNaN(then)) return 'Updated recently'
  const diffMins = Math.max(1, Math.floor((Date.now() - then) / 60000))
  if (diffMins < 60) return `Updated ${diffMins}m ago`
  const hours = Math.floor(diffMins / 60)
  if (hours < 24) return `Updated ${hours}h ago`
  const days = Math.floor(hours / 24)
  return `Updated ${days}d ago`
}

export function haversineMiles(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 3958.8
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const aa =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa))
  return R * c
}

export function computeRiskScore(
  incidents: CalFireIncident[],
  center: { lat: number; lng: number },
): { score: number; level: 'Low' | 'Moderate' | 'High' | 'Extreme' } {
  const active = incidents.filter(i => i.IsActive)
  if (active.length === 0) return { score: 8, level: 'Low' }

  let score = 0
  for (const incident of active) {
    const distance = haversineMiles(center.lat, center.lng, incident.Latitude, incident.Longitude)
    const distanceWeight = distance < 10 ? 1 : distance < 25 ? 0.7 : distance < 50 ? 0.4 : 0.2
    const acresWeight = Math.min(incident.AcresBurned / 5000, 1)
    const containmentWeight = (100 - (incident.PercentContained || 0)) / 100
    score += (acresWeight * 0.6 + containmentWeight * 0.4) * distanceWeight * 30
  }

  const bounded = Math.max(5, Math.min(98, Math.round(score)))
  const level = bounded >= 80 ? 'Extreme' : bounded >= 60 ? 'High' : bounded >= 35 ? 'Moderate' : 'Low'
  return { score: bounded, level }
}
