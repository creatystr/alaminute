import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import ProductModel from '@/models/Product'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isNew = searchParams.get('new') === 'true'
    const isFeatured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const query: Record<string, unknown> = { isActive: true }
    
    if (category) query.category = category
    if (isNew) query.isNew = true
    if (isFeatured) query.isFeatured = true

    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ProductModel.countDocuments(query),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { error: 'Ürünler yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // TODO: Add authentication check for admin
    
    const product = await ProductModel.create(body)
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Create Product Error:', error)
    return NextResponse.json(
      { error: 'Ürün oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}
