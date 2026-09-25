import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: { items: true }
    })

    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ message: 'Order cannot be cancelled' }, { status: 400 })
    }

    // Update order status
    await prisma.order.update({
      where: { id: params.orderId },
      data: { status: 'cancelled' }
    })

    // Restore stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } }
      })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    return NextResponse.json({ message: 'Error cancelling order' }, { status: 500 })
  }
}
