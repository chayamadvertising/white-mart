import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'

export default async function AdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: { email: 'asc' },
    include: {
      _count: { select: { orders: true } }
    }
  })

  return (
    <div>
      <h3 className="fw-bold mb-4">Registered Users</h3>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4 py-3">User Info</th>
                  <th>Role</th>
                  <th>Total Orders</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">No users found.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4">
                        <div className="fw-bold">{u.name || 'No Name'}</div>
                        <small className="text-muted">{u.email}</small>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u._count.orders} orders</td>
                      <td className="text-end px-4">
                        <button className="btn btn-sm btn-outline-secondary" disabled>Edit Role</button>
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
