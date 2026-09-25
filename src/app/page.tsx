import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import Image from 'next/image'

export const revalidate = 0 

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { available: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container py-4">
      {/* Hero Carousel */}
      <div id="heroCarousel" className="carousel slide hero-carousel mb-5" data-bs-ride="carousel" data-bs-interval="3000">
          <div className="carousel-indicators">
              <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
              <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
              <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="4" aria-label="Slide 5"></button>
          </div>
          <div className="carousel-inner shadow-sm rounded-4 overflow-hidden">
              <div className="carousel-item active">
                  <Image src="/images/ccc.jpg" width={1200} height={600} className="d-block w-100 h-auto" style={{ objectFit: 'contain' }} alt="Special Offer" priority />
              </div>
              <div className="carousel-item">
                  <Image src="/images/aaa.jpg" width={1200} height={600} className="d-block w-100 h-auto" style={{ objectFit: 'contain' }} alt="New Arrivals" priority />
              </div>
              <div className="carousel-item">
                  <Image src="/images/bbb.jpg" width={1200} height={600} className="d-block w-100 h-auto" style={{ objectFit: 'contain' }} alt="Mega Sale" priority />
              </div>
              <div className="carousel-item">
                  <Image src="/images/ddd.png" width={1200} height={600} className="d-block w-100 h-auto" style={{ objectFit: 'contain' }} alt="Home Appliances" priority />
              </div>
              <div className="carousel-item">
                  <Image src="/images/eee.jpg" width={1200} height={600} className="d-block w-100 h-auto" style={{ objectFit: 'contain' }} alt="Exclusive Discounts" priority />
              </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
              <span className="carousel-control-icon bg-dark bg-opacity-50 rounded-circle p-3 d-flex justify-content-center align-items-center" aria-hidden="true">
                  <i className="bi bi-chevron-left text-white fs-4"></i>
              </span>
              <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
              <span className="carousel-control-icon bg-dark bg-opacity-50 rounded-circle p-3 d-flex justify-content-center align-items-center" aria-hidden="true">
                  <i className="bi bi-chevron-right text-white fs-4"></i>
              </span>
              <span className="visually-hidden">Next</span>
          </button>
      </div>

      {/* Promotional Section (Video & Brand) */}
      <section className="store-promo-section mb-5 animate-fade-in-up">
          <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                  <div className="video-card shadow-sm rounded-4 overflow-hidden position-relative">
                      <video controls autoPlay muted playsInline className="w-100 object-fit-cover" style={{ height: 'auto', maxHeight: '350px', width: '100%', aspectRatio: '16/9' }}>
                          <source src="/images/5.mp4" type="video/mp4" />
                          Your browser does not support the video tag.
                      </video>
                  </div>
              </div>
              <div className="col-lg-6">
                  <div className="promo-content p-lg-4 p-3 bg-white rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center animate-slide-in-right">
                      <h2 className="fw-bold mb-3 text-primary">White Mart Exclusives</h2>
                      <p className="text-muted fs-6 mb-4 lh-lg">
                          For over 20 years, White Mart has been a trusted name in home appliances, delivering quality, innovation, and convenience to households across Kerala. With 150+ showrooms, we have redefined the shopping experience by offering a seamless blend of top brands, competitive pricing, and exceptional service. From refrigerators to washing machines, LED TVs to ACs, we bring you the latest technology under one roof.
                      </p>
                      <div className="d-flex align-items-center gap-3 mt-auto">
                          <div className="d-flex align-items-center gap-2">
                              <i className="bi bi-shield-check text-success fs-4"></i>
                              <span className="fw-medium">Trusted Brands</span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                              <i className="bi bi-truck text-primary fs-4"></i>
                              <span className="fw-medium">Fast Delivery</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Trending Deals Carousel */}
      <section className="trending-section mb-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0"><i className="bi bi-fire text-danger me-2"></i>Trending Deals</h3>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div id="trendingCarousel" className="carousel slide shadow-sm rounded-4 overflow-hidden" data-bs-ride="carousel" data-bs-interval="4000">
                  <div className="carousel-inner" style={{ backgroundColor: '#fff' }}>
                      <div className="carousel-item active position-relative text-center">
                          <Image src="/images/100.jpg" width={1200} height={400} alt="Trending 1" className="img-fluid w-100 h-auto" />
                          <div className="position-absolute top-0 end-0 m-3 z-1">
                              <span className="badge bg-danger rounded-pill px-3 py-2 fs-6 shadow">-20%</span>
                          </div>
                      </div>
                      <div className="carousel-item position-relative text-center">
                          <Image src="/images/101.jpg" width={1200} height={400} alt="Trending 2" className="img-fluid w-100 h-auto" />
                          <div className="position-absolute top-0 end-0 m-3 z-1">
                              <span className="badge bg-danger rounded-pill px-3 py-2 fs-6 shadow">Hot</span>
                          </div>
                      </div>
                      <div className="carousel-item position-relative text-center">
                          <Image src="/images/102.jpg" width={1200} height={400} alt="Trending 3" className="img-fluid w-100 h-auto" />
                          <div className="position-absolute top-0 end-0 m-3 z-1">
                              <span className="badge bg-danger rounded-pill px-3 py-2 fs-6 shadow">Save Big</span>
                          </div>
                      </div>
                      <div className="carousel-item position-relative text-center">
                          <Image src="/images/103.jpg" width={1200} height={400} alt="Trending 4" className="img-fluid w-100 h-auto" />
                          <div className="position-absolute top-0 end-0 m-3 z-1">
                              <span className="badge bg-danger rounded-pill px-3 py-2 fs-6 shadow">-15%</span>
                          </div>
                      </div>
                  </div>
                  
                  <button className="carousel-control-prev" type="button" data-bs-target="#trendingCarousel" data-bs-slide="prev">
                      <span className="carousel-control-icon bg-dark bg-opacity-50 rounded-circle p-3 d-flex justify-content-center align-items-center" aria-hidden="true">
                          <i className="bi bi-chevron-left text-white fs-4"></i>
                      </span>
                      <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#trendingCarousel" data-bs-slide="next">
                      <span className="carousel-control-icon bg-dark bg-opacity-50 rounded-circle p-3 d-flex justify-content-center align-items-center" aria-hidden="true">
                          <i className="bi bi-chevron-right text-white fs-4"></i>
                      </span>
                      <span className="visually-hidden">Next</span>
                  </button>
              </div>
            </div>
          </div>
      </section>

      {/* Featured Products */}
      <section className="latest-products animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0"><i className="bi bi-stars text-primary me-2"></i>Featured Products</h3>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No products available at the moment.</p>
            </div>
          ) : (
            <div className="row g-2 g-md-4">
              {products.map((product) => (
                <div className="col-6 col-md-4 col-xl-3 product-wrapper" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
      </section>
    </div>
  )
}
