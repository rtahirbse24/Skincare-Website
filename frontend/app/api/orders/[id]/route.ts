import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.headers.get('Authorization') || ''
    const body = await req.json()
    const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.headers.get('Authorization') || ''
    const res = await fetch(`${BASE_URL}/api/orders/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': token },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}