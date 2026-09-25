'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useCartStore from '@/lib/store'
import toast from 'react-hot-toast'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity } = useCartStore()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center page-animate" style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
        <div className="bg-white p-5 rounded-1 shadow-sm d-inline-block mt-5">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
          <h4 className="mt-4 fw-bold">Your cart is empty!</h4>
          <p className="text-muted mb-4">Add items to it now.</p>
          <Link href="/" className="btn btn-primary px-5 py-2 fw-bold rounded-1" style={{ backgroundColor: '#2874f0' }}>
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-animate" style={{ backgroundColor: '#f1f3f6', minHeight: '100vh', padding: '30px 0' }}>
      <div className="container">
        <div className="row g-4">
          
          {/* Left Column - Cart Items */}
          <div className="col-lg-8">
            <div className="bg-white shadow-sm rounded-1 mb-3">
              {/* Header */}
              <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
                <div className="d-flex align-items-center gap-3">
                  <div className="form-check m-0">
                    <input className="form-check-input shadow-none rounded-0 bg-success border-success" type="checkbox" checked readOnly style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span className="fw-medium text-dark">All</span>
                  <h5 className="m-0 fw-bold ms-2" style={{ fontSize: '18px' }}>Shopping Cart</h5>
                </div>
                <span className="badge bg-primary rounded-pill px-3 py-2 fw-medium" style={{ backgroundColor: '#2874f0' }}>{totalItems} Item{totalItems > 1 ? 's' : ''}</span>
              </div>

              {/* Items List */}
              <div>
                {items.map((item) => (
                  <div className="p-4 border-bottom" key={item.productId}>
                    <div className="d-flex gap-4">
                      {/* Left: Checkbox & Image */}
                      <div className="d-flex align-items-start gap-3">
                        <div className="form-check mt-5">
                          <input className="form-check-input shadow-none rounded-0 bg-success border-success" type="checkbox" checked readOnly style={{ width: '18px', height: '18px' }} />
                        </div>
                        <div className="border rounded-2 p-2 d-flex justify-content-center align-items-center" style={{ width: '110px', height: '110px', backgroundColor: '#fff' }}>
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            {item.image ? (
                              <Image src={item.image.startsWith('/') ? item.image : `/products/${item.image}`} alt={item.name} fill className="object-fit-contain mix-blend-multiply" />
                            ) : (
                              <Image src="/images/placeholder.png" alt="Placeholder" fill className="object-fit-contain mix-blend-multiply" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Details */}
                      <div className="flex-grow-1">
                        <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '16px' }}>{item.name}</h6>
                        <div className="text-muted small mb-2">Seller: White Mart</div>
                        
                        {item.stock && item.stock <= 5 && (
                          <div className="fw-bold mb-2" style={{ color: '#ff9f00', fontSize: '12px' }}>Only {item.stock} left</div>
                        )}

                        <div className="fw-bold text-dark mb-3" style={{ fontSize: '18px' }}>
                          ₹{item.price.toLocaleString('en-IN')}.00
                        </div>

                        <div className="d-flex align-items-center gap-4">
                          {/* Quantity Selector */}
                          <div className="input-group input-group-sm" style={{ width: '110px' }}>
                            <button 
                              className="btn btn-outline-secondary rounded-circle d-flex justify-content-center align-items-center fw-bold" 
                              style={{ width: '28px', height: '28px' }}
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.productId, item.quantity - 1)
                                } else {
                                  removeItem(item.productId)
                                  toast.success('Item removed')
                                }
                              }}
                            >-</button>
                            <input type="text" className="form-control text-center border-0 bg-transparent fw-bold px-1" value={item.quantity} readOnly />
                            <button 
                              className="btn btn-outline-secondary rounded-circle d-flex justify-content-center align-items-center fw-bold" 
                              style={{ width: '28px', height: '28px' }}
                              onClick={() => {
                                if (item.stock && item.quantity >= item.stock) {
                                  toast.error(`Only ${item.stock} items available in stock.`)
                                } else {
                                  updateQuantity(item.productId, item.quantity + 1)
                                }
                              }}
                            >+</button>
                          </div>
                          
                          {/* Remove Button */}
                          <button 
                            className="btn btn-link text-dark text-decoration-none fw-bold p-0 d-flex align-items-center gap-1" 
                            style={{ fontSize: '14px' }}
                            onClick={() => {
                              removeItem(item.productId)
                              toast.success('Item removed')
                            }}
                          >
                            <i className="bi bi-trash"></i> REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
                <span className="text-muted" style={{ fontSize: '14px' }}>{totalItems} item(s) selected</span>
                <button onClick={() => router.push('/checkout')} className="btn text-white fw-bold px-5 py-2 rounded-1" style={{ backgroundColor: '#28a745', fontSize: '15px', letterSpacing: '0.5px' }}>
                  BUY NOW
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Price Details */}
          <div className="col-lg-4">
            <div className="bg-white shadow-sm rounded-1 sticky-top" style={{ top: '80px', zIndex: 10 }}>
              <div className="p-3 border-bottom">
                <h6 className="m-0 fw-bold text-muted" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>PRICE DETAILS</h6>
              </div>
              
              <div className="p-4 border-bottom">
                <div className="d-flex justify-content-between mb-3 text-dark" style={{ fontSize: '15px' }}>
                  <span>Price ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-dark" style={{ fontSize: '15px' }}>
                  <span>Discount</span>
                  <span className="text-success">- ₹0</span>
                </div>
                <div className="d-flex justify-content-between mb-4 text-dark" style={{ fontSize: '15px' }}>
                  <span>Delivery Charges</span>
                  <span><span className="text-muted text-decoration-line-through me-1">₹40</span> <span className="text-success fw-medium">Free</span></span>
                </div>
                
                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-dashed">
                  <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>Total Amount</span>
                  <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 pb-0">
                <button onClick={() => router.push('/checkout')} className="btn w-100 text-white fw-bold py-3 mb-3 rounded-1 shadow-sm" style={{ backgroundColor: '#28a745', fontSize: '15px', letterSpacing: '0.5px' }}>
                  BUY NOW
                </button>
                <div className="text-success d-flex align-items-center gap-2 mb-3" style={{ fontSize: '13px', fontWeight: 500 }}>
                  <i className="bi bi-tag-fill"></i> You will save on this order
                </div>
              </div>
              
              <div className="p-3 bg-light border-top d-flex align-items-center gap-2 rounded-bottom-1">
                <i className="bi bi-shield-fill-check text-success fs-4"></i>
                <span className="text-muted" style={{ fontSize: '12px', lineHeight: '1.4' }}>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
