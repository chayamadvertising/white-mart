'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Product deleted')
        router.refresh()
      } else {
        toast.error('Failed to delete')
      }
    } catch (error) {
      toast.error('Error deleting product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="btn btn-sm btn-outline-danger" title="Delete">
      {loading ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-trash"></i>}
    </button>
  )
}
