import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    let url = `${BASE_URL}/api/products`
    const params = new URLSearchParams()
    if (brand) params.set('brand', brand)
    if (category) params.set('category', category)
    if (params.toString()) url += `?${params.toString()}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json([])
    const data = await res.json()
    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch (e) {
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization') || ''
    const formData = await req.formData()
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Authorization': token },
      body: formData,
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
  }
}
