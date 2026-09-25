import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  })

  return NextResponse.json(user)
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { name, phone, address } = await request.json()

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      profile: {
        upsert: {
          create: { phone, address },
          update: { phone, address },
        },
      },
    },
    include: { profile: true },
  })

  return NextResponse.json(updatedUser)
}
