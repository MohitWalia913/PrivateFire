'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { CALFIRE_REFRESH_MS, fetchCalFireGeoJson, type CalFireIncident } from '@/lib/calfire'
import ContactModal from './ContactModal'
import {
  Flame, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight,
  X, MapPin, Layers, Eye, EyeOff
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

type FireIncident = CalFireIncident

interface LayerConfig {
  id: string
  label: string
  desc: string
  color: string
  defaultOn: boolean
  wmsUrl: string
  wmsLayers: string
  opacity: number
  category: 'fire' | 'risk' | 'boundaries' | 'management'
}

// ── CAL FIRE ArcGIS WMS Layer Definitions ─────────────────────────────────

const CALFIRE_LAYERS: LayerConfig[] = [
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
    label: 'Fire Perimeters',
    desc: 'Historical burn boundaries since 1878',
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
    desc: 'Active fuel treatment & reduction projects',
    color: '#059669',
    defaultOn: false,
    wmsUrl: 'https://egis.fire.ca.gov/arcgis/services/CalMapper/CalMAPPER_Public/MapServer/WMSServer',
    wmsLayers: '0',
    opacity: 0.55,
    category: 'management',
  },
]

const LAYER_GROUPS = [
  { key: 'risk', title: 'Risk & Hazard Zones' },
  { key: 'boundaries', title: 'Administrative Boundaries' },
  { key: 'management', title: 'Management' },
] as const

// ── Build initial layer state ──────────────────────────────────────────────

function buildInitialLayers(): Record<string, boolean> {
  const s: Record<string, boolean> = { activeFires: true, heatmap: true }
  CALFIRE_LAYERS.forEach(l => { s[l.id] = l.defaultOn })
  return s
}

// ── Layer Toggle Row sub-component ────────────────────────────────────────

function LayerToggleRow({
  label, desc, color, active, onToggle,
}: {
  label: string; desc?: string; color: string; active: boolean; onToggle: () => void
}) {
  return (
    <button onClick={onToggle}
      className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl mb-1 transition-all text-left border ${
        active ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
      }`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors`}
        style={{ background: active ? color + '22' : '#f3f4f6' }}>
        {active
          ? <Eye size={13} style={{ color }} />
          : <EyeOff size={13} className="text-gray-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0 transition-colors"
            style={{ background: active ? color : '#d1d5db' }} />
          <p className={`text-xs font-semibold truncate ${active ? 'text-gray-900' : 'text-gray-500'}`}>{label}</p>
        </div>
        {desc && <p className="text-gray-400 text-[10px] mt-0.5 ml-3.5 leading-tight">{desc}</p>}
      </div>
    </button>
  )
}

// ── Main Component ────────────────────────────────────────────────────────

export default function FireMap({ compact = false }: { compact?: boolean }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapObjRef = useRef<{ map: unknown; L: unknown } | null>(null)
  const wmsLayerRefs = useRef<Record<string, unknown>>({})
  const heatLayerRef = useRef<unknown>(null)
  const mapReadyRef = useRef(false)

  const [incidents, setIncidents] = useState<FireIncident[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(!compact)
  const [sidebarTab, setSidebarTab] = useState<'fires' | 'layers'>('fires')
  const [selected, setSelected] = useState<FireIncident | null>(null)
  const [apiSource, setApiSource] = useState<'live' | 'demo'>('demo')
  const [activeOnly, setActiveOnly] = useState(false)
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>(buildInitialLayers)
  const [showLayerDropdown, setShowLayerDropdown] = useState(false)
  const [isMapReady, setIsMapReady] = useState(false)

  const visibleIncidents = activeOnly ? incidents.filter(i => i.IsActive) : incidents

  // Stats
  const totalAcres = visibleIncidents.reduce((s, f) => s + (f.AcresBurned || 0), 0)
  const avgContained = visibleIncidents.length
    ? Math.round(visibleIncidents.reduce((s, f) => s + (f.PercentContained || 0), 0) / visibleIncidents.length)
    : 0
  const critical = visibleIncidents.filter(f => (f.PercentContained || 0) < 25).length
  const activeLayerCount = [
    activeLayers.activeFires,
    activeLayers.heatmap,
    ...CALFIRE_LAYERS.map(l => activeLayers[l.id]),
  ].filter(Boolean).length

  // ── Fetch incidents ────────────────────────────────────────────────────

  const fetchIncidents = useCallback(async () => {
    setLoading(true)
    try {
      const parsed = await fetchCalFireGeoJson(true)
      setIncidents(parsed)
      setApiSource('live')
    } catch {
      setIncidents([])
      setApiSource('demo')
    }
    setLastUpdated(new Date().toLocaleTimeString())
    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchIncidents()
    const timer = setInterval(() => {
      void fetchIncidents()
    }, CALFIRE_REFRESH_MS)
    return () => clearInterval(timer)
  }, [fetchIncidents])

  // ── EFFECT 1: Init map + create all WMS layers ─────────────────────────

  useEffect(() => {
    if (!mapRef.current || mapReadyRef.current) return
    let cancelled = false

    const init = async () => {
      const leaflet = await import('leaflet')
      const L = leaflet.default
      if (cancelled || !mapRef.current || mapReadyRef.current) return
      await import('leaflet/dist/leaflet.css')
      if (cancelled || !mapRef.current || mapReadyRef.current) return

      // @ts-ignore internal leaflet property
      delete mapRef.current._leaflet_id

      mapReadyRef.current = true
      const map = L.map(mapRef.current, {
        center: [37.5, -119.5],
        zoom: compact ? 5 : 6,
        zoomControl: false,
      })

      // Base tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19,
      }).addTo(map)

      if (!compact) L.control.zoom({ position: 'bottomright' }).addTo(map)

      setTimeout(() => {
        if (!cancelled) {
          map.invalidateSize()
          map.setView([37.5, -119.5], compact ? 5 : 6)
        }
      }, 150)

      // Create WMS layers for each CAL FIRE service
      CALFIRE_LAYERS.forEach(cfg => {
        try {
          const wmsLayer = L.tileLayer.wms(cfg.wmsUrl, {
            layers: cfg.wmsLayers,
            format: 'image/png',
            transparent: true,
            opacity: cfg.opacity,
            version: '1.1.1',
            attribution: '© CAL FIRE GIS',
          })
          wmsLayerRefs.current[cfg.id] = wmsLayer
          if (cfg.defaultOn) wmsLayer.addTo(map)
        } catch (e) {
          console.warn(`Failed to init WMS layer: ${cfg.id}`, e)
        }
      })

      // Heatmap layer
      try {
        await import('leaflet.heat')
        if (!cancelled) {
          // @ts-ignore leaflet.heat
          const heatLayer = L.heatLayer([], {
            radius: compact ? 28 : 40,
            blur: 25,
            maxZoom: 10,
            gradient: { 0.1: '#fbbf24', 0.4: '#f97316', 0.7: '#ef4444', 1.0: '#7f1d1d' },
          })
          heatLayer.addTo(map) // heatmap is on by default
          heatLayerRef.current = heatLayer
        }
      } catch { /* optional */ }

      if (!cancelled) mapObjRef.current = { map, L }
      if (!cancelled) setIsMapReady(true)
    }

    init()

    return () => {
      cancelled = true
      mapReadyRef.current = false
      setIsMapReady(false)
      wmsLayerRefs.current = {}
      heatLayerRef.current = null
      if (mapObjRef.current) {
        // @ts-ignore
        mapObjRef.current.map.remove()
        mapObjRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact])

  // ── EFFECT 2: Add/remove incident markers ──────────────────────────────

  useEffect(() => {
    if (!mapObjRef.current || !isMapReady) return
    const { map, L } = mapObjRef.current as {
      map: {
        flyTo: (c: [number, number], z: number, o: object) => void
        eachLayer: (fn: (l: unknown) => void) => void
        removeLayer: (l: unknown) => void
      }
      L: {
        marker: (c: [number, number], o: object) => {
          on: (e: string, fn: () => void) => unknown
          bindTooltip: (c: string, o: object) => unknown
          addTo: (m: unknown) => void
        }
        divIcon: (o: object) => unknown
      }
    }

    // Remove existing markers (identified by _latlng property)
    map.eachLayer((layer: unknown) => {
      // @ts-ignore
      if (layer._latlng) map.removeLayer(layer)
    })

    if (visibleIncidents.length === 0) return

    if (!activeLayers.activeFires) return

    visibleIncidents.forEach(inc => {
      if (!inc.Latitude || !inc.Longitude) return
      const c = inc.PercentContained || 0
      const color = c === 0 ? '#dc2626' : c < 25 ? '#ef4444' : c < 75 ? '#f97316' : '#22c55e'
      const size = c < 25 ? 22 : 16

      const icon = L.divIcon({
        className: '',
        html: `<div style="width:${size}px;height:${size}px;background:${color};border:2px solid ${c < 25 ? '#fbbf24' : 'rgba(255,255,255,0.6)'};border-radius:50%;box-shadow:0 0 ${c < 25 ? 14 : 6}px ${color}AA;cursor:pointer;"></div>`,
        // @ts-ignore iconSize
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      const marker = L.marker([inc.Latitude, inc.Longitude], { icon })

      if (!compact) {
        marker.on('click', () => {
          setSelected(inc)
          setSidebarOpen(true)
          setSidebarTab('fires')
          map.flyTo([inc.Latitude, inc.Longitude], 11, { duration: 1 })
        })
      }

      marker.bindTooltip(
        `<strong>${inc.Name}</strong><br>${inc.County} Co. · ${(inc.AcresBurned || 0).toLocaleString()} ac · ${c}% contained`,
        { className: 'leaflet-tooltip-dark', direction: 'top', offset: [0, -10] }
      )
      marker.addTo(map)
    })
  }, [visibleIncidents, compact, activeLayers.activeFires, isMapReady])

  // ── EFFECT 3: Toggle heatmap ───────────────────────────────────────────

  useEffect(() => {
    if (!mapObjRef.current || !heatLayerRef.current) return
    const { map } = mapObjRef.current as {
      map: { addLayer: (l: unknown) => void; removeLayer: (l: unknown) => void }
    }
    if (activeLayers.heatmap) {
      map.addLayer(heatLayerRef.current)
    } else {
      map.removeLayer(heatLayerRef.current)
    }
  }, [activeLayers.heatmap])

  // ── EFFECT 4: Refresh heatmap data from incidents ─────────────────────

  useEffect(() => {
    if (!heatLayerRef.current) return
    const heatPoints = visibleIncidents
      .filter(item => Number(item.Latitude) && Number(item.Longitude))
      .map(item => [
        item.Latitude,
        item.Longitude,
        Math.min(1, ((item.AcresBurned || 0) / 5000) + ((100 - (item.PercentContained || 0)) / 100) * 0.5),
      ] as [number, number, number])
    // @ts-ignore leaflet.heat runtime method
    if (typeof heatLayerRef.current.setLatLngs === 'function') heatLayerRef.current.setLatLngs(heatPoints)
  }, [visibleIncidents])

  // ── Toggle handler ────────────────────────────────────────────────────

  const toggleLayer = (id: string) => {
    const newVal = !activeLayers[id]
    setActiveLayers(prev => ({ ...prev, [id]: newVal }))

    // Directly add/remove WMS layers (heatmap + incidents handled by effects above)
    const wmsLayer = wmsLayerRefs.current[id]
    if (wmsLayer && mapObjRef.current) {
      const { map } = mapObjRef.current as {
        map: { addLayer: (l: unknown) => void; removeLayer: (l: unknown) => void }
      }
      if (newVal) {
        map.addLayer(wmsLayer)
      } else {
        map.removeLayer(wmsLayer)
      }
    }
  }

  const flyTo = (lat: number, lng: number) => {
    if (!mapObjRef.current) return
    // @ts-ignore
    mapObjRef.current.map.flyTo([lat, lng], 11, { duration: 1.2 })
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="relative w-full h-full flex overflow-hidden">

      {/* ── Full-map sidebar ── */}
      {!compact && (
        <>
          <div className={`absolute top-0 left-0 h-full z-30 transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
            <div className="w-80 h-full bg-white/95 backdrop-blur-md border-r border-gray-200 flex flex-col shadow-lg">

              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Flame size={15} className="text-orange-500" />
                  <span className="text-gray-900 font-bold text-sm">CAL FIRE Live Data</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 flex-shrink-0">
                {[
                  { id: 'fires', label: `Fires (${visibleIncidents.length})` },
                  { id: 'layers', label: `Layers (${activeLayerCount})` },
                ].map(tab => (
                  <button key={tab.id}
                    onClick={() => setSidebarTab(tab.id as 'fires' | 'layers')}
                    className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
                      sidebarTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── Fires tab ── */}
              {sidebarTab === 'fires' && (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 p-3 border-b border-gray-100 flex-shrink-0">
                    {[
                      { label: activeOnly ? 'Active Fires' : 'Visible Fires', value: visibleIncidents.length, color: 'text-red-600' },
                      { label: 'Total Acres', value: totalAcres >= 1000 ? `${(totalAcres / 1000).toFixed(1)}K` : totalAcres, color: 'text-orange-500' },
                      { label: 'Avg Contained', value: `${avgContained}%`, color: avgContained > 50 ? 'text-green-600' : 'text-yellow-600' },
                      { label: 'Critical (<25%)', value: critical, color: 'text-red-700' },
                    ].map(s => (
                      <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                        <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                        <p className="text-gray-500 text-xs">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Selected fire detail */}
                  {selected && (
                    <div className="mx-3 my-2 bg-orange-50 border border-orange-200 rounded-xl p-3 flex-shrink-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-gray-900 font-bold text-sm leading-tight">{selected.Name}</p>
                        <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 flex-shrink-0">
                          <X size={13} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs mb-2">
                        {[
                          ['County', selected.County],
                          ['Acres Burned', (selected.AcresBurned || 0).toLocaleString()],
                          ['% Contained', `${selected.PercentContained || 0}%`],
                          ['Admin', selected.AdminUnit || 'CAL FIRE'],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <p className="text-gray-400">{k}</p>
                            <p className="text-gray-800 font-semibold">{v}</p>
                          </div>
                        ))}
                      </div>
                      {selected.Location && (
                        <p className="text-gray-500 text-xs flex items-center gap-1 mb-2">
                          <MapPin size={11} /> {selected.Location}
                        </p>
                      )}
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${(selected.PercentContained || 0) > 50 ? 'bg-green-500' : 'bg-orange-500'}`}
                          style={{ width: `${selected.PercentContained || 0}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Fire list */}
                  <div className="flex-1 overflow-y-auto">
                    <p className="px-4 py-2 text-xs text-gray-400 font-medium uppercase tracking-wide">
                      Click fire to zoom in
                    </p>
                    {visibleIncidents.map((fire, i) => {
                      const c = fire.PercentContained || 0
                      return (
                        <button key={i}
                          onClick={() => { setSelected(fire); flyTo(fire.Latitude, fire.Longitude) }}
                          className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-orange-50 transition-colors flex items-start gap-3 ${selected?.Name === fire.Name ? 'bg-orange-50' : ''}`}>
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${c === 0 ? 'bg-red-600' : c < 25 ? 'bg-red-400' : c < 75 ? 'bg-orange-400' : 'bg-green-400'}`} />
                          <div className="min-w-0 flex-1">
                            <p className="text-gray-900 text-xs font-semibold truncate">{fire.Name}</p>
                            <p className="text-gray-500 text-xs">{fire.County} · {(fire.AcresBurned || 0).toLocaleString()} ac</p>
                          </div>
                          <span className={`text-xs font-bold flex-shrink-0 ${c < 25 ? 'text-red-600' : c < 75 ? 'text-orange-500' : 'text-green-600'}`}>{c}%</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Legend */}
                  <div className="p-3 border-t border-gray-200 flex-shrink-0 bg-gray-50">
                    <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Marker Legend</p>
                    <div className="flex gap-3 text-xs text-gray-600 flex-wrap">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-600 inline-block border-2 border-yellow-400" />Critical</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />Active</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" />Contained</span>
                    </div>
                  </div>
                </>
              )}

              {/* ── Layers tab ── */}
              {sidebarTab === 'layers' && (
                <div className="flex-1 overflow-y-auto">

                  {/* Base / fire data layers */}
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Fire Data</p>
                    <LayerToggleRow
                      label="Active Incidents"
                      desc="Live fire locations from CAL FIRE"
                      color="#ef4444"
                      active={activeLayers.activeFires}
                      onToggle={() => toggleLayer('activeFires')}
                    />
                    <LayerToggleRow
                      label="Risk Heatmap"
                      desc="Historical fire risk intensity overlay"
                      color="#f97316"
                      active={activeLayers.heatmap}
                      onToggle={() => toggleLayer('heatmap')}
                    />
                  </div>

                  {/* CAL FIRE ArcGIS layer groups */}
                  {LAYER_GROUPS.map(group => {
                    const groupLayers = CALFIRE_LAYERS.filter(l => l.category === group.key)
                    return (
                      <div key={group.key} className="p-3 border-b border-gray-100">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">{group.title}</p>
                        {groupLayers.map(layer => (
                          <LayerToggleRow
                            key={layer.id}
                            label={layer.label}
                            desc={layer.desc}
                            color={layer.color}
                            active={activeLayers[layer.id]}
                            onToggle={() => toggleLayer(layer.id)}
                          />
                        ))}
                      </div>
                    )
                  })}

                  {/* Data attribution */}
                  <div className="p-3 pb-6">
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Map data from{' '}
                      <a href="https://egis.fire.ca.gov" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">CAL FIRE GIS</a>
                      {' '}and{' '}
                      <a href="https://services.gis.ca.gov" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">CA GIS Services</a>.
                      {' '}WMS layers © CAL FIRE / FRAP.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar toggle button */}
          <button onClick={() => setSidebarOpen(o => !o)}
            className={`absolute top-1/2 -translate-y-1/2 z-40 bg-white border border-gray-200 hover:border-orange-400 shadow-md rounded-r-lg px-1 py-4 text-gray-500 hover:text-orange-500 transition-all ${sidebarOpen ? 'left-80' : 'left-0'}`}>
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </>
      )}

      {/* ── Map canvas ── */}
      <div ref={mapRef} className="flex-1 h-full relative z-0" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-700 text-sm font-medium">Loading CAL FIRE data...</p>
          </div>
        </div>
      )}

      {/* ── Top-right controls ── */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 flex-wrap justify-end">

        {/* Fire count badge */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
          <Flame size={14} className="text-orange-500" />
          <span className="text-gray-900 font-bold text-xs">{visibleIncidents.length} Fires</span>
          {!compact && <span className="text-gray-500 text-xs hidden sm:inline">· {totalAcres.toLocaleString()} ac</span>}
          {apiSource === 'demo' && (
            <span className="bg-yellow-50 text-yellow-700 text-xs px-1.5 rounded border border-yellow-200">Demo</span>
          )}
        </div>

        {/* Compact: layer dropdown button */}
        {compact && (
          <div className="relative">
            <button onClick={() => setShowLayerDropdown(d => !d)}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border transition-all backdrop-blur-sm shadow-sm ${
                showLayerDropdown
                  ? 'bg-orange-50 border-orange-300 text-orange-600'
                  : 'bg-white/95 border-gray-200 text-gray-600 hover:border-orange-300'
              }`}>
              <Layers size={12} />
              <span>Layers</span>
              <span className="bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                {activeLayerCount}
              </span>
            </button>

            {showLayerDropdown && (
              <div className="absolute top-full right-0 mt-1 w-60 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-700">Map Layers</p>
                  <button onClick={() => setShowLayerDropdown(false)} className="text-gray-400 hover:text-gray-700">
                    <X size={12} />
                  </button>
                </div>
                <div className="p-2 max-h-72 overflow-y-auto">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide px-1 mb-1">Fire Data</p>
                  {[
                    { id: 'activeFires', label: 'Active Incidents', color: '#ef4444' },
                    { id: 'heatmap', label: 'Risk Heatmap', color: '#f97316' },
                  ].map(layer => (
                    <button key={layer.id} onClick={() => toggleLayer(layer.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors mb-0.5 ${
                        activeLayers[layer.id] ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                      <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ background: activeLayers[layer.id] ? layer.color : '#d1d5db' }} />
                      <span className="flex-1 text-left">{layer.label}</span>
                      {activeLayers[layer.id] ? <Eye size={11} className="text-orange-400" /> : <EyeOff size={11} className="text-gray-400" />}
                    </button>
                  ))}
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide px-1 mt-2 mb-1">CAL FIRE Layers</p>
                  {CALFIRE_LAYERS.map(layer => (
                    <button key={layer.id} onClick={() => toggleLayer(layer.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors mb-0.5 ${
                        activeLayers[layer.id] ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'
                      }`}>
                      <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ background: activeLayers[layer.id] ? layer.color : '#d1d5db' }} />
                      <span className="flex-1 text-left truncate">{layer.label}</span>
                      {activeLayers[layer.id] ? <Eye size={11} className="text-orange-400" /> : <EyeOff size={11} className="text-gray-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Non-compact quick layers button → opens layers tab */}
        {!compact && (
          <button onClick={() => { setSidebarTab('layers'); setSidebarOpen(true) }}
            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border transition-all backdrop-blur-sm shadow-sm ${
              sidebarTab === 'layers' && sidebarOpen
                ? 'bg-orange-50 border-orange-300 text-orange-600'
                : 'bg-white/95 border-gray-200 text-gray-600 hover:border-orange-300'
            }`}>
            <Layers size={12} />
            <span className="hidden sm:inline">Layers</span>
            <span className="bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
              {activeLayerCount}
            </span>
          </button>
        )}

        {/* Refresh */}
        <button onClick={fetchIncidents}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border bg-white/95 border-gray-200 text-gray-500 hover:text-orange-500 backdrop-blur-sm transition-all shadow-sm">
          <RefreshCw size={12} />
        </button>

        {/* Active filter */}
        <button
          onClick={() => setActiveOnly(v => !v)}
          className={`px-2.5 py-2 rounded-lg text-xs font-medium border backdrop-blur-sm transition-all shadow-sm ${
            activeOnly
              ? 'bg-orange-50 border-orange-300 text-orange-600'
              : 'bg-white/95 border-gray-200 text-gray-600 hover:border-orange-300'
          }`}
        >
          {activeOnly ? 'Active Only' : 'All Incidents'}
        </button>
      </div>

      {/* ── Compact stats bar ── */}
      {compact && visibleIncidents.length > 0 && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 flex-wrap">
          {[
            { label: activeOnly ? 'Active Fires' : 'Visible Fires', value: visibleIncidents.length, color: 'text-red-600' },
            { label: 'Acres', value: totalAcres >= 1000 ? `${(totalAcres / 1000).toFixed(1)}K` : totalAcres.toLocaleString(), color: 'text-orange-500' },
            { label: 'Avg Cont.', value: `${avgContained}%`, color: avgContained > 50 ? 'text-green-600' : 'text-yellow-600' },
          ].map(s => (
            <div key={s.label} className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm rounded-lg px-3 py-1.5 text-center">
              <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Open sidebar button (full map, sidebar closed) ── */}
      {!compact && !sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-sm border border-gray-200 hover:border-orange-400 shadow-sm rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-gray-700 hover:text-orange-500 transition-all">
          <Flame size={13} className="text-orange-500" /> Fire Data
        </button>
      )}

      {/* ── Bottom bar ── */}
      <div className="absolute bottom-6 z-20 flex items-end justify-between gap-3 left-4 right-4">
        <div>
          {lastUpdated && (
            <div className="text-xs text-gray-600 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded mb-2 border border-gray-200 shadow-sm">
              {apiSource === 'live' ? '✓ Live CAL FIRE' : '⚠ Demo data'} · {lastUpdated}
            </div>
          )}
          {!compact && (
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-full shadow-2xl btn-glow transition-all text-sm">
              <Flame size={16} /> Request Protection
            </button>
          )}
        </div>
        {compact && (
          <a href="/map"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-full shadow-xl btn-glow transition-all text-xs ml-auto">
            <AlertTriangle size={14} /> View Full Map
          </a>
        )}
      </div>

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
