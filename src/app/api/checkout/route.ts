import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Razorpay from 'razorpay'
import { sendOrderNotification } from '@/lib/sendEmail'

// Ensure these exist in your env, fallback for testing
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET',
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const {
      items, paymentMethod, shippingAddress, shippingCity,
      shippingState, shippingCountry, shippingZipcode, shippingPhone,
      subtotal, taxAmount, shippingCost, grandTotal
    } = data

    // Generate Order Number
    const orderNumber = `ORD-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        paymentMethod,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingCountry,
        shippingZipcode,
        shippingPhone,
        totalAmount: grandTotal,
        taxAmount,
        shippingCost,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })

    // Update stock levels
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }

    if (paymentMethod === 'RAZORPAY') {
      const options = {
        amount: Math.round(grandTotal * 100), // amount in smallest currency unit (paise)
        currency: 'INR',
        receipt: orderNumber,
      }
      const razorpayOrder = await razorpay.orders.create(options)
      
      await prisma.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: razorpayOrder.id }
      })

      return NextResponse.json({ orderId: order.id, orderNumber, razorpayOrder })
    }

    // Import the send email utility dynamically or statically
    const { sendOrderConfirmationEmail } = await import('@/lib/email')
    await sendOrderConfirmationEmail(session.user.email!, orderNumber, grandTotal)

    return NextResponse.json({ orderId: order.id, orderNumber })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ message: 'Error processing checkout' }, { status: 500 })
  }
}
