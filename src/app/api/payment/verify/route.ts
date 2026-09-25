import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderNotification } from '@/lib/sendEmail'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await request.json()

    const secret = process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET'

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (generated_signature === razorpay_signature) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'completed',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        },
        include: { user: true }
      })
      
      const { sendOrderConfirmationEmail } = await import('@/lib/email')
      await sendOrderConfirmationEmail(order.user.email!, order.orderNumber, order.totalAmount)

      return NextResponse.json({ status: 'ok' })
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'failed' }
      })
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ message: 'Verification error' }, { status: 500 })
  }
}
