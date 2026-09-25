import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count()
  const totalOrders = await prisma.order.count()
  const totalUsers = await prisma.user.count()
  
  // Calculate total revenue from completed orders
  const orders = await prisma.order.findMany({
    where: { paymentStatus: 'completed' },
    select: { totalAmount: true }
  })
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

  // Recent Orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  })

  return (
    <div>
      <h3 className="mb-4 fw-bold">Dashboard Overview</h3>
      
      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-3">
                  <i className="bi bi-box-seam fs-4"></i>
                </div>
                <h6 className="text-muted fw-bold m-0">Total Products</h6>
              </div>
              <h3 className="fw-bold m-0">{totalProducts}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle me-3">
                  <i className="bi bi-cart-check fs-4"></i>
                </div>
                <h6 className="text-muted fw-bold m-0">Total Orders</h6>
              </div>
              <h3 className="fw-bold m-0">{totalOrders}</h3>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle me-3">
                  <i className="bi bi-currency-rupee fs-4"></i>
                </div>
                <h6 className="text-muted fw-bold m-0">Revenue</h6>
              </div>
              <h3 className="fw-bold m-0">₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle me-3">
                  <i className="bi bi-people fs-4"></i>
                </div>
                <h6 className="text-muted fw-bold m-0">Total Users</h6>
              </div>
              <h3 className="fw-bold m-0">{totalUsers}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white p-4 d-flex justify-content-between align-items-center border-bottom">
          <h5 className="m-0 fw-bold">Recent Orders</h5>
          <Link href="/admin/orders" className="btn btn-sm btn-outline-primary">View All</Link>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="text-end px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">No orders found.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 fw-bold">{order.orderNumber}</td>
                      <td>{order.user?.name || order.user?.email || 'Guest'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="fw-bold">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${
                          order.status === 'delivered' ? 'bg-success' :
                          order.status === 'shipped' ? 'bg-info' :
                          order.status === 'processing' ? 'bg-warning' : 'bg-secondary'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end px-4">
                        <Link href={`/admin/orders/${order.id}`} className="btn btn-sm btn-primary">View</Link>
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
