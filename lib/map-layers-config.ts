/**
 * Map layer definitions for FireMap: WMS sources + ids for dynamic overlays.
 * Attribution: respect each provider’s terms; many services are update-limited.
 */

export type WmsLayerCategory =
  | 'fire'
  | 'risk'
  | 'boundaries'
  | 'management'
  | 'emergency'
  | 'satellite'

export interface WmsLayerConfig {
  id: string
  label: string
  desc: string
  color: string
  defaultOn: boolean
  wmsUrl: string
  wmsLayers: string
  opacity: number
  category: WmsLayerCategory
  /** OGC WMS version (GIBS often works best with 1.3.0) */
  wmsVersion?: '1.1.1' | '1.3.0'
}

/** Dynamic overlay toggles (not WMS) — handled in useDynamicMapLayers */
export const OVERLAY_LAYER_IDS = [
  'weatherGrid',
  'windField',
  'roadClosures',
  'activeFirePerimeters',
  'waterSources',
  'emergencyPois',
  'fireCameras',
  'crewTracking',
] as const

export type OverlayLayerId = (typeof OVERLAY_LAYER_IDS)[number]

export const CALFIRE_WMS_LAYERS: WmsLayerConfig[] = [
  {
    id: 'fhsz',
    label: 'Fire Hazard Severity Zones',
    desc: 'State zones: Moderate / High / Very High',
    color: '#dc2626',
    defaultOn: true,
    wmsUrl: 'https://services.gis.ca.gov/arcgis/services/Environment/Fire_Severity_Zones/MapServer/WMSServer',
    wmsLayers: '0',
    opacity: 0.5,
    category: 'risk',
  },
  {
    id: 'perimeters',
    label: 'Historical Fire Perimeters',
    desc: 'Past burn boundaries (FRAP, long archive)',
    color: '#7c3aed',
    defaultOn: false,
    wmsUrl: 'https://egis.fire.ca.gov/arcgis/services/FRAP/FirePerimeters_FS/MapServer/WMSServer',
    wmsLayers: '0',
    opacity: 0.55,
    category: 'risk',
  },
  {
    id: 'sra',
    label: 'State Responsibility Areas',
    desc: 'Fire protection jurisdiction by agency',
    color: '#0ea5e9',
    defaultOn: false,
    wmsUrl: 'https://egis.fire.ca.gov/arcgis/services/FRAP/SRA/MapServer/WMSServer',
    wmsLayers: '0',
    opacity: 0.4,
    category: 'boundaries',
  },
  {
    id: 'management',
    label: 'Forest Management Projects',
    desc: 'Fuel treatment & reduction projects',
    color: '#059669',
    defaultOn: false,
    wmsUrl: 'https://egis.fire.ca.gov/arcgis/services/CalMapper/CalMAPPER_Public/MapServer/WMSServer',
    wmsLayers: '0',
    opacity: 0.55,
    category: 'management',
  },
]

/** Cal OES aggregated evacuation zones (public MapServer WMS). */
export const EVACUATION_WMS: WmsLayerConfig = {
  id: 'evacuationZones',
  label: 'Evacuation Zones',
  desc: 'Cal OES aggregated warnings & orders (refresh ~10 min)',
  color: '#b45309',
  defaultOn: false,
  wmsUrl:
    'https://services.arcgis.com/BLN4oKB0N1YSgvY8/arcgis/services/CA_EVACUATIONS_CalOESHosted_view/MapServer/WMSServer',
  wmsLayers: '0',
  opacity: 0.55,
  category: 'emergency',
  wmsVersion: '1.3.0',
}

/**
 * NASA GIBS — no MAP_KEY; thermal anomalies (VIIRS NOAA-20). Near real-time browse imagery.
 * @see https://wiki.earthdata.nasa.gov/display/GIBS
 */
export const GIBS_THERMAL_WMS: WmsLayerConfig = {
  id: 'gibsThermal',
  label: 'Satellite Thermal (VIIRS)',
  desc: 'NASA GIBS VIIRS thermal anomalies — FIRMS-style hotspot context',
  color: '#ea580c',
  defaultOn: false,
  wmsUrl: 'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi',
  wmsLayers: 'VIIRS_NOAA20_Thermal_Anomalies_375m_All',
  opacity: 0.65,
  category: 'satellite',
  wmsVersion: '1.3.0',
}

/** Optional NASA FIRMS WMS — requires free MAP_KEY from firms.modaps.eosdis.nasa.gov */
export function getNasaFirmsLayerConfig(mapKey: string | undefined): WmsLayerConfig | null {
  if (!mapKey?.trim()) return null
  const key = mapKey.trim()
  return {
    id: 'nasaFirmsViirs',
    label: 'NASA FIRMS VIIRS (24h)',
    desc: 'LANCE FIRMS active fire — requires NEXT_PUBLIC_NASA_FIRMS_MAP_KEY',
    color: '#f43f5e',
    defaultOn: false,
    wmsUrl: `https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/${key}/`,
    wmsLayers: 'fires_viirs_noaa20_24',
    opacity: 0.7,
    category: 'satellite',
    wmsVersion: '1.1.1',
  }
}

export const WMS_LAYER_GROUPS: { key: WmsLayerCategory; title: string }[] = [
  { key: 'risk', title: 'Risk & Hazard Zones' },
  { key: 'boundaries', title: 'Administrative Boundaries' },
  { key: 'management', title: 'Management' },
  { key: 'emergency', title: 'Emergency & Evacuation' },
  { key: 'satellite', title: 'Satellite & Detection' },
]

export function buildAllWmsLayers(): WmsLayerConfig[] {
  const firms = getNasaFirmsLayerConfig(
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_NASA_FIRMS_MAP_KEY : undefined,
  )
  const list = [...CALFIRE_WMS_LAYERS, EVACUATION_WMS, GIBS_THERMAL_WMS]
  if (firms) list.push(firms)
  return list
}

export function buildInitialLayerState(): Record<string, boolean> {
  const s: Record<string, boolean> = { activeFires: true, heatmap: true }
  for (const l of buildAllWmsLayers()) {
    s[l.id] = l.defaultOn
  }
  for (const id of OVERLAY_LAYER_IDS) {
    s[id] = false
  }
  return s
}
