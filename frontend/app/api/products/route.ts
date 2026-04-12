import { NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://skincare-website-production-013a.up.railway.app'

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
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
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