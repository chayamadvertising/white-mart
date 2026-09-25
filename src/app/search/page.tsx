import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || ''
  
  const products = await prisma.product.findMany({
    where: {
      available: true,
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
        { category: { name: { contains: query } } },
      ],
    },
  })

  return (
    <div className="container py-4">
      <h2 className="mb-4">Search Results for "{query}"</h2>
      {products.length === 0 ? (
        <p className="text-muted">No products found matching your search.</p>
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
