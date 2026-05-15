/**
 * Leaflet-friendly Lucide icon markup (paths from lucide-react v0.577.0, ISC).
 * Used for AirNow stations / forecasts and Open-Meteo weather overlays.
 */

/** Approximate Open-Meteo temperature coloring — matches map hook breakpoints. */
export function temperatureMarkerColor(f: number | null): string {
  if (f == null || Number.isNaN(f)) return '#94a3b8'
  if (f < 32) return '#3b82f6'
  if (f < 55) return '#22c55e'
  if (f < 75) return '#eab308'
  if (f < 90) return '#f97316'
  return '#dc2626'
}

/** EPA-style AQI swatches (AirNow categories). */
export function aqiMarkerColor(aqi: number | null): string {
  if (aqi == null || Number.isNaN(aqi)) return '#94a3b8'
  if (aqi <= 50) return '#00e400'
  if (aqi <= 100) return '#ffff00'
  if (aqi <= 150) return '#ff7e00'
  if (aqi <= 200) return '#ff0000'
  if (aqi <= 300) return '#8f3f97'
  return '#7e0023'
}

type AqiTier = 'unknown' | 'good' | 'moderate' | 'usg' | 'unhealthy' | 'very_unhealthy' | 'hazardous'

function aqiTier(aqi: number | null): AqiTier {
  if (aqi == null || Number.isNaN(aqi)) return 'unknown'
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'usg'
  if (aqi <= 200) return 'unhealthy'
  if (aqi <= 300) return 'very_unhealthy'
  return 'hazardous'
}

/** Stroke color for icon glyphs on tinted circular badges. */
function glyphStrokeForFill(fill: string): string {
  if (fill === '#ffff00' || fill === '#00e400') return '#14532d'
  return '#ffffff'
}

/** Lucide: gauge — semi-circle meter */
const PATH_GAUGE_A = 'm12 14 4-4'
const PATH_GAUGE_B = 'M3.34 19a10 10 0 1 1 17.32 0'

/** Lucide: leaf */
const PATH_LEAF = [
  'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z',
  'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
]

/** Lucide: cloud-sun */
const PATH_CLOUD_SUN = [
  'M12 2v2',
  'm4.93 4.93 1.41 1.41',
  'M20 12h2',
  'm19.07 4.93-1.41 1.41',
  'M15.947 12.65a4 4 0 0 0-5.925-4.128',
  'M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z',
]

/** Lucide: cloud-fog */
const PATH_CLOUD_FOG = [
  'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
  'M16 17H7',
  'M17 21H9',
]

/** Lucide: triangle-alert */
const PATH_ALERT = [
  'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
  'M12 9v4',
  'M12 17h.01',
]

/** Lucide: skull */
const PATH_SKULL_HEAD =
  'M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z'

/** Lucide: thermometer */
const PATH_THERMOMETER = 'M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z'

function svgPaths(dList: string[], stroke: string, strokeWidth = 2.1): string {
  return dList
    .map(
      d =>
        `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join('')
}

function svgGauge(stroke: string): string {
  return `${svgPaths([PATH_GAUGE_A], stroke)}${svgPaths([PATH_GAUGE_B], stroke)}`
}

function svgSkull(stroke: string): string {
  return `<path d="m12.5 17-.5-1-.5 1h1z" fill="none" stroke="${stroke}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/><path d="${PATH_SKULL_HEAD}" fill="none" stroke="${stroke}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="15" cy="12" r="1" fill="${stroke}"/><circle cx="9" cy="12" r="1" fill="${stroke}"/>`
}

function innerSvgForTier(tier: AqiTier, stroke: string): string {
  switch (tier) {
    case 'unknown':
      return svgGauge(stroke)
    case 'good':
      return svgPaths([...PATH_LEAF], stroke)
    case 'moderate':
      return svgPaths([...PATH_CLOUD_SUN], stroke)
    case 'usg':
      return svgPaths([...PATH_CLOUD_FOG], stroke)
    case 'unhealthy':
      return svgPaths([...PATH_ALERT], stroke)
    case 'very_unhealthy':
    case 'hazardous':
      return svgSkull(stroke)
    default:
      return svgGauge(stroke)
  }
}

/**
 * Round badge + Lucide glyph for an AirNow observation or forecast pin.
 */
export function airQualityLucideMarkerHtml(aqi: number | null, isForecast: boolean): string {
  const fill = aqiMarkerColor(aqi)
  const tier = aqiTier(aqi)
  const glyph = glyphStrokeForFill(fill)
  const borderColor = aqi != null && !Number.isNaN(aqi) && aqi > 100 ? '#0f172a' : '#334155'
  const box = isForecast ? 30 : 26
  const iconPx = isForecast ? 15 : 13
  const borderStyle = isForecast ? `dashed ${borderColor}` : `solid ${borderColor}`

  return `<div style="width:${box}px;height:${box}px;border-radius:9999px;background:${fill};border:2px ${borderStyle};display:flex;align-items:center;justify-content:center;box-shadow:0 1px 5px rgba(0,0,0,.35);">
  <svg xmlns="http://www.w3.org/2000/svg" width="${iconPx}" height="${iconPx}" viewBox="0 0 24 24" style="overflow:visible">${innerSvgForTier(tier, glyph)}</svg>
</div>`
}

/** Temperature sample — Lucide thermometer on colored disk (Open-Meteo grid). */
export function weatherTemperatureMarkerHtml(tempF: number | null): string {
  const fill = temperatureMarkerColor(tempF)
  const baseGlyph = glyphStrokeForFill(fill)
  const glyph = baseGlyph === '#ffffff' ? '#ffffff' : baseGlyph
  const strokeRing = '#ffffff'
  return `<div style="width:26px;height:26px;border-radius:9999px;background:${fill};border:2px solid ${strokeRing};display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.3);">
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" style="overflow:visible">
    <path d="${PATH_THERMOMETER}" fill="none" stroke="${glyph}" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</div>`
}

/** Lucide: wind — rotated to meteorological direction (degrees). */
const PATH_WIND = [
  'M12.8 19.6A2 2 0 1 0 14 16H2',
  'M17.5 8a2.5 2.5 0 1 1 2 4H2',
  'M9.8 4.4A2 2 0 1 1 11 8H2',
]

export function weatherWindLucideMarkerHtml(windDeg: number): string {
  const paths = svgPaths([...PATH_WIND], '#0f172a', 2.15)
  return `<div style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;transform:rotate(${windDeg}deg);filter:drop-shadow(0 0 1px rgba(255,255,255,.9));">
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" style="overflow:visible">${paths}</svg>
</div>`
}
