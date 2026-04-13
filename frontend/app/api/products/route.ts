import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'
import { readStore } from '@/lib/store'

const BACKEND = BASE_URL

export async function GET(req: Request) {
  try {
    const store = readStore()
    let filtered = store.products
    const { searchParams } = new URL(req.url)
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    if (brand) filtered = filtered.filter((product: any) => product.brand === brand)
    if (category) filtered = filtered.filter((product: any) => product.category === category)
    return NextResponse.json(filtered)
  } catch (e) {
    console.error('GET products error:', e)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization') || ''
    const formData = await req.formData()
    const res = await fetch(`${BACKEND}/api/products`, {
      method: 'POST',
      headers: { 'Authorization': token },
      body: formData,
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e) {
    console.error('POST products error:', e)
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 })
  }
}