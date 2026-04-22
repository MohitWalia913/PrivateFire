import { NextRequest, NextResponse } from 'next/server'
import { getCalFireCached } from '@/lib/calfire-proxy'

const UPSTREAM = 'https://incidents.fire.ca.gov/umbraco/api/IncidentApi/GeoJsonList'

export async function GET(req: NextRequest) {
  try {
    const inactiveParam = req.nextUrl.searchParams.get('inactive')
    const inactive = inactiveParam === 'false' ? 'false' : 'true'
    const data = await getCalFireCached<unknown>(`${UPSTREAM}?inactive=${inactive}`)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unable to fetch CAL FIRE geojson' },
      { status: 502 },
    )
  }
}
