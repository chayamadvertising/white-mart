'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CategoryForm() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      })
      if (res.ok) {
        toast.success('Category added!')
        setName('')
        router.refresh()
      } else {
        toast.error('Failed to add category')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label text-muted small fw-bold">Category Name</label>
        <input 
          type="text" 
          className="form-control" 
          required 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="e.g. Smart Phones" 
        />
      </div>
      <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>
        {loading ? 'Adding...' : 'Add Category'}
      </button>
    </form>
  )
}
