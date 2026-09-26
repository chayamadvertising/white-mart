'use client'

import useCartStore from '@/lib/store'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function AddToCartButton({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem)
  const [loading, setLoading] = useState(false)

  const handleAdd = () => {
    setLoading(true)
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image || '',
      stock: product.stock
    })
    toast.success('Added to cart')
    setTimeout(() => setLoading(false), 500)
  }

  return (
    <button 
      onClick={handleAdd} 
      className="btn w-100 py-3 fw-bold shadow-sm d-flex justify-content-center align-items-center text-white gap-2" 
      style={{ backgroundColor: '#ff9f00', borderRadius: '4px' }}
      disabled={!product.available || product.stock <= 0 || loading}
    >
      <i className="bi bi-cart-fill"></i> {loading ? 'ADDING...' : 'ADD TO CART'}
    </button>
  )
}
