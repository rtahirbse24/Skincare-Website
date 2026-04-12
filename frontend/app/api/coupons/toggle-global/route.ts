import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

export async function PATCH(req: Request) {
  try {
    const token = req.headers.get('Authorization') || ''
    const res = await fetch(`${BASE_URL}/api/coupons/toggle-global`, {
      method: 'PATCH',
      headers: { 'Authorization': token },
    })
    if (!res.ok) return NextResponse.json({ error: 'Failed to toggle' }, { status: 500 })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ error: 'Failed to toggle' }, { status: 500 })
  }
}