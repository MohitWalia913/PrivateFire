declare module '@mapbox/togeojson' {
  import type { FeatureCollection } from 'geojson'

  /** AirNow KML → GeoJSON (DOM from @xmldom/xmldom). */
  const toGeoJSON: {
    kml: (doc: unknown) => FeatureCollection
  }
  export default toGeoJSON
}
