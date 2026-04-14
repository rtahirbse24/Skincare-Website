import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${BASE_URL}/api/analytics/track-page`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    try {
      return NextResponse.json(JSON.parse(text))
    } catch {
      return NextResponse.json({ success: true })
    }
  } catch {
    return NextResponse.json({ success: false })
  }
}