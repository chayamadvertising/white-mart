import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import CancelOrderButton from './CancelOrderButton'

export const revalidate = 0

export default async function OrderDetailPage({ params }: { params: { order_number: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber: params.order_number },
    include: {
      items: {
        include: { product: true }
      }
    }
  })

  if (!order || order.userId !== session.user.id) {
    notFound()
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold text-primary">Order Details</h2>
        <Link href="/orders" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
          <i className="bi bi-arrow-left me-1"></i> Back to Orders
        </Link>
      </div>
      
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold m-0 text-dark">Items Ordered</h5>
              <span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'} px-3 py-2 rounded-pill`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className="card-body p-4">
              {order.items.map((item) => (
                <div className="d-flex align-items-center py-3 border-bottom" key={item.id}>
                  <div className="bg-light p-2 rounded-3 me-3" style={{ width: '80px', height: '80px' }}>
                    {item.product.image ? (
                        <img src={item.product.image.startsWith('/') ? item.product.image : `/products/${item.product.image}`} alt={item.product.name} className="w-100 h-100 object-fit-contain" />
                    ) : (
                        <img src="/images/placeholder.png" alt="Placeholder" className="w-100 h-100 object-fit-contain" />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1"><Link href={`/product/${item.productId}`} className="text-dark text-decoration-none hover:text-blue-600">{item.product.name}</Link></h6>
                    <p className="text-muted mb-0 small">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="fw-bold text-primary">
                    ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Shipping Details</h5>
              <p className="mb-1 text-dark fw-medium">{order.shippingAddress}</p>
              <p className="mb-1 text-muted">{order.shippingCity}, {order.shippingState} - {order.shippingZipcode}</p>
              <p className="mb-1 text-muted">{order.shippingCountry}</p>
              <p className="mb-0 text-muted"><i className="bi bi-telephone me-2"></i>{order.shippingPhone}</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 mb-4 sticky-top" style={{ top: '80px' }}>
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="fw-medium">₹{(order.totalAmount - order.taxAmount - order.shippingCost).toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tax</span>
                <span className="fw-medium">₹{order.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Shipping</span>
                <span className="fw-medium">₹{order.shippingCost.toLocaleString('en-IN')}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-5 text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="mb-4">
                <p className="mb-1 text-muted small">Payment Method</p>
                <p className="fw-medium">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay'}</p>
                <p className="mb-1 text-muted small">Payment Status</p>
                <p className={`fw-medium text-${order.paymentStatus === 'completed' ? 'success' : order.paymentStatus === 'failed' ? 'danger' : 'warning'}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </p>
              </div>

              {order.status === 'pending' && (
                <CancelOrderButton orderId={order.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
