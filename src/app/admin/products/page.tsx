import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import DeleteProductButton from './DeleteProductButton'

export const dynamic = 'force-dynamic'

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Products</h3>
        <Link href="/admin/products/new" className="btn btn-primary fw-bold">
          <i className="bi bi-plus-lg me-2"></i>Add New Product
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">No products found. Add one!</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-light p-1 rounded" style={{ width: '50px', height: '50px', position: 'relative' }}>
                            {product.image ? (
                              <Image src={product.image.startsWith('/') ? product.image : `/products/${product.image}`} alt={product.name} fill className="object-fit-contain" />
                            ) : (
                              <div className="w-100 h-100 d-flex justify-content-center align-items-center"><i className="bi bi-image text-muted"></i></div>
                            )}
                          </div>
                          <div>
                            <h6 className="m-0 fw-bold">{product.name}</h6>
                            <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '200px' }}>{product.description}</small>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-secondary">{product.category.name}</span></td>
                      <td className="fw-bold">₹{product.price.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td>
                        {product.available ? (
                          <span className="text-success fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Active</span>
                        ) : (
                          <span className="text-danger fw-bold"><i className="bi bi-x-circle-fill me-1"></i>Hidden</span>
                        )}
                      </td>
                      <td className="text-end px-4">
                        <div className="btn-group">
                          <Link href={`/admin/products/${product.id}/edit`} className="btn btn-sm btn-outline-primary" title="Edit">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <DeleteProductButton productId={product.id} />
                        </div>
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
  )
}
