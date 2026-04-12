import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    const token = req.headers.get('Authorization') || ''
    const res = await fetch(`${BASE_URL}/api/coupons/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': token },
    })
    if (!res.ok) return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 })
  }
}