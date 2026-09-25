import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <>
      <footer className="footer pt-5 mt-5" style={{ backgroundColor: '#172337', color: '#fff' }}>
        <div className="container pb-4">
          <div className="row g-4">
            {/* Brand & Tagline */}
            <div className="col-lg-4 col-md-6 mb-3 mb-lg-0">
              <div className="footer-logo-wrapper mb-3" style={{ width: '160px' }}>
                <Image src="/images/whitemart.jpg" alt="White Mart" width={160} height={40} style={{ height: '40px', width: 'auto' }} />
              </div>
              <p className="footer-tagline" style={{ color: '#a0b4c2', fontSize: '13px', lineHeight: '1.6' }}>
                Your trusted destination for quality products. Fast delivery, easy returns, and unbeatable prices — all in one place.
              </p>
              <div className="footer-social mt-4 d-flex gap-2">
                <a href="#" className="social-link rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', backgroundColor: '#202f4a', color: '#a0b4c2', transition: 'all 0.3s' }} title="Facebook"><i className="bi bi-facebook"></i></a>
                <a href="#" className="social-link rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', backgroundColor: '#202f4a', color: '#a0b4c2', transition: 'all 0.3s' }} title="Instagram"><i className="bi bi-instagram"></i></a>
                <a href="#" className="social-link rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', backgroundColor: '#202f4a', color: '#a0b4c2', transition: 'all 0.3s' }} title="Twitter"><i className="bi bi-twitter"></i></a>
                <a href="#" className="social-link rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', backgroundColor: '#202f4a', color: '#a0b4c2', transition: 'all 0.3s' }} title="YouTube"><i className="bi bi-youtube"></i></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="footer-heading mb-4" style={{ color: '#f0c14b', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h6>
              <ul className="list-unstyled mb-0" style={{ fontSize: '13px' }}>
                <li className="mb-3"><Link href="/" style={{ color: '#a0b4c2', textDecoration: 'none' }}><i className="bi bi-chevron-right me-2" style={{ fontSize: '10px', color: '#2874f0' }}></i>All Products</Link></li>
                <li className="mb-3"><Link href="/cart" style={{ color: '#a0b4c2', textDecoration: 'none' }}><i className="bi bi-chevron-right me-2" style={{ fontSize: '10px', color: '#2874f0' }}></i>My Cart</Link></li>
                <li className="mb-3"><Link href="/orders" style={{ color: '#a0b4c2', textDecoration: 'none' }}><i className="bi bi-chevron-right me-2" style={{ fontSize: '10px', color: '#2874f0' }}></i>My Orders</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="footer-heading mb-4" style={{ color: '#f0c14b', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Care</h6>
              <ul className="list-unstyled mb-0" style={{ fontSize: '13px' }}>
                <li className="mb-3"><a href="#" style={{ color: '#a0b4c2', textDecoration: 'none' }}><i className="bi bi-chevron-right me-2" style={{ fontSize: '10px', color: '#2874f0' }}></i>Help Center</a></li>
                <li className="mb-3"><a href="#" style={{ color: '#a0b4c2', textDecoration: 'none' }}><i className="bi bi-chevron-right me-2" style={{ fontSize: '10px', color: '#2874f0' }}></i>Returns & Refunds</a></li>
                <li className="mb-3"><a href="#" style={{ color: '#a0b4c2', textDecoration: 'none' }}><i className="bi bi-chevron-right me-2" style={{ fontSize: '10px', color: '#2874f0' }}></i>Track Order</a></li>
                <li className="mb-3"><a href="#" style={{ color: '#a0b4c2', textDecoration: 'none' }}><i className="bi bi-chevron-right me-2" style={{ fontSize: '10px', color: '#2874f0' }}></i>Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-4 col-md-6">
              <h6 className="footer-heading mb-4" style={{ color: '#f0c14b', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Us</h6>
              <div className="footer-contact-item mb-3 d-flex" style={{ fontSize: '13px', color: '#a0b4c2' }}>
                <i className="bi bi-geo-alt-fill me-3 mt-1" style={{ color: '#2874f0', fontSize: '14px' }}></i>
                <span>Landmark Store, Main Bazaar Road,<br />Malappuram, Kerala — 676501</span>
              </div>
              <div className="footer-contact-item mb-3 d-flex align-items-center" style={{ fontSize: '13px', color: '#a0b4c2' }}>
                <i className="bi bi-telephone-fill me-3" style={{ color: '#2874f0', fontSize: '14px' }}></i>
                <a href="tel:+918129418544" style={{ color: '#a0b4c2', textDecoration: 'none' }}>+91 81294 18544</a>
              </div>
              <div className="footer-contact-item mb-3 d-flex align-items-center" style={{ fontSize: '13px', color: '#a0b4c2' }}>
                <i className="bi bi-envelope-fill me-3" style={{ color: '#2874f0', fontSize: '14px' }}></i>
                <a href="mailto:jubujubair752@gmail.com" style={{ color: '#a0b4c2', textDecoration: 'none' }}>jubujubair752@gmail.com</a>
              </div>
              <div className="footer-contact-item mb-3 d-flex align-items-center" style={{ fontSize: '13px', color: '#a0b4c2' }}>
                <i className="bi bi-clock-fill me-3" style={{ color: '#2874f0', fontSize: '14px' }}></i>
                <span>Mon – Sat: 9:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom py-3" style={{ backgroundColor: '#111a2c', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container d-flex flex-wrap justify-content-between align-items-center" style={{ fontSize: '12px', color: '#a0b4c2' }}>
            <span>&copy; {new Date().getFullYear()} <strong className="text-white">Landmark Store</strong>. All rights reserved.</span>
            <div className="d-flex gap-4 mt-2 mt-md-0">
              <a href="javascript:void(0)" style={{ color: '#a0b4c2', textDecoration: 'none' }}>Terms of Use</a>
              <a href="javascript:void(0)" style={{ color: '#a0b4c2', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="javascript:void(0)" style={{ color: '#a0b4c2', textDecoration: 'none' }}>Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/918129418544" className="whatsapp-float position-fixed bottom-0 end-0 m-4 shadow-lg d-flex align-items-center justify-content-center" target="_blank" title="Chat with us on WhatsApp" style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '50%', width: '60px', height: '60px', textDecoration: 'none', zIndex: 1000, transition: 'transform 0.3s' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
        </svg>
      </a>
      <style>{`
        .whatsapp-float:hover {
          transform: scale(1.1);
        }
      `}</style>
    </>
  )
}
