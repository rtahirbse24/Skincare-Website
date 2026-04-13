import { NextResponse } from 'next/server'
import { BASE_URL } from '@/lib/api'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'store.json')

function readRawStore() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return { coupons: [], couponSettings: { globalEnabled: false } }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Check store.json first
    const store = readRawStore()
    const settings = store.couponSettings || { globalEnabled: false }
    
    if (!settings.globalEnabled) {
      return NextResponse.json({ error: 'Coupon system is disabled' }, { status: 400 })
    }
    
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return NextResponse.json({ error: 'Invalid coupon' }, { status: 400 })
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
  }
}
