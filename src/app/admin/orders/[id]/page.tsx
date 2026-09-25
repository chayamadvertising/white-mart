import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import OrderStatusSelect from '../OrderStatusSelect'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  })

  if (!order) return notFound()

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">
          <Link href="/admin/orders" className="text-dark text-decoration-none me-2">
            <i className="bi bi-arrow-left"></i>
          </Link>
          Order Details #{order.orderNumber}
        </h4>
        <div className="d-flex gap-2">
          <OrderStatusSelect 
            orderId={order.id} 
            currentStatus={order.status} 
            estimatedDelivery={order.estimatedDelivery ? order.estimatedDelivery.toISOString() : null} 
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white p-3 fw-bold border-bottom">
              Ordered Items
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {order.items.map((item) => (
                  <li key={item.id} className="list-group-item p-3 d-flex align-items-center gap-3">
                    <div className="bg-light p-2 rounded" style={{ width: '60px', height: '60px', position: 'relative' }}>
                      {item.product.image ? (
                        <Image src={item.product.image.startsWith('/') ? item.product.image : `/products/${item.product.image}`} alt={item.product.name} fill className="object-fit-contain" />
                      ) : (
                        <i className="bi bi-image text-muted d-flex justify-content-center align-items-center h-100"></i>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="m-0 fw-bold">{item.product.name}</h6>
                      <small className="text-muted">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</small>
                    </div>
                    <div className="fw-bold">
                      ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer bg-light p-3 d-flex justify-content-end">
              <h5 className="m-0 fw-bold">Total: ₹{order.totalAmount.toLocaleString('en-IN')}</h5>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white p-3 fw-bold border-bottom">
              Customer Info
            </div>
            <div className="card-body">
              <p className="mb-1 fw-bold">{order.user?.name || 'Guest User'}</p>
              <p className="mb-1 text-muted"><i className="bi bi-envelope me-2"></i>{order.user?.email || 'N/A'}</p>
              <p className="mb-0 text-muted"><i className="bi bi-telephone me-2"></i>{order.shippingPhone}</p>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white p-3 fw-bold border-bottom">
              Shipping Address
            </div>
            <div className="card-body text-muted">
              <p className="mb-1">{order.shippingAddress}</p>
              <p className="mb-1">{order.shippingCity}, {order.shippingState}</p>
              <p className="mb-0">{order.shippingCountry} - {order.shippingZipcode}</p>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white p-3 fw-bold border-bottom">
              Payment Details
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Method:</span>
                <span className="fw-bold">{order.paymentMethod}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Status:</span>
                <span className={`badge ${order.paymentStatus === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                  <span className="text-muted small">Txn ID:</span>
                  <span className="small text-truncate" style={{maxWidth: '150px'}}>{order.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
