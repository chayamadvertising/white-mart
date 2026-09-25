import { prisma } from '@/lib/prisma'
import ProductForm from './ProductForm'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  const categories = await prisma.category.findMany()
  
  return (
    <div className="mx-auto" style={{ maxWidth: '800px' }}>
      <h4 className="fw-bold mb-4">Add New Product</h4>
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-4">
          <ProductForm categories={categories} />
        </div>
      </div>
    </div>
  )
}
