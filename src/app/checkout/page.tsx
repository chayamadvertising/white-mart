'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import useCartStore from '@/lib/store'
import toast from 'react-hot-toast'
import Image from 'next/image'

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZipcode: '',
    shippingCountry: 'India',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetch('/api/profile')
        .then(res => res.json())
        .then(user => {
          if (user.profile) {
            setFormData(prev => ({
              ...prev,
              firstName: user.firstName || session.user?.name?.split(' ')[0] || '',
              lastName: user.lastName || session.user?.name?.split(' ').slice(1).join(' ') || '',
              email: session.user?.email || '',
              shippingAddress: user.profile.address || '',
              shippingPhone: user.profile.phone || ''
            }))
          }
        })
    }
  }, [status, router])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  // According to image, tax is not separated, just "Price" and "Delivery Charges (Free)"
  const grandTotal = subtotal

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
        <h2 className="mb-4">Your Cart is Empty</h2>
        <button onClick={() => router.push('/')} className="btn btn-primary">Start Shopping</button>
      </div>
    )
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          paymentMethod,
          shippingAddress: formData.shippingAddress,
          shippingCity: formData.shippingCity,
          shippingState: formData.shippingState,
          shippingCountry: formData.shippingCountry,
          shippingZipcode: formData.shippingZipcode,
          shippingPhone: formData.shippingPhone,
          subtotal,
          taxAmount: 0,
          shippingCost: 0,
          grandTotal
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Checkout failed')
      }

      if (paymentMethod === 'COD') {
        clearCart()
        toast.success('Order placed successfully!')
        router.push(`/orders/${data.orderNumber}`)
        return
      }

      // Razorpay Flow
      const resScript = await loadRazorpayScript()
      if (!resScript) {
        toast.error('Razorpay SDK failed to load. Are you online?')
        setLoading(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: 'White Mart',
        description: 'Purchase Transaction',
        order_id: data.razorpayOrder.id,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId
            })
          })
          const verifyData = await verifyRes.json()
          if (verifyRes.ok) {
            clearCart()
            toast.success('Payment successful!')
            router.push(`/orders/${data.orderNumber}`)
          } else {
            toast.error('Payment verification failed!')
          }
        },
        prefill: {
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          contact: formData.shippingPhone
        },
        theme: {
          color: '#2874f0'
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()

    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-animate" style={{ backgroundColor: '#f1f3f6', minHeight: '100vh', padding: '30px 0' }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-8">
            {/* 1. Login Details */}
            <div className="bg-white shadow-sm mb-3 rounded-1">
              <div className="d-flex align-items-center p-3">
                <div className="bg-light text-primary d-flex justify-content-center align-items-center rounded-1 fw-bold me-3" style={{ width: '24px', height: '24px', fontSize: '13px' }}>1</div>
                <h6 className="m-0 fw-bold text-muted" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>LOGIN DETAILS</h6>
              </div>
              <div className="p-4 pt-0">
                <span className="fw-medium text-dark">{session?.user?.name || session?.user?.email}</span>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="shadow-sm mb-3 rounded-1" style={{ backgroundColor: '#2874f0' }}>
              <div className="d-flex align-items-center p-3">
                <div className="bg-white text-primary d-flex justify-content-center align-items-center rounded-1 fw-bold me-3" style={{ width: '24px', height: '24px', fontSize: '13px' }}>2</div>
                <h6 className="m-0 fw-bold text-white" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>DELIVERY ADDRESS</h6>
              </div>
              <div className="bg-white p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" className="form-control bg-light border-0 p-3 shadow-none" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <input type="text" className="form-control bg-light border-0 p-3 shadow-none" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <input type="email" className="form-control bg-light border-0 p-3 shadow-none" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <input type="tel" className="form-control bg-light border-0 p-3 shadow-none" placeholder="Phone Number" value={formData.shippingPhone} onChange={e => setFormData({...formData, shippingPhone: e.target.value})} />
                  </div>
                  <div className="col-12">
                    <textarea className="form-control bg-light border-0 p-3 shadow-none" placeholder="Address (Area and Street)" style={{ height: '100px', resize: 'none' }} value={formData.shippingAddress} onChange={e => setFormData({...formData, shippingAddress: e.target.value})}></textarea>
                  </div>
                  <div className="col-md-4">
                    <input type="text" className="form-control bg-light border-0 p-3 shadow-none" placeholder="City/District/Town" value={formData.shippingCity} onChange={e => setFormData({...formData, shippingCity: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <input type="text" className="form-control bg-light border-0 p-3 shadow-none" placeholder="State" value={formData.shippingState} onChange={e => setFormData({...formData, shippingState: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <input type="text" className="form-control bg-light border-0 p-3 shadow-none" placeholder="Pincode" value={formData.shippingZipcode} onChange={e => setFormData({...formData, shippingZipcode: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Options */}
            <div className="bg-white shadow-sm mb-4 rounded-1">
              <div className="d-flex align-items-center p-3 border-bottom">
                <div className="bg-primary text-white d-flex justify-content-center align-items-center rounded-1 fw-bold me-3" style={{ width: '24px', height: '24px', fontSize: '13px' }}>3</div>
                <h6 className="m-0 fw-bold text-dark" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>PAYMENT OPTIONS</h6>
              </div>
              <div className="p-4 bg-white">
                
                <label className="w-100 mb-3" style={{ cursor: 'pointer' }}>
                  <div className={`border rounded-1 p-3 d-flex align-items-center justify-content-between transition-all ${paymentMethod === 'COD' ? 'border-primary' : 'border-light'}`} style={{ backgroundColor: paymentMethod === 'COD' ? '#f5faff' : '#fff' }}>
                    <div className="d-flex align-items-center">
                      <input type="radio" className="form-check-input mt-0 me-3 shadow-none" style={{ width: '18px', height: '18px' }} name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                      <div>
                        <div className="fw-bold" style={{ fontSize: '15px', color: paymentMethod === 'COD' ? '#2874f0' : '#333' }}>Cash on Delivery</div>
                        <div className="text-muted small">Pay with cash at your doorstep.</div>
                      </div>
                    </div>
                    <i className="bi bi-cash-stack fs-3" style={{ color: paymentMethod === 'COD' ? '#26a541' : '#ccc' }}></i>
                  </div>
                </label>

                <label className="w-100" style={{ cursor: 'pointer' }}>
                  <div className={`border rounded-1 p-3 d-flex align-items-center justify-content-between transition-all ${paymentMethod === 'RAZORPAY' ? 'border-primary' : 'border-light'}`} style={{ backgroundColor: paymentMethod === 'RAZORPAY' ? '#f5faff' : '#fff' }}>
                    <div className="d-flex align-items-center">
                      <input type="radio" className="form-check-input mt-0 me-3 shadow-none" style={{ width: '18px', height: '18px' }} name="paymentMethod" value="RAZORPAY" checked={paymentMethod === 'RAZORPAY'} onChange={() => setPaymentMethod('RAZORPAY')} />
                      <div>
                        <div className="fw-bold" style={{ fontSize: '15px', color: paymentMethod === 'RAZORPAY' ? '#2874f0' : '#333' }}>Online Payment (Razorpay)</div>
                        <div className="text-muted small">Safe and secure online payments via Razorpay.</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <i className="bi bi-credit-card-2-front fs-3" style={{ color: paymentMethod === 'RAZORPAY' ? '#2874f0' : '#ccc' }}></i>
                      <i className="bi bi-phone fs-3" style={{ color: paymentMethod === 'RAZORPAY' ? '#2874f0' : '#ccc' }}></i>
                    </div>
                  </div>
                </label>

              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center px-2">
              <p className="text-muted small mb-0" style={{ maxWidth: '350px' }}>
                By continuing, you agree to ShopEase's <a href="#" className="text-primary text-decoration-none">Terms of Use</a> and <a href="#" className="text-primary text-decoration-none">Privacy Policy</a>.
              </p>
              <button onClick={handleCheckout} disabled={loading} className="btn fw-bold text-white px-5 py-3 shadow-sm rounded-1" style={{ backgroundColor: '#fb641b', minWidth: '220px', letterSpacing: '0.5px' }}>
                {loading ? 'PROCESSING...' : 'CONTINUE'}
              </button>
            </div>

          </div>
          
          <div className="col-lg-4">
            <div className="bg-white shadow-sm rounded-1 sticky-top" style={{ top: '80px' }}>
              <div className="p-3 border-bottom">
                <h6 className="m-0 fw-bold text-muted" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>PRICE DETAILS</h6>
              </div>
              
              <div className="p-3 border-bottom bg-light">
                {items.slice(0,2).map((item) => (
                  <div className="d-flex align-items-center justify-content-between mb-2" key={item.productId}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', position: 'relative' }}>
                        {item.image ? (
                           <Image src={item.image.startsWith('/') ? item.image : `/products/${item.image}`} alt={item.name} fill className="object-fit-contain mix-blend-multiply" />
                        ) : (
                           <Image src="/images/placeholder.png" alt="Placeholder" fill className="object-fit-contain mix-blend-multiply" />
                        )}
                      </div>
                      <div>
                        <div className="fw-medium text-dark text-truncate" style={{ maxWidth: '150px', fontSize: '14px' }}>{item.name}</div>
                        <div className="text-muted" style={{ fontSize: '12px' }}>Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="fw-bold" style={{ fontSize: '14px' }}>₹{item.price.toLocaleString('en-IN')}.00</div>
                  </div>
                ))}
                {items.length > 2 && (
                  <div className="text-center text-muted small mt-2">+ {items.length - 2} more items</div>
                )}
              </div>

              <div className="p-3">
                <div className="d-flex justify-content-between mb-3">
                  <span style={{ fontSize: '15px' }}>Price ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                  <span style={{ fontSize: '15px' }}>₹{subtotal.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <span style={{ fontSize: '15px' }}>Delivery Charges</span>
                  <span><span className="text-muted text-decoration-line-through me-1">₹40</span> <span className="text-success fw-medium">Free</span></span>
                </div>
                
                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-dashed">
                  <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>Amount Payable</span>
                  <span className="fw-bold text-dark" style={{ fontSize: '18px' }}>₹{grandTotal.toLocaleString('en-IN')}.00</span>
                </div>
              </div>
              
              <div className="p-3 bg-light border-top d-flex align-items-center gap-2">
                <i className="bi bi-shield-check text-success fs-4"></i>
                <span className="text-muted" style={{ fontSize: '12px', lineHeight: '1.4' }}>Safe and Secure Payments. 100% Authentic products.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
