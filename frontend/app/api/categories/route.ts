import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'
import { BRAND_CATEGORIES } from '@/lib/categories'

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/api/categories`, { cache: 'no-store' })
    if (!res.ok) {
      return NextResponse.json({
        Topicrem: BRAND_CATEGORIES['Topicrem'] || [],
        Novexpert: BRAND_CATEGORIES['Novexpert'] || []
      })
    }
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({
      Topicrem: BRAND_CATEGORIES['Topicrem'] || [],
      Novexpert: BRAND_CATEGORIES['Novexpert'] || []
    })
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization') || ''
    const body = await req.json()
    const res = await fetch(`${BASE_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify(body),
    })
    if (!res.ok) return NextResponse.json({ error: 'Failed to add category' }, { status: 500 })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get('Authorization') || ''
    const body = await req.json()
    const res = await fetch(`${BASE_URL}/api/categories`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify(body),
    })
    if (!res.ok) return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}