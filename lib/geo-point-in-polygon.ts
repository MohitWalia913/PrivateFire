/** Ray casting — GeoJSON rings use [lng, lat]. Exterior ring first; holes optional. */

export function pointInRing(lng: number, lat: number, ring: number[][]): boolean {
  if (ring.length < 3) return false
  let inside = false
  const x = lng
  const y = lat
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0]
    const yi = ring[i][1]
    const xj = ring[j][0]
    const yj = ring[j][1]
    const denom = yj - yi
    if (denom === 0) continue
    const intersect =
      (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / denom + xi
    if (intersect) inside = !inside
  }
  return inside
}

/** Single Polygon coordinates: array of rings (outer + holes). */
export function pointInPolygonCoords(lng: number, lat: number, rings: number[][][]): boolean {
  if (!rings?.length) return false
  const outer = rings[0]
  if (!pointInRing(lng, lat, outer)) return false
  for (let h = 1; h < rings.length; h++) {
    if (pointInRing(lng, lat, rings[h])) return false
  }
  return true
}

export function pointInGeoJSON(
  lng: number,
  lat: number,
  geom: GeoJSON.Polygon | GeoJSON.MultiPolygon,
): boolean {
  if (geom.type === 'Polygon') {
    return pointInPolygonCoords(lng, lat, geom.coordinates as number[][][])
  }
  const polys = geom.coordinates as number[][][][]
  for (const poly of polys) {
    if (pointInPolygonCoords(lng, lat, poly)) return true
  }
  return false
}
