import { prisma } from '@/lib/prisma'
import ProductForm from '../../new/ProductForm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const categories = await prisma.category.findMany()
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  })
  
  if (!product) return notFound()
  
  return (
    <div className="mx-auto" style={{ maxWidth: '800px' }}>
      <h4 className="fw-bold mb-4">Edit Product: {product.name}</h4>
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-4">
          <ProductForm categories={categories} initialProduct={product} />
        </div>
      </div>
    </div>
  )
}
