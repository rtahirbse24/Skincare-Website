import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

const BACKEND = BASE_URL

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    let url = `${BACKEND}/api/products`
    const params = new URLSearchParams()
    if (brand) params.set('brand', brand)
    if (category) params.set('category', category)
    if (params.toString()) url += `?${params.toString()}`
    console.log('Fetching from:', url)
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      console.error('Backend error:', res.status, await res.text())
      return NextResponse.json([], { status: 200 })
    }
    const data = await res.json()
    console.log('Products received:', data.length || data)
    return NextResponse.json(data)
  } catch (e) {
    console.error('GET products error:', e)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const token = req.headers.get('Authorization') || ''
    const res = await fetch(`${BACKEND}/api/products`, {
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
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
  }
}