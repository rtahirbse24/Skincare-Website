import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

const BACKEND = BASE_URL

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/api/analytics`, { cache: 'no-store' })
    if (!res.ok) return NextResponse.json({
      totalVisitors: 0, totalOrders: 0, totalProducts: 0,
      totalMessages: 0, pendingOrders: 0, visitorTrends: [],
      pageVisits: {}, recentOrders: []
    })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({
      totalVisitors: 0, totalOrders: 0, totalProducts: 0,
      totalMessages: 0, pendingOrders: 0, visitorTrends: [],
      pageVisits: {}, recentOrders: []
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const res = await fetch(`${BACKEND}/api/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ success: false })
  }
}