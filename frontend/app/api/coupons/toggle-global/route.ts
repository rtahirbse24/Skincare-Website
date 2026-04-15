import { NextResponse } from 'next/server'
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

function writeRawStore(data: any) {
  try {
    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('[writeRawStore]', e)
  }
}

export async function PATCH(req: Request) {
  try {
    const token = req.headers.get('Authorization') || ''
    const body = await req.json()
    const { enabled } = body
    
    // Toggle in store.json with explicit value
    const store = readRawStore()
    if (!store.couponSettings) store.couponSettings = { globalEnabled: false }
    store.couponSettings.globalEnabled = enabled
    writeRawStore(store)
    
    // Also update backend state (silent fail)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      await fetch(`${backendUrl}/api/coupons/toggle-global`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ enabled }),
      })
    } catch (e) {
      console.warn('[toggleGlobal] backend sync failed')
    }

    return NextResponse.json({ globalEnabled: store.couponSettings.globalEnabled })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to toggle' }, { status: 500 })
  }
}