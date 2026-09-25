import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import OrderStatusSelect from './OrderStatusSelect'

export const dynamic = 'force-dynamic'

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h3 className="fw-bold mb-4">Manage Orders</h3>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Order ID / Date</th>
                  <th>Customer Info</th>
                  <th>Amount & Payment</th>
                  <th>Order Status</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4">
                        <div className="fw-bold">{order.orderNumber}</div>
                        <small className="text-muted">{new Date(order.createdAt).toLocaleString()}</small>
                        <div className="mt-1 small">
                          <span className="text-muted">{order.items.length} items</span>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold">{order.shippingAddress.split(',')[0] || order.user?.name || 'Guest'}</div>
                        <small className="text-muted">{order.shippingCity}, {order.shippingPhone}</small>
                      </td>
                      <td>
                        <div className="fw-bold">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                        <span className={`badge ${order.paymentStatus === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {order.paymentMethod} - {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} estimatedDelivery={order.estimatedDelivery ? order.estimatedDelivery.toISOString() : null} />
                      </td>
                      <td className="text-end px-4">
                        <Link href={`/orders/${order.orderNumber}`} className="btn btn-sm btn-outline-primary" title="View details" target="_blank">
                          <i className="bi bi-eye"></i> View
                        </Link>
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
