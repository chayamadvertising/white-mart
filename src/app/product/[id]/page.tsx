import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from './AddToCartButton'
import BuyNowButton from './BuyNowButton'

export const revalidate = 0

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className="container py-4 page-animate">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb" style={{ fontSize: '13px' }}>
          <li className="breadcrumb-item"><Link href="/" className="text-decoration-none text-muted">Home</Link></li>
          <li className="breadcrumb-item"><Link href={`/category/${product.categoryId}`} className="text-decoration-none text-muted">{product.category.name}</Link></li>
          <li className="breadcrumb-item active text-dark fw-medium text-capitalize" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="row g-0">
          {/* Left Column - Image & Buttons */}
          <div className="col-lg-5 p-4 border-end">
            <div className="position-relative bg-light rounded-3 d-flex align-items-center justify-content-center p-4 mb-4" style={{ height: '400px' }}>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 rounded-1 shadow-sm px-2 py-1" style={{ fontSize: '12px' }}>Low Stock</span>
              )}
              {product.image ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image 
                    src={product.image.startsWith('/') ? product.image : `/products/${product.image}`} 
                    alt={product.name} 
                    fill 
                    className="object-fit-contain mix-blend-multiply" 
                  />
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image src="/images/placeholder.png" alt="Placeholder" fill className="object-fit-contain" />
                </div>
              )}
            </div>

            <div className="d-flex gap-2">
              <div className="flex-fill">
                <AddToCartButton product={product} />
              </div>
              <div className="flex-fill">
                <BuyNowButton product={product} />
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="col-lg-7 p-4 p-lg-5">
            <h3 className="fw-bold mb-2 text-dark text-capitalize">{product.name}</h3>
            
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge bg-success rounded-1 d-flex align-items-center gap-1 px-2 py-1">
                4.5 <i className="bi bi-star-fill" style={{ fontSize: '10px' }}></i>
              </span>
              <span className="text-muted" style={{ fontSize: '14px', fontWeight: 500 }}>
                8,432 Ratings & 941 Reviews
              </span>
            </div>

            <div className="mb-4">
              <div className="text-success fw-bold small mb-1">Extra discount applied</div>
              <div className="d-flex align-items-end gap-3">
                <h1 className="fw-bold text-dark m-0">₹{product.price.toLocaleString('en-IN')}.00</h1>
              </div>
            </div>

            {/* Offers */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3" style={{ fontSize: '15px' }}>Available Offers</h6>
              <ul className="list-unstyled d-flex flex-column gap-2" style={{ fontSize: '14px' }}>
                <li className="d-flex align-items-start gap-2">
                  <i className="bi bi-tag-fill text-success mt-1"></i>
                  <span><span className="fw-medium">Bank Offer:</span> 5% Unlimited Cashback on Axis Bank Credit Card <a href="#" className="text-primary text-decoration-none">T&C</a></span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <i className="bi bi-tag-fill text-success mt-1"></i>
                  <span><span className="fw-medium">Special Price:</span> Get extra 10% off (price inclusive of cashback/coupon) <a href="#" className="text-primary text-decoration-none">T&C</a></span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <i className="bi bi-calendar-check-fill text-primary mt-1"></i>
                  <span><span className="fw-medium">EMI starting</span> from ₹349/month. <a href="#" className="text-primary text-decoration-none">View Plans</a></span>
                </li>
              </ul>
            </div>

            {/* Delivery & Highlights */}
            <div className="row mb-4 pt-3 border-top g-4" style={{ fontSize: '14px' }}>
              <div className="col-md-6 d-flex">
                <div className="text-muted" style={{ width: '80px', fontWeight: 500 }}>Delivery</div>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className="bi bi-geo-alt-fill text-primary"></i>
                    <span className="fw-medium">Delivery normally in 3-5 days</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted" style={{ width: '16px' }}></span>
                    <span className="fw-medium">7 Days Replacement Policy</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 d-flex">
                <div className="text-muted" style={{ width: '80px', fontWeight: 500 }}>Highlights</div>
                <div>
                  <ul className="mb-0 ps-3">
                    <li className="mb-1 fw-medium">Premium Build Quality</li>
                    <li className="mb-1 fw-medium">1 Year Brand Warranty</li>
                    <li className="mb-1 fw-medium">100% Genuine Product</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="d-flex align-items-center gap-4 mb-5 pt-3 border-top">
              <div className="text-muted" style={{ fontWeight: 500 }}>Quantity</div>
              <div className="d-flex align-items-center gap-3">
                <div className="input-group" style={{ width: '120px' }}>
                  <button className="btn btn-outline-secondary rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>-</button>
                  <input type="text" className="form-control text-center border-0 bg-transparent fw-bold" value="1" readOnly />
                  <button className="btn btn-outline-secondary rounded-circle d-flex justify-content-center align-items-center" style={{ width: '32px', height: '32px' }}>+</button>
                </div>
                {product.stock <= 5 && (
                  <div className="d-flex align-items-center gap-1 fw-bold">
                    <i className="bi bi-exclamation-circle-fill"></i> Only {product.stock} left!
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-top">
              <h5 className="fw-bold mb-4 d-inline-block position-relative pb-2" style={{ borderBottom: '3px solid #2874f0' }}>Product Description</h5>
              <div className="text-muted lh-lg" style={{ fontSize: '15px' }}>
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
