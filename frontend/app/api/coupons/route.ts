import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

const BACKEND = BASE_URL

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/coupons`, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ coupons: [], globalEnabled: false })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ coupons: [], globalEnabled: false })
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization') || ''
    const body = await req.json()
    const res = await fetch(`${BACKEND}/api/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
  }
}