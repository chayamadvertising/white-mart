import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { notFound } from 'next/navigation'

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  })

  if (!category) {
    notFound()
  }

  const products = await prisma.product.findMany({
    where: { categoryId: params.id, available: true },
  })

  return (
    <div className="container py-4">
      <h2 className="mb-4">{category.name}</h2>
      {products.length === 0 ? (
        <p className="text-muted">No products found in this category.</p>
      ) : (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
          {products.map((product) => (
            <div className="col" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
