import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

const BACKEND = BASE_URL

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log('Fetching product:', id, 'from:', `${BACKEND}/api/products/${id}`)
    const res = await fetch(`${BACKEND}/api/products/${id}`, { cache: 'no-store' })
    if (!res.ok) {
      console.error('Product fetch error:', res.status)
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error('GET product error:', e)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const token = req.headers.get('Authorization') || ''
    
    // Only send fields the backend accepts
    const allowedBody = {
      name: body.name,
      description: body.description,
      howToUse: body.howToUse,
      price: body.price,
      brand: body.brand,
      category: body.category,
      images: body.images || [],
    }
    
    const res = await fetch(`${BACKEND}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify(allowedBody),
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