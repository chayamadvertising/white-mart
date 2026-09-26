'use client'

import Image from 'next/image'
import Link from 'next/link'
import useCartStore from '@/lib/store'
import toast from 'react-hot-toast'

type Product = {
  id: string
  name: string
  price: number
  image: string | null
  stock: number
  available: boolean
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault()
    if (!product.available || product.stock <= 0) return
    
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
  }

  // Assuming a static discount for display purposes as per the old template
  const hasDiscount = true;
  const discountPrice = Math.round(product.price * 0.9); // 10% off

  return (
    <div className="card h-100 product-card border-0 bg-white rounded-4 shadow-hover transition-all position-relative">
      
      {/* Badges */}
      <div className="position-absolute top-0 start-0 p-3 z-2 d-flex flex-column gap-1">
          {hasDiscount && (
            <span className="badge bg-danger rounded-pill fw-medium shadow-sm py-1 px-2">Sale</span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="badge bg-warning text-dark rounded-pill fw-medium shadow-sm py-1 px-2">Low Stock</span>
          )}
      </div>

      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="text-decoration-none product-img-wrap overflow-hidden rounded-top-4 position-relative pt-3 px-3 d-block bg-white text-center">
          <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
            {product.image ? (
              <Image 
                src={product.image.startsWith('/') ? product.image : `/products/${product.image}`} 
                alt={product.name} 
                fill 
                className="card-img-top object-fit-contain mix-blend-multiply transition-transform responsive-product-img" 
              />
            ) : (
              <Image 
                src="/images/placeholder.png" 
                alt="Placeholder" 
                fill 
                className="card-img-top object-fit-contain mix-blend-multiply transition-transform responsive-product-img" 
              />
            )}
          </div>
          {/* Quick view hover overlay */}
          <div className="quick-view-overlay position-absolute bottom-0 start-0 w-100 pb-3 d-flex justify-content-center opacity-0 transition-opacity">
              <span className="btn btn-light btn-sm rounded-pill shadow fw-medium px-3 text-primary"><i className="bi bi-eye me-1"></i> Quick View</span>
          </div>
      </Link>

      {/* Card Body */}
      <div className="card-body d-flex flex-column p-3 p-lg-4">
          {/* Title */}
          <h6 className="card-title fw-bold mb-2">
              <Link href={`/product/${product.id}`} className="text-decoration-none text-dark product-title-link line-clamp-2 text-capitalize" title={product.name}>
                  {product.name}
              </Link>
          </h6>
          
          {/* Rating placeholder */}
          <div className="d-flex align-items-center mb-2 gap-1 text-warning small">
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-fill"></i>
              <i className="bi bi-star-half"></i>
              <span className="text-muted ms-1">(4.5)</span>
          </div>

          {/* Price */}
          <div className="price-wrap mb-3 mt-auto">
              {hasDiscount ? (
              <div className="d-flex align-items-center flex-wrap gap-2">
                  <span className="fw-bold fs-5 text-dark">₹{discountPrice.toLocaleString('en-IN')}</span>
                  <span className="text-muted text-decoration-line-through small">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="text-success fw-bold small ms-auto">Save Big</span>
              </div>
              ) : (
              <span className="fw-bold fs-5 text-dark">₹{product.price.toLocaleString('en-IN')}</span>
              )}
          </div>

          {/* Availability indicator (Amazon style) */}
          <div className="mb-3 small fw-medium text-success d-flex align-items-center gap-1">
              {product.stock > 5 ? (
                <><i className="bi bi-check-circle-fill"></i> In Stock</>
              ) : product.stock > 0 ? (
                <><i className="bi bi-exclamation-circle-fill text-warning"></i> <span className="text-warning">Only {product.stock} left</span></>
              ) : (
                <><i className="bi bi-x-circle-fill text-danger"></i> <span className="text-danger">Out of Stock</span></>
              )}
          </div>

          {/* CTA */}
          <form onSubmit={handleAddToCart} className="mt-auto">
              <button 
                type="submit" 
                className="btn btn-warning w-100 rounded-pill fw-bold border-0 shadow-sm btn-add-cart transition-all" 
                disabled={!product.available || product.stock <= 0}
              >
                  {product.available && product.stock > 0 ? (
                    <><i className="bi bi-cart-plus me-1"></i> Add to Cart</>
                  ) : (
                    'Unavailable'
                  )}
              </button>
          </form>
      </div>
    </div>
  )
}
