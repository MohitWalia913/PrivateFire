import type { CalFireIncident } from '@/lib/calfire'

/** Lucide `flame` icon path (lucide-react v0.577) — single path, stroke-aligned. */
export const LUCIDE_FLAME_PATH =
  'M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4'

export type FirePriority = 0 | 1 | 2 | 3

/** Higher priority = larger / hotter palette on map (active incidents). */
export function incidentPriority(inc: CalFireIncident): FirePriority {
  if (!inc.IsActive) return 3
  const c = inc.PercentContained ?? 0
  const ac = inc.AcresBurned ?? 0
  if (c < 10 && ac >= 2500) return 0
  if (c < 25 && ac >= 800) return 0
  if (c < 25 || ac >= 12000) return 1
  if (c < 75) return 2
  return 3
}

export function priorityMarkerStyle(
  inc: CalFireIncident,
  selected: boolean,
): { fill: string; ring: string; size: number; strokeWidth: number } {
  if (!inc.IsActive) {
    return {
      fill: '#64748b',
      ring: selected ? '#e2e8f0' : '#f8fafc',
      size: selected ? 26 : 21,
      strokeWidth: selected ? 2.6 : 2,
    }
  }
  const p = incidentPriority(inc)
  const sizes: Record<FirePriority, number> = { 0: 34, 1: 29, 2: 26, 3: 23 }
  const fills: Record<FirePriority, string> = {
    0: '#b91c1c',
    1: '#dc2626',
    2: '#ea580c',
    3: '#15803d',
  }
  const base = sizes[p]
  return {
    fill: fills[p],
    ring: selected ? '#fef08a' : '#ffffff',
    size: selected ? base + 10 : base,
    strokeWidth: selected ? 2.85 : 2.35,
  }
}

/** SVG markup for Leaflet `divIcon` — Lucide Flame as layered strokes (halo + body). */
export function flameMarkerHtml(size: number, opts: { fill: string; ring: string; strokeWidth: number }): string {
  const d = LUCIDE_FLAME_PATH
  const halo = opts.strokeWidth + 2.35
  return `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke-linecap="round" stroke-linejoin="round"
    style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.45));overflow:visible;">
    <path d="${d}" stroke="${opts.ring}" stroke-width="${halo}" />
    <path d="${d}" stroke="${opts.fill}" stroke-width="${opts.strokeWidth}" />
  </svg></div>`
}
