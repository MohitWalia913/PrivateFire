import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/auth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { firstName, lastName, email, phone, password } = body
  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const user = createUser({ name: `${firstName} ${lastName}`, email, password, phone })
  if (!user) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }
  return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
}
