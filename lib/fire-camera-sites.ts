/**
 * Representative public camera portal entry points (not live tile feeds).
 * ALERTWildfire and partner networks own the streams — we link out for compliance & reliability.
 */
export const FIRE_CAMERA_SITES: Array<{ lat: number; lng: number; label: string; href: string }> = [
  {
    lat: 37.7749,
    lng: -122.4194,
    label: 'Bay Area — ALERTWildfire NorCal',
    href: 'https://www.alertwildfire.org/',
  },
  {
    lat: 34.0522,
    lng: -118.2437,
    label: 'Los Angeles region — ALERTWildfire',
    href: 'https://www.alertwildfire.org/',
  },
  {
    lat: 38.5816,
    lng: -121.4944,
    label: 'Sacramento Valley — camera hubs',
    href: 'https://www.alertwildfire.org/',
  },
  {
    lat: 33.6846,
    lng: -117.8265,
    label: 'Orange County — regional feeds',
    href: 'https://www.alertwildfire.org/',
  },
  {
    lat: 40.4173,
    lng: -120.644,
    label: 'Northern Sierra — lookout cameras',
    href: 'https://www.alertwildfire.org/',
  },
  {
    lat: 32.7157,
    lng: -117.1611,
    label: 'San Diego County — coastal towers',
    href: 'https://www.alertwildfire.org/',
  },
]
