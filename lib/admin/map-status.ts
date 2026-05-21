import {
  buildAllWmsLayers,
  buildInitialLayerState,
  type OverlayLayerId,
} from '@/lib/map-layers-config'

/** Layers currently enabled in the public map by default (production baseline). */
export const ACTIVE_BASE_VIEWS = [
  { id: 'streets', label: 'Streets basemap', provider: 'CARTO / OpenStreetMap' },
  { id: 'satellite', label: 'Satellite basemap', provider: 'Esri World Imagery' },
  { id: 'terrain', label: 'Terrain basemap', provider: 'OpenTopoMap' },
] as const

/** Overlays confirmed working in current build (toggle in Layers panel). */
export const ACTIVE_OVERLAY_LAYERS: Array<{
  id: OverlayLayerId | 'activeFires' | 'heatmap'
  label: string
  provider: string
  defaultOn: boolean
}> = [
  { id: 'activeFires', label: 'Active incidents', provider: 'CAL FIRE GeoJSON API', defaultOn: true },
  { id: 'heatmap', label: 'Risk heatmap', provider: 'CAL FIRE incidents (derived)', defaultOn: true },
  { id: 'weatherGrid', label: 'Weather grid', provider: 'Open-Meteo', defaultOn: false },
  { id: 'windField', label: 'Wind field', provider: 'Open-Meteo', defaultOn: false },
  { id: 'airQuality', label: 'Air quality', provider: 'EPA AirNow', defaultOn: false },
  { id: 'activeFirePerimeters', label: 'Active fire perimeters', provider: 'Esri Living Atlas', defaultOn: false },
]

export const MAP_DATA_SOURCES = [
  { name: 'CAL FIRE incidents', type: 'Live API', endpoint: '/api/calfire/geojson', status: 'active' as const },
  { name: 'Open-Meteo weather', type: 'Live API', endpoint: '/api/map/weather', status: 'active' as const },
  { name: 'EPA AirNow', type: 'Live API', endpoint: '/api/map/air-quality', status: 'active' as const },
  { name: 'Esri wildfire perimeters', type: 'Live API', endpoint: '/api/map/wildfire-perimeters', status: 'active' as const },
  { name: 'Caltrans road closures', type: 'Live API', endpoint: '/api/map/road-closures', status: 'active' as const },
  { name: 'OpenStreetMap POIs', type: 'Overpass', endpoint: '/api/map/water-pois, /api/map/emergency-pois', status: 'active' as const },
  { name: 'CAL FIRE / CA GIS WMS', type: 'WMS', endpoint: 'egis.fire.ca.gov, services.gis.ca.gov', status: 'partial' as const },
  { name: 'NASA GIBS thermal', type: 'WMS', endpoint: 'gibs.earthdata.nasa.gov', status: 'optional' as const },
  { name: 'Fire cameras', type: 'Static links', endpoint: 'lib/fire-camera-sites.ts', status: 'placeholder' as const },
]

export function getActiveWmsLayers() {
  const initial = buildInitialLayerState()
  return buildAllWmsLayers()
    .filter(l => initial[l.id])
    .map(l => ({
      id: l.id,
      label: l.label,
      category: l.category,
      wmsUrl: l.wmsUrl,
      defaultOn: l.defaultOn,
    }))
}

export function getOverlayLayerStatus() {
  const initial = buildInitialLayerState()
  return ACTIVE_OVERLAY_LAYERS.map(l => ({
    ...l,
    enabledByDefault: initial[l.id] ?? false,
  }))
}

export function countActiveLayerStack() {
  const wmsOn = getActiveWmsLayers().length
  const overlaysOn = getOverlayLayerStatus().filter(o => o.enabledByDefault).length
  const basemapViews = 2 // satellite + terrain user-facing toggles (streets is default)
  return { wmsOn, overlaysOn, basemapViews, total: wmsOn + overlaysOn + basemapViews }
}
