import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

const BACKEND = BASE_URL

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/orders`, {
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json([])
    const data = await res.json()
    const orders = Array.isArray(data) ? data : (data?.data || [])
    return NextResponse.json(orders)
  } catch (e) {
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${BACKEND}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }
}