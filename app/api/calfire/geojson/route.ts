import { NextRequest, NextResponse } from 'next/server'
import {
  calFireIncidentsToGeoJson,
  getCalFireIncidentsFromMapdataCsv,
} from '@/lib/calfire-mapdata-csv'
import { getCalFireCached } from '@/lib/calfire-proxy'

const UPSTREAM = 'https://incidents.fire.ca.gov/umbraco/api/IncidentApi/GeoJsonList'

export async function GET(req: NextRequest) {
  const inactiveParam = req.nextUrl.searchParams.get('inactive')
  const inactive = inactiveParam === 'false' ? 'false' : 'true'
  const includeInactive = inactive === 'true'

  try {
    const data = await getCalFireCached<unknown>(`${UPSTREAM}?inactive=${inactive}`)
    return NextResponse.json(data)
  } catch {
    const incidents = getCalFireIncidentsFromMapdataCsv(includeInactive)
    return NextResponse.json(calFireIncidentsToGeoJson(incidents), {
      headers: { 'x-calfire-data-source': 'mapdata-all-csv' },
    })
  }
}
