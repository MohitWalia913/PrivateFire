export async function geocodeZip(zip: string): Promise<{ lat: number; lng: number; city?: string; state?: string } | null> {
  const normalized = zip.trim()
  if (!/^\d{5}$/.test(normalized)) return null

  const res = await fetch(`https://api.zippopotam.us/us/${normalized}`, { cache: 'no-store' })
  if (!res.ok) return null
  const data = (await res.json()) as { places?: Array<{ latitude: string; longitude: string; 'place name': string; state: string }> }
  const place = data?.places?.[0]
  if (!place) return null
  return { 
    lat: Number(place.latitude), 
    lng: Number(place.longitude),
    city: place['place name'],
    state: place.state
  }
}

export async function geocodeAddress(query: string): Promise<{ lat: number; lng: number } | null> {
  if (!query.trim()) return null
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) return null
  const data = (await res.json()) as Array<{ lat: string; lon: string }>
  if (!Array.isArray(data) || data.length === 0) return null
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) }
}
