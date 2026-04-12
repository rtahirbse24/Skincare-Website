import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

const BACKEND = BASE_URL

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const res = await fetch(`${BACKEND}/api/products/${id}`, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ error: 'Not found' }, { status: res.status })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.headers.get('Authorization') || ''
    const formData = await req.formData()
    const res = await fetch(`${BACKEND}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Authorization': token },
      body: formData,
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.headers.get('Authorization') || ''
    const res = await fetch(`${BACKEND}/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': token },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}