import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'
import { BASE_URL } from '@/lib/api'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // First try store.json (primary)
    const store = readStore()
    const product = store.products.find(
      (p: any) => String(p.id) === String(id) || String(p._id) === String(id)
    )
    if (product) return NextResponse.json(product)

    // Fallback: try backend
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`, { cache: 'no-store' })
      if (res.ok) return NextResponse.json(await res.json())
    } catch (e) {
      console.warn('[GET /api/products/[id]] backend unavailable')
    }

    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.headers.get('Authorization') || ''
    const formData = await req.formData()

    // Extract fields from formData
    const nameEn = formData.get('nameEn') as string || ''
    const nameAr = formData.get('nameAr') as string || ''
    const brand = formData.get('brand') as string || ''
    const category = formData.get('category') as string || ''
    const descriptionEn = formData.get('descriptionEn') as string || ''
    const descriptionAr = formData.get('descriptionAr') as string || ''
    const howToUseEn = formData.get('howToUseEn') as string || ''
    const howToUseAr = formData.get('howToUseAr') as string || ''
    const benefitsEn = formData.get('benefitsEn') as string || ''
    const benefitsAr = formData.get('benefitsAr') as string || ''
    const ingredientsEn = formData.get('ingredientsEn') as string || ''
    const ingredientsAr = formData.get('ingredientsAr') as string || ''
    const price = parseFloat(formData.get('price') as string || '0')
    const texture = formData.get('texture') as string || ''
    const skinType = formData.get('skinType') as string || ''
    const existingImagesRaw = formData.get('existingImages') as string || '[]'
    const existingImages = JSON.parse(existingImagesRaw)

    // Update store.json (primary)
    const store = readStore()
    const productIndex = store.products.findIndex(
      (p: any) => String(p.id) === String(id) || String(p._id) === String(id)
    )

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    store.products[productIndex] = {
      ...store.products[productIndex],
      name: { en: nameEn, ar: nameAr },
      brand,
      category,
      description: { en: descriptionEn, ar: descriptionAr },
      howToUse: { en: howToUseEn, ar: howToUseAr },
      benefits: { en: benefitsEn, ar: benefitsAr },
      ingredients: { en: ingredientsEn, ar: ingredientsAr },
      price,
      texture,
      skinType,
      images: existingImages,
      updatedAt: new Date().toISOString(),
    }

    writeStore(store)

    // Also sync to backend (silent fail)
    try {
      await fetch(`${BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': token },
        body: formData,
      })
    } catch (e) {
      console.warn('[PUT /api/products/[id]] backend sync failed')
    }

    return NextResponse.json(store.products[productIndex])
  } catch (e) {
    console.error('PUT ERROR:', e)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = req.headers.get('Authorization') || ''

    // Delete from store.json only (keep in MongoDB)
    const store = readStore()
    const productIndex = store.products.findIndex(
      (p: any) => String(p.id) === String(id) || String(p._id) === String(id)
    )

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const deletedProduct = store.products.splice(productIndex, 1)[0]
    writeStore(store)

    return NextResponse.json({ success: true, product: deletedProduct })
  } catch (e) {
    console.error('DELETE ERROR:', e)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}