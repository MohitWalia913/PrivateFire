'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { CalFireIncident } from '@/lib/calfire'
import { FIRE_CAMERA_SITES } from '@/lib/fire-camera-sites'

type MapBundle = {
  map: import('leaflet').Map
  L: typeof import('leaflet')
}

function tempColor(f: number | null): string {
  if (f == null || Number.isNaN(f)) return '#94a3b8'
  if (f < 32) return '#3b82f6'
  if (f < 55) return '#22c55e'
  if (f < 75) return '#eab308'
  if (f < 90) return '#f97316'
  return '#dc2626'
}

function debounce(fn: () => void, ms: number) {
  let t: ReturnType<typeof setTimeout> | undefined
  return () => {
    if (t) clearTimeout(t)
    t = setTimeout(fn, ms)
  }
}

export function useFireMapDynamicLayers(opts: {
  mapObjRef: React.RefObject<MapBundle | null>
  isMapReady: boolean
  activeLayers: Record<string, boolean>
  incidents: CalFireIncident[]
  crewBlurMeters: number
  crewOnlyDuringActiveFire: boolean
}) {
  const { mapObjRef, isMapReady, activeLayers, incidents, crewBlurMeters, crewOnlyDuringActiveFire } = opts

  const groupsRef = useRef<{
    weather: import('leaflet').LayerGroup | null
    wind: import('leaflet').LayerGroup | null
    roads: import('leaflet').LayerGroup | null
    perims: import('leaflet').LayerGroup | null
    water: import('leaflet').LayerGroup | null
    emergency: import('leaflet').LayerGroup | null
    cameras: import('leaflet').LayerGroup | null
    crew: import('leaflet').LayerGroup | null
  }>({
    weather: null,
    wind: null,
    roads: null,
    perims: null,
    water: null,
    emergency: null,
    cameras: null,
    crew: null,
  })

  const initedRef = useRef(false)

  useEffect(() => {
    if (!mapObjRef.current || !isMapReady || initedRef.current) return
    const { map, L } = mapObjRef.current
    const g = groupsRef.current
    g.weather = L.layerGroup().addTo(map)
    g.wind = L.layerGroup().addTo(map)
    g.roads = L.layerGroup().addTo(map)
    g.perims = L.layerGroup().addTo(map)
    g.water = L.layerGroup().addTo(map)
    g.emergency = L.layerGroup().addTo(map)
    g.cameras = L.layerGroup().addTo(map)
    g.crew = L.layerGroup().addTo(map)
    initedRef.current = true

    return () => {
      const gg = groupsRef.current
      const layers = [gg.weather, gg.wind, gg.roads, gg.perims, gg.water, gg.emergency, gg.cameras, gg.crew]
      for (const layer of layers) {
        if (layer && map.hasLayer(layer)) map.removeLayer(layer)
      }
      gg.weather = null
      gg.wind = null
      gg.roads = null
      gg.perims = null
      gg.water = null
      gg.emergency = null
      gg.cameras = null
      gg.crew = null
      initedRef.current = false
    }
  }, [isMapReady, mapObjRef])

  const refresh = useCallback(async () => {
    const bundle = mapObjRef.current
    const g = groupsRef.current
    if (
      !bundle ||
      !g.weather ||
      !g.wind ||
      !g.roads ||
      !g.perims ||
      !g.water ||
      !g.emergency ||
      !g.cameras ||
      !g.crew
    )
      return
    const weatherG = g.weather
    const windG = g.wind
    const roadsG = g.roads
    const perimsG = g.perims
    const waterG = g.water
    const emergencyG = g.emergency
    const camerasG = g.cameras
    const crewG = g.crew
    const { map, L } = bundle
    const b = map.getBounds()
    const south = b.getSouth()
    const west = b.getWest()
    const north = b.getNorth()
    const east = b.getEast()
    const qs = new URLSearchParams({
      south: String(south),
      west: String(west),
      north: String(north),
      east: String(east),
    })

    const needWeather = activeLayers.weatherGrid || activeLayers.windField
    if (needWeather) {
      const res = await fetch(`/api/map/weather?${qs.toString()}`)
      const data = (await res.json()) as {
        grid?: Array<{
          lat: number
          lng: number
          temperatureF: number | null
          humidityPct: number | null
          windMph: number | null
          windDeg: number | null
        }>
      }
      weatherG.clearLayers()
      windG.clearLayers()
      const grid = data.grid || []
      for (const p of grid) {
        if (activeLayers.weatherGrid) {
          const cm = L.circleMarker([p.lat, p.lng], {
            radius: 7,
            fillColor: tempColor(p.temperatureF),
            color: '#fff',
            weight: 1,
            fillOpacity: 0.85,
          })
          cm.bindTooltip(
            `${p.temperatureF != null ? `${Math.round(p.temperatureF)}°F` : '—'} · ${
              p.humidityPct != null ? `${Math.round(p.humidityPct)}% RH` : '—'
            }`,
            { direction: 'top', className: 'leaflet-tooltip-dark' },
          )
          cm.addTo(weatherG)
        }
        if (activeLayers.windField && p.windMph != null && p.windDeg != null) {
          const arrow = L.marker([p.lat, p.lng], {
            icon: L.divIcon({
              className: '',
              html: `<div style="transform:rotate(${p.windDeg}deg);font-size:18px;line-height:1;width:24px;text-align:center;color:#0f172a;">➤</div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            }),
          })
          arrow.bindTooltip(`${Math.round(p.windMph)} mph @ ${Math.round(p.windDeg)}°`, { direction: 'right' })
          arrow.addTo(windG)
        }
      }
    } else {
      weatherG.clearLayers()
      windG.clearLayers()
    }

    if (activeLayers.roadClosures) {
      const res = await fetch(`/api/map/road-closures?${qs}`)
      const gj = await res.json()
      roadsG.clearLayers()
      L.geoJSON(gj as never, {
        style: { color: '#b91c1c', weight: 4, opacity: 0.9 },
        onEachFeature: (feat, layer) => {
          const name = (feat.properties as { ClosureName?: string })?.ClosureName || 'Road closure'
          layer.bindTooltip(String(name))
        },
      }).addTo(roadsG)
    } else {
      roadsG.clearLayers()
    }

    if (activeLayers.activeFirePerimeters) {
      const res = await fetch(`/api/map/wildfire-perimeters?${qs}`)
      const gj = await res.json()
      perimsG.clearLayers()
      L.geoJSON(gj as never, {
        style: { color: '#dc2626', weight: 2, fillOpacity: 0.15, fillColor: '#f97316' },
      }).addTo(perimsG)
    } else {
      perimsG.clearLayers()
    }

    if (activeLayers.waterSources) {
      const res = await fetch(`/api/map/water-pois?${qs}`)
      const gj = await res.json()
      waterG.clearLayers()
      L.geoJSON(gj as never, {
        pointToLayer: (_f, latlng) =>
          L.circleMarker(latlng, {
            radius: 5,
            fillColor: '#0ea5e9',
            color: '#0369a1',
            weight: 1,
            fillOpacity: 0.9,
          }),
        onEachFeature: (feat, layer) => {
          const k = (feat.properties as { _kind?: string })._kind || 'Water source'
          layer.bindTooltip(String(k))
        },
      }).addTo(waterG)
    } else {
      waterG.clearLayers()
    }

    if (activeLayers.emergencyPois) {
      const res = await fetch(`/api/map/emergency-pois?${qs}`)
      const gj = await res.json()
      emergencyG.clearLayers()
      L.geoJSON(gj as never, {
        pointToLayer: (_f, latlng) =>
          L.circleMarker(latlng, {
            radius: 6,
            fillColor: '#7c3aed',
            color: '#5b21b6',
            weight: 1,
            fillOpacity: 0.9,
          }),
        onEachFeature: (feat, layer) => {
          const p = feat.properties as { amenity?: string; name?: string }
          layer.bindTooltip(String(p.name || p.amenity || 'Emergency'))
        },
      }).addTo(emergencyG)
    } else {
      emergencyG.clearLayers()
    }

    camerasG.clearLayers()
    if (activeLayers.fireCameras) {
      for (const site of FIRE_CAMERA_SITES) {
        const m = L.marker([site.lat, site.lng], {
          icon: L.divIcon({
            className: '',
            html: '<div style="font-size:16px;">📹</div>',
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          }),
        })
        m.bindPopup(
          `<a href="${site.href}" target="_blank" rel="noreferrer">${site.label}</a><br/><span style="font-size:11px;color:#64748b">Opens partner camera portal (live where available)</span>`,
        )
        m.addTo(camerasG)
      }
    }

    crewG.clearLayers()
    if (activeLayers.crewTracking) {
      const pool = (crewOnlyDuringActiveFire ? incidents.filter(i => i.IsActive) : incidents).slice(0, 5)
      if (pool.length > 0) {
        const blurDeg = crewBlurMeters / 111320
        pool.forEach((inc, idx) => {
          let lat = inc.Latitude + Math.sin(idx * 2.1) * 0.015
          let lng = inc.Longitude + Math.cos(idx * 1.7) * 0.015
          lat += Math.sin((inc.UniqueId || '').length * (idx + 1)) * blurDeg
          lng += Math.cos((inc.Name || '').length * (idx + 1)) * blurDeg
          const m = L.marker([lat, lng], {
            icon: L.divIcon({
              className: '',
              html: `<div style="background:#1e293b;color:#fff;border-radius:8px;padding:2px 6px;font-size:10px;font-weight:700;border:2px solid #f97316;">CREW ${idx + 1}</div>`,
              iconSize: [56, 22],
              iconAnchor: [28, 11],
            }),
          })
          m.bindTooltip('Demo unit — not real-time GPS; position is blurred for privacy.', { direction: 'top' })
          m.addTo(crewG)
        })
      }
    }
  }, [activeLayers, incidents, crewBlurMeters, crewOnlyDuringActiveFire])

  const refreshRef = useRef(refresh)
  refreshRef.current = refresh

  useEffect(() => {
    if (!isMapReady || !initedRef.current) return
    void refreshRef.current()
  }, [activeLayers, incidents, crewBlurMeters, crewOnlyDuringActiveFire, isMapReady])

  useEffect(() => {
    const bundle = mapObjRef.current
    if (!bundle || !isMapReady) return
    const { map } = bundle
    const debounced = debounce(() => void refreshRef.current(), 500)
    map.on('moveend', debounced)
    return () => {
      map.off('moveend', debounced)
    }
  }, [isMapReady, mapObjRef])
}
