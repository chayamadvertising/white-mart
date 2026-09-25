'use client'

import useCartStore from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function BuyNowButton({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleBuyNow = () => {
    setLoading(true)
    // Add item to cart first
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      stock: product.stock
    })
    // Then navigate straight to checkout
    router.push('/checkout')
  }

  return (
    <button 
      onClick={handleBuyNow} 
      className="btn w-100 py-3 fw-bold shadow-sm d-flex justify-content-center align-items-center text-white" 
      style={{ backgroundColor: '#28a745', borderRadius: '4px' }}
      disabled={!product.available || product.stock <= 0 || loading}
    >
      {loading ? 'REDIRECTING...' : 'BUY NOW'}
    </button>
  )
}
