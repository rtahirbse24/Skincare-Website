import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'
import fs from 'fs'
import path from 'path'

const BACKEND = BASE_URL
const DATA_FILE = path.join(process.cwd(), 'data', 'store.json')

function readRawStore() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return { coupons: [], couponSettings: { globalEnabled: false } }
  }
}

export async function GET(req: Request) {
  try {
    const store = readRawStore()
    const localCoupons = store.coupons || []
    const localSettings = store.couponSettings || { globalEnabled: false }

    // Also try to get coupons from backend
    try {
      const token = req.headers.get('Authorization') || ''
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await fetch(`${backendUrl}/api/coupons`, {
        headers: { Authorization: token },
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        const backendCoupons = data.coupons || []
        const backendEnabled = data.globalEnabled ?? localSettings.globalEnabled

        // Merge: backend coupons take priority, add any local-only ones
        const backendCodes = new Set(backendCoupons.map((c: any) => c.code))
        const localOnly = localCoupons.filter((c: any) => !backendCodes.has(c.code))
        
        return NextResponse.json({
          coupons: [...backendCoupons, ...localOnly],
          globalEnabled: backendEnabled,
        })
      }
    } catch (e) {
      console.warn('[GET /api/coupons] backend unavailable, using local only')
    }

    return NextResponse.json({
      coupons: localCoupons,
      globalEnabled: localSettings.globalEnabled,
    })
  } catch (e) {
    return NextResponse.json({ coupons: [], globalEnabled: false })
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization') || ''
    const body = await req.json()
    const res = await fetch(`${BACKEND}/api/coupons`, {
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
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 })
  }
}