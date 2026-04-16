// California fire prediction heatmap data
// Based on historical wildfire frequency by county/region
// Format: [lat, lng, intensity]
export const fireHeatmapData: [number, number, number][] = [
  // Northern California - high risk
  [40.5865, -122.3917, 0.9],  // Shasta
  [40.7599, -122.6354, 0.85], // Trinity
  [40.9011, -123.6981, 0.75], // Humboldt
  [40.2077, -122.2342, 0.88], // Tehama
  [39.7285, -121.8375, 0.92], // Butte (Paradise/Camp Fire area)
  [39.5501, -121.5543, 0.8],  // Plumas
  [41.2148, -121.0049, 0.7],  // Modoc
  [40.3850, -120.9500, 0.65], // Lassen
  [39.9500, -120.8700, 0.7],  // Sierra
  [40.8021, -124.1637, 0.6],  // Del Norte
  [41.4800, -122.5100, 0.75], // Siskiyou
  [39.0965, -122.5833, 0.8],  // Lake (Wine Country)
  [38.5780, -122.7500, 0.85], // Napa
  [38.4680, -122.7300, 0.82], // Sonoma
  [38.9100, -122.6200, 0.79], // Mendocino

  // Central California
  [37.9577, -119.8947, 0.7],  // Yosemite/Tuolumne
  [38.1800, -120.7800, 0.72], // Calaveras
  [38.4500, -120.4300, 0.68], // Amador
  [38.7500, -120.5300, 0.75], // El Dorado
  [39.0916, -120.9544, 0.7],  // Placer
  [37.6880, -119.6800, 0.8],  // Mariposa
  [36.7783, -119.4179, 0.55], // Fresno
  [37.3541, -119.9500, 0.65], // Madera
  [37.5591, -119.4520, 0.7],  // Merced foothills

  // Southern California - very high risk
  [34.0522, -118.2437, 0.88], // Los Angeles
  [34.4208, -119.6982, 0.92], // Ventura
  [34.2805, -119.2935, 0.87], // Ojai area
  [34.1381, -117.9750, 0.85], // San Gabriel Mountains
  [34.2219, -118.6476, 0.88], // Calabasas area
  [34.3917, -118.5426, 0.9],  // Santa Clarita/Sylmar
  [34.6901, -118.1553, 0.85], // Palmdale
  [34.1083, -116.9739, 0.82], // Big Bear
  [33.8303, -116.5453, 0.78], // Palm Springs foothills
  [33.7455, -116.3738, 0.75], // Riverside foothills
  [34.1108, -117.2898, 0.87], // San Bernardino
  [33.4942, -117.1484, 0.72], // Temecula/Wine Country
  [32.7157, -117.1611, 0.8],  // San Diego
  [33.1581, -116.8722, 0.85], // Julian/Cuyamaca
  [33.2675, -116.6030, 0.82], // Ramona
  [32.8509, -116.4270, 0.8],  // Alpine
  [33.6500, -117.0900, 0.75], // Elsinore
  [34.4333, -118.1500, 0.88], // Agua Dulce
  [34.2200, -118.0600, 0.86], // Altadena

  // Additional scattered high-risk areas
  [38.2542, -122.0400, 0.7],  // Napa Valley north
  [37.7749, -122.4194, 0.4],  // SF (lower risk)
  [36.6002, -121.8947, 0.5],  // Monterey
  [35.2828, -120.6596, 0.55], // San Luis Obispo
  [34.9530, -120.4357, 0.6],  // Santa Barbara area
]

// Recent historical fires (dummy - for reference markers)
export const historicalFires = [
  { name: 'Camp Fire (2018)', lat: 39.7285, lng: -121.8375, acres: 153336 },
  { name: 'Dixie Fire (2021)', lat: 39.9200, lng: -121.1500, acres: 963309 },
  { name: 'Caldor Fire (2021)', lat: 38.6800, lng: -120.1500, acres: 221835 },
  { name: 'Bobcat Fire (2020)', lat: 34.2200, lng: -117.8800, acres: 115997 },
  { name: 'Creek Fire (2020)', lat: 37.3600, lng: -119.2800, acres: 379895 },
  { name: 'Thomas Fire (2017)', lat: 34.2805, lng: -119.2935, acres: 281893 },
  { name: 'Woolsey Fire (2018)', lat: 34.1500, lng: -118.7800, acres: 96949 },
  { name: 'Kincade Fire (2019)', lat: 38.8100, lng: -122.7300, acres: 77758 },
]

// California ZIP risk zones (sample - for bid availability check)
export const californiaZipPrefixes = ['900','901','902','903','904','905','906','907','908','909',
  '910','911','912','913','914','915','916','917','918','919','920','921','922','923','924',
  '925','926','927','928','930','931','932','933','934','935','936','937','938','939','940',
  '941','942','943','944','945','946','947','948','949','950','951','952','953','954','955',
  '956','957','958','959','960','961']

export const getRiskLevel = (zip: string): 'extreme' | 'high' | 'moderate' | 'low' => {
  const prefix = zip.substring(0, 3)
  const extremeZips = ['902','903','904','910','911','912','913','914','917','918','919','920','921','922','923','924','925','926','927','928']
  const highZips = ['900','901','905','906','907','908','909','915','916','930','931','932','933','934','935']
  if (extremeZips.includes(prefix)) return 'extreme'
  if (highZips.includes(prefix)) return 'high'
  if (californiaZipPrefixes.includes(prefix)) return 'moderate'
  return 'low'
}
