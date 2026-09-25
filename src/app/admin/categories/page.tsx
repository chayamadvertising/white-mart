import { prisma } from '@/lib/prisma'
import CategoryForm from './CategoryForm'

export const dynamic = 'force-dynamic'

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div>
      <h3 className="fw-bold mb-4">Categories</h3>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle m-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3">Category Name</th>
                      <th>Total Products</th>
                      <th className="text-end px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-5 text-muted">No categories found.</td>
                      </tr>
                    ) : (
                      categories.map((c) => (
                        <tr key={c.id}>
                          <td className="px-4 fw-bold">{c.name}</td>
                          <td>{c._count.products} products</td>
                          <td className="text-end px-4">
                            <button className="btn btn-sm btn-outline-danger" disabled title="Cannot delete from demo UI">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-bottom p-3">
              <h5 className="m-0 fw-bold">Add New Category</h5>
            </div>
            <div className="card-body p-3">
              <CategoryForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
