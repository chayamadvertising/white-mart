'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST'
      })
      if (res.ok) {
        toast.success('Order cancelled successfully')
        router.refresh()
      } else {
        toast.error('Failed to cancel order')
      }
    } catch (error) {
      toast.error('Failed to cancel order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={handleCancel} 
      disabled={loading}
      className="btn btn-outline-danger w-100 rounded-pill py-2 fw-medium"
    >
      {loading ? 'Cancelling...' : 'Cancel Order'}
    </button>
  )
}
