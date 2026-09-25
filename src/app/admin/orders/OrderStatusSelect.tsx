'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function OrderStatusSelect({ orderId, currentStatus, estimatedDelivery }: { orderId: string, currentStatus: string, estimatedDelivery: string | null }) {
  const [status, setStatus] = useState(currentStatus)
  const [date, setDate] = useState(estimatedDelivery ? new Date(estimatedDelivery).toISOString().split('T')[0] : '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          estimatedDelivery: date ? new Date(date).toISOString() : null
        })
      })
      if (res.ok) {
        toast.success('Order status updated!')
        router.refresh()
      } else {
        toast.error('Failed to update')
      }
    } catch (e) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex flex-column gap-2" style={{ minWidth: '200px' }}>
      <select 
        className={`form-select form-select-sm fw-bold ${status === 'delivered' ? 'border-success text-success' : status === 'shipped' ? 'border-info text-info' : 'border-secondary'}`}
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      
      <div className="input-group input-group-sm">
        <span className="input-group-text" title="Expected Delivery Date"><i className="bi bi-calendar-event"></i></span>
        <input 
          type="date" 
          className="form-control" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          title="Expected Delivery Date"
        />
      </div>
      
      {(status !== currentStatus || (date && estimatedDelivery && date !== new Date(estimatedDelivery).toISOString().split('T')[0]) || (date && !estimatedDelivery)) && (
        <button onClick={handleUpdate} disabled={loading} className="btn btn-sm btn-primary mt-1">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    </div>
  )
}
