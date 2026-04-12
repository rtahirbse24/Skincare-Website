import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.headers.get('Authorization') || ''
    const res = await fetch(`${BASE_URL}/api/coupons/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Authorization': token },
    })
    if (!res.ok) return NextResponse.json({ error: 'Failed to toggle coupon' }, { status: 500 })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ error: 'Failed to toggle coupon' }, { status: 500 })
  }
}