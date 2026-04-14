export async function GET() {
  try {
    const BASE_URL = 'https://skincare-website-production-be30.up.railway.app'

    const res = await fetch(`${BASE_URL}/api/analytics`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error('Backend API failed')
    }

    const data = await res.json()

    return Response.json(data)

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return Response.json(
      { error: 'Failed to load analytics' },
      { status: 500 }
    )
  }
}
