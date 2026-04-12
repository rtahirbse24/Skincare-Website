import { NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization') || ''
    const formData = await req.formData()

    const res = await fetch(`${BACKEND}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: formData,
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Upload proxy error:', error)
    return NextResponse.json({ error: 'Upload proxy failed' }, { status: 500 })
  }
}
