import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import OrderModel from '@/models/Order'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // Validate required fields
    const required = ['items', 'customerInfo', 'shippingAddress']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} alanı zorunludur` },
          { status: 400 }
        )
      }
    }

    // Calculate totals
    const subtotal = body.items.reduce(
      (sum: number, item: { price: number; quantity: number }) => 
        sum + item.price * item.quantity, 
      0
    )
    const shippingCost = subtotal > 500 ? 0 : 49.90
    const total = subtotal + shippingCost

    // Create order
    const order = await OrderModel.create({
      ...body,
      subtotal,
      shippingCost,
      total,
      status: 'pending',
      paymentStatus: 'pending',
    })

    return NextResponse.json({
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber,
    }, { status: 201 })
  } catch (error) {
    console.error('Create Order Error:', error)
    return NextResponse.json(
      { error: 'Sipariş oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const email = searchParams.get('email')

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Sipariş numarası ve e-posta gereklidir' },
        { status: 400 }
      )
    }

    const order = await OrderModel.findOne({
      orderNumber,
      'customerInfo.email': email,
    }).lean()

    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Get Order Error:', error)
    return NextResponse.json(
      { error: 'Sipariş sorgulanırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
