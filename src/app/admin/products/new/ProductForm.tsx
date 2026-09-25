'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ProductForm({ categories, initialProduct }: { categories: any[], initialProduct?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    description: initialProduct?.description || '',
    price: initialProduct?.price?.toString() || '',
    stock: initialProduct?.stock?.toString() || '10',
    categoryId: initialProduct?.categoryId || (categories.length > 0 ? categories[0].id : ''),
    image: initialProduct?.image || '',
    available: initialProduct ? initialProduct.available : true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const url = initialProduct ? `/api/admin/products/${initialProduct.id}` : '/api/admin/products'
      const method = initialProduct ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      })
      
      if (res.ok) {
        toast.success('Product added successfully!')
        router.push('/admin/products')
        router.refresh()
      } else {
        toast.error('Failed to add product')
      }
    } catch (err) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label fw-bold">Product Name</label>
        <input type="text" className="form-control" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      </div>
      
      <div className="mb-3">
        <label className="form-label fw-bold">Description</label>
        <textarea className="form-control" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
      </div>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">Price (₹)</label>
          <input type="number" step="0.01" className="form-control" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold">Stock Quantity</label>
          <input type="number" className="form-control" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
        </div>
      </div>
      
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">Category</label>
          <select className="form-select" required value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})}>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold">Image URL / Path</label>
          <input type="text" className="form-control" placeholder="/images/my-product.jpg" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
          <small className="text-muted">Enter a path like /images/img1.jpg</small>
        </div>
      </div>
      
      <div className="mb-4 form-check">
        <input type="checkbox" className="form-check-input" id="availableCheck" checked={formData.available} onChange={(e) => setFormData({...formData, available: e.target.checked})} />
        <label className="form-check-label fw-bold" htmlFor="availableCheck">Available (Active in store)</label>
      </div>
      
      <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
        <button type="button" onClick={() => router.back()} className="btn btn-light border fw-bold px-4">Cancel</button>
        <button type="submit" disabled={loading} className="btn btn-primary fw-bold px-4">
          {loading ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}
