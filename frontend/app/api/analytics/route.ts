import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const res = await fetch(`${backendUrl}/api/analytics`, { cache: 'no-store' })
    if (res.ok) {
      return NextResponse.json(await res.json())
    }
  } catch (e) {
    console.warn('[analytics] backend unavailable, using store.json')
  }

  // Fallback: calculate from store.json
  try {
    const fs = require('fs')
    const path = require('path')
    const DATA_FILE = path.join(process.cwd(), 'data', 'store.json')
    const store = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    
    const orders = store.orders || []
    const messages = store.messages || []
    const products = store.products || []
    const visitors = store.visitors || []

    // Page visit counts
    const pageVisits: Record<string, number> = {}
    visitors.forEach((v: any) => {
      if (v.page) pageVisits[v.page] = (pageVisits[v.page] || 0) + 1
    })

    // Visitor trends (last 7 days)
    const now = new Date()
    const visitorTrends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      const dateStr = date.toISOString().split('T')[0]
      const count = visitors.filter((v: any) => v.timestamp?.startsWith(dateStr)).length
      return { date: dateStr, count }
    })

    return NextResponse.json({
      totalVisitors: visitors.length,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalMessages: messages.length,
      pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
      visitorTrends,
      pageVisits,
      recentOrders: orders.slice(-5).reverse(),
    })
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
    const res = await fetch(`${BASE_URL}/api/analytics/track-visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ success: false })
  }
}