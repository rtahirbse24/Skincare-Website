import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return NextResponse.json({ error: 'Invalid coupon' }, { status: 400 })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
  }
}
