'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useCartStore from '@/lib/store'

export default function Navbar() {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const cartItems = useCartStore((state) => state.items)
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: '#2874f0', padding: '12px 0', zIndex: 1050 }}>
        <div className="container">
          {/* Brand/Logo */}
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <span className="d-none d-sm-flex align-items-center desktop-logo-wrap">
              <Image src="/images/whitemart.jpg" alt="White Mart" width={140} height={40} style={{ height: '40px', width: 'auto' }} />
            </span>
            <span className="d-flex d-sm-none align-items-center mobile-logo-wrap">
              <Image src="/images/whitemart.jpg" alt="White Mart" width={100} height={30} style={{ height: '30px', width: 'auto' }} />
            </span>
          </Link>

          {/* Mobile Toggle */}
          <button className="navbar-toggler border-0 text-white shadow-none px-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileMenu" aria-controls="mobileMenu">
            <i className="bi bi-list fs-2 text-white"></i>
          </button>

          {/* Desktop Search Bar */}
          <div className="desktop-search d-none d-lg-flex flex-grow-1" style={{ maxWidth: '500px', margin: '0 30px', position: 'relative' }}>
            <form onSubmit={handleSearch} className="d-flex w-100 bg-white rounded">
              <input
                type="search"
                placeholder="Search for products, brands and more"
                aria-label="Search"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: '4px 0 0 4px', border: 'none', padding: '10px 15px', width: '100%', height: '40px', fontSize: '14px', outline: 'none' }}
              />
              <button type="submit" style={{ borderRadius: '0 4px 4px 0', backgroundColor: '#f0c14b', color: '#111111', border: 'none', height: '40px', padding: '0 20px', fontWeight: 'bold', transition: 'background 0.3s' }}>
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          {/* Desktop Right Menu */}
          <div className="d-none d-lg-flex ms-auto align-items-center">
            <ul className="navbar-nav align-items-center flex-row">
              {session ? (
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle text-white fw-bold d-flex align-items-center gap-2" href="#" data-bs-toggle="dropdown">
                    {session.user?.name || session.user?.email}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3" style={{ minWidth: '200px' }}>
                    <li>
                      <div className="px-3 py-2 border-bottom mb-2">
                        <p className="mb-0 fw-bold text-dark">{session.user?.name}</p>
                        <small className="text-muted text-truncate d-block">{session.user?.email}</small>
                      </div>
                    </li>
                    <li>
                      <Link href="/profile" className="dropdown-item py-2 d-flex align-items-center gap-2">
                        <i className="bi bi-person text-primary"></i> My Profile
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin" className="dropdown-item py-2 d-flex align-items-center gap-2">
                        <i className="bi bi-shield-lock text-danger"></i> Admin Panel
                      </Link>
                    </li>
                    <li>
                      <Link href="/orders" className="dropdown-item py-2 d-flex align-items-center gap-2">
                        <i className="bi bi-box-seam text-primary"></i> My Orders
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider my-2" /></li>
                    <li>
                      <button onClick={() => signOut()} className="dropdown-item py-2 d-flex align-items-center gap-2 text-danger border-0 bg-transparent w-100 text-start">
                        <i className="bi bi-power"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <Link href="/login" className="btn btn-light text-primary fw-bold px-4 rounded-1 me-4">
                    Login
                  </Link>
                </li>
              )}

              <li className="nav-item ms-3 d-none d-lg-block">
                <Link href="/" className="nav-link text-white fw-bold" style={{ fontSize: '15px' }}>Home</Link>
              </li>
              <li className="nav-item ms-3 d-none d-lg-block">
                <Link href="/orders" className="nav-link text-white fw-bold" style={{ fontSize: '15px' }}>Orders</Link>
              </li>

              <li className="nav-item ms-3 position-relative">
                <Link href="/cart" className="nav-link text-white fw-bold d-flex align-items-center gap-1" style={{ fontSize: '15px' }}>
                  <div className="position-relative">
                    <i className="bi bi-cart3 fs-5"></i>
                    {cartItemCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '10px', padding: '3px 5px', transform: 'translate(-30%, -20%)' }}>
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  <span className="d-none d-xl-block fw-bold text-white ms-1">Cart</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Subheader for Categories */}
      <div className="bg-white shadow-sm border-bottom d-none d-lg-block">
        <div className="container">
          <ul className="nav py-2" style={{ fontSize: '14px', fontWeight: 500 }}>
            <li className="nav-item">
              <Link href="/search" className="nav-link text-primary">All</Link>
            </li>
            <li className="nav-item">
              <Link href="/search?q=washing machine" className="nav-link text-dark hover-text-primary">washing machine</Link>
            </li>
            <li className="nav-item">
              <Link href="/search?q=Air conditioner" className="nav-link text-dark hover-text-primary">Air conditioner</Link>
            </li>
            <li className="nav-item">
              <Link href="/search?q=Television" className="nav-link text-dark hover-text-primary">Television</Link>
            </li>
            <li className="nav-item">
              <Link href="/search?q=Today offers" className="nav-link text-dark hover-text-primary">Today offers</Link>
            </li>
            <li className="nav-item">
              <Link href="/search?q=Refiregator" className="nav-link text-dark hover-text-primary">Refiregator</Link>
            </li>
            <li className="nav-item">
              <Link href="/search?q=New arrival" className="nav-link text-dark hover-text-primary">New arrival</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Offcanvas Menu */}
      <div className="offcanvas offcanvas-start" tabIndex={-1} id="mobileMenu" aria-labelledby="mobileMenuLabel" style={{ width: '85%', maxWidth: '350px', boxShadow: '2px 0 15px rgba(0,0,0,0.15)' }}>
        <div className="mobile-menu-header" style={{ background: '#2874f0', padding: '25px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {session ? (
            <div className="mobile-menu-user" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div className="mobile-user-avatar" style={{ width: '50px', height: '50px', backgroundColor: '#fff', color: '#2874f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="mobile-menu-user-details">
                <h5 style={{ color: '#fff', margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{session.user?.name}</h5>
                <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '0.85rem' }}>{session.user?.email}</p>
              </div>
            </div>
          ) : (
            <h5 className="offcanvas-title fw-bold text-white" id="mobileMenuLabel">Menu</h5>
          )}
          <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        
        <div className="offcanvas-body p-0 d-flex flex-column mobile-menu-body" style={{ padding: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
          <form className="p-3 border-bottom bg-light" onSubmit={(e) => {
            handleSearch(e);
            const btn = document.querySelector('[data-bs-dismiss="offcanvas"]') as HTMLButtonElement;
            if (btn) btn.click();
          }}>
            <div className="input-group">
              <input type="search" className="form-control border-0 shadow-none" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button className="btn btn-primary" type="submit" style={{ backgroundColor: '#2874f0' }}><i className="bi bi-search"></i></button>
            </div>
          </form>

          <div className="p-0">
            <div className="menu-section-title" style={{ padding: '15px 20px 5px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#878787', letterSpacing: '1px' }}>Navigation</div>
            <Link href="/" className="mobile-menu-item" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', color: '#333', textDecoration: 'none', fontSize: '15px', fontWeight: 500, transition: 'background 0.2s' }}>
              <i className="bi bi-house-door fs-5 text-primary me-3" style={{ width: '24px' }}></i> Home
            </Link>
            <Link href="/cart" className="mobile-menu-item" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', color: '#333', textDecoration: 'none', fontSize: '15px', fontWeight: 500, transition: 'background 0.2s' }}>
              <i className="bi bi-cart3 fs-5 text-warning me-3" style={{ width: '24px' }}></i> Cart
              {cartItemCount > 0 && <span className="badge bg-danger ms-auto rounded-pill">{cartItemCount}</span>}
            </Link>

            {session ? (
              <>
                <div className="menu-section-title mt-2" style={{ padding: '15px 20px 5px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#878787', letterSpacing: '1px' }}>My Account</div>
                <Link href="/profile" className="mobile-menu-item" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', color: '#333', textDecoration: 'none', fontSize: '15px', fontWeight: 500, transition: 'background 0.2s' }}>
                  <i className="bi bi-person fs-5 text-info me-3" style={{ width: '24px' }}></i> Profile
                </Link>
                <Link href="/admin" className="mobile-menu-item" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', color: '#333', textDecoration: 'none', fontSize: '15px', fontWeight: 500, transition: 'background 0.2s' }}>
                  <i className="bi bi-shield-lock fs-5 text-danger me-3" style={{ width: '24px' }}></i> Admin Panel
                </Link>
                <Link href="/orders" className="mobile-menu-item" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', color: '#333', textDecoration: 'none', fontSize: '15px', fontWeight: 500, transition: 'background 0.2s' }}>
                  <i className="bi bi-box-seam fs-5 text-success me-3" style={{ width: '24px' }}></i> Orders
                </Link>
                <button onClick={() => signOut()} className="mobile-menu-item text-danger border-0 bg-transparent w-100 text-start" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', color: '#dc3545', textDecoration: 'none', fontSize: '15px', fontWeight: 500, transition: 'background 0.2s' }}>
                  <i className="bi bi-power fs-5 me-3" style={{ width: '24px' }}></i> Logout
                </button>
              </>
            ) : (
              <div className="mt-4 px-4">
                <Link href="/login" className="btn w-100 py-2 rounded-1 text-white fw-bold" style={{ backgroundColor: '#2874f0' }}>Login / Register</Link>
              </div>
            )}
          </div>
          
          <div className="mt-auto p-4 text-center mt-5">
            <Image src="/images/whitemart.jpg" alt="White Mart" width={120} height={30} className="mb-2 opacity-75 mx-auto" />
            <p className="text-muted small mb-0">&copy; {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  )
}
