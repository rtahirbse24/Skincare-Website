import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

const BACKEND = BASE_URL

export async function GET(req: Request) {
  try {
    const token = req.headers.get('Authorization') || ''
    const res = await fetch(`${BACKEND}/api/messages`, {
      headers: { 'Authorization': token },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json([], { status: 200 })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${BACKEND}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}