/** Max lat/lng span for AirNow bbox queries — avoids oversized requests after viewport normalization. */
export const AIRNOW_MAX_BBOX_SPAN_DEG = 22

export function clampLatitude(lat: number): number {
  return Math.max(-85, Math.min(85, lat))
}

/** Longitude in (-180, 180] — fixes Leaflet bounds after repeated horizontal panning. */
export function wrapLongitude(lng: number): number {
  const x = ((((lng + 180) % 360) + 360) % 360) - 180
  return x === -180 ? 180 : x
}

/**
 * Builds a sane west/east/south/north box for EPA AirNow:
 * wraps longitudes, optionally recenters when the view crosses the antimeridian or is wider than MAX_SPAN.
 */
export function normalizeAirNowBbox(input: {
  south: number
  west: number
  north: number
  east: number
}): { south: number; west: number; north: number; east: number } {
  const MAX = AIRNOW_MAX_BBOX_SPAN_DEG
  let south = clampLatitude(input.south)
  let north = clampLatitude(input.north)
  if (south > north) [south, north] = [north, south]

  let west = wrapLongitude(input.west)
  let east = wrapLongitude(input.east)

  if (west > east) {
    const spanEastward = 360 - west + east
    const mid = wrapLongitude(west + spanEastward / 2)
    const half = MAX / 2
    west = wrapLongitude(mid - half)
    east = wrapLongitude(mid + half)
  }

  const latMid = (south + north) / 2
  if (north - south > MAX) {
    const half = MAX / 2
    south = clampLatitude(latMid - half)
    north = clampLatitude(latMid + half)
    if (south >= north) north = south + 0.02
  }

  const lngMid = (west + east) / 2
  if (east - west > MAX) {
    const half = MAX / 2
    west = wrapLongitude(lngMid - half)
    east = wrapLongitude(lngMid + half)
    if (west >= east) east = west + 0.02
  }

  return { south, west, north, east }
}
