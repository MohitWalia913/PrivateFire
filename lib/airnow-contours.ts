import type { FeatureCollection } from 'geojson'
import toGeoJSON from '@mapbox/togeojson'
import { DOMParser } from '@xmldom/xmldom'

/** Convert AirNow contour KML (O₃ / PM2.5) to GeoJSON with pollutant tag for styling. */
export function airNowKmlToFeatureCollection(kml: string, pollutant: 'O3' | 'PM25'): FeatureCollection {
  const dom = new DOMParser().parseFromString(kml, 'text/xml')
  const errs = dom.getElementsByTagName('parsererror')
  if (errs?.length) return { type: 'FeatureCollection', features: [] }

  const gj = toGeoJSON.kml(dom) as FeatureCollection
  if (!gj?.features?.length) return { type: 'FeatureCollection', features: [] }

  return {
    type: 'FeatureCollection',
    features: gj.features.map(f => ({
      ...f,
      properties: {
        ...(typeof f.properties === 'object' && f.properties !== null ? f.properties : {}),
        pollutant,
      },
    })),
  }
}
