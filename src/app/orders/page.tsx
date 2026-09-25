import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 0

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  })

  if (orders.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-4 text-primary fw-bold">No Orders Yet</h2>
        <p className="text-muted mb-4">You haven't placed any orders.</p>
        <Link href="/" className="btn btn-primary px-4 py-2 rounded-pill fw-bold">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-primary">My Orders</h2>
      
      <div className="row g-4">
        {orders.map((order) => (
          <div className="col-12" key={order.id}>
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden hover:shadow transition-shadow">
              <div className="card-header bg-light border-0 py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <span className="text-muted small d-block">Order Placed</span>
                  <span className="fw-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-muted small d-block">Total Amount</span>
                  <span className="fw-medium">₹{order.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div>
                  <span className="text-muted small d-block">Order #</span>
                  <span className="fw-medium">{order.orderNumber}</span>
                </div>
                <div>
                  <Link href={`/orders/${order.orderNumber}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0 fw-bold">Status: <span className={`text-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></h5>
                </div>
                
                {order.items.map((item) => (
                  <div className="d-flex align-items-center mb-3" key={item.id}>
                    <div className="bg-light p-2 rounded-3 me-3" style={{ width: '64px', height: '64px' }}>
                       {item.product.image ? (
                          <img src={item.product.image.startsWith('/') ? item.product.image : `/products/${item.product.image}`} alt={item.product.name} className="w-100 h-100 object-fit-contain" />
                       ) : (
                          <img src="/images/placeholder.png" alt="Placeholder" className="w-100 h-100 object-fit-contain" />
                       )}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1"><Link href={`/product/${item.productId}`} className="text-dark text-decoration-none hover:text-blue-600">{item.product.name}</Link></h6>
                      <p className="text-muted mb-0 small">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
