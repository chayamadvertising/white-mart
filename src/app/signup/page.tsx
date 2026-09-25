'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function Register() {
  const router = useRouter()
  const [data, setData] = useState({ name: '', email: '', password: '' })

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const userInfo = await response.json()
      if (response.ok) {
        toast.success('Account created! Please login.')
        router.push('/login')
      } else {
        toast.error(userInfo.message || 'Something went wrong')
      }
    } catch (error) {
      toast.error('Registration failed')
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body p-4">
            <h3 className="text-center mb-4 fw-bold text-primary">Register</h3>
            <form onSubmit={registerUser}>
              <div className="mb-3">
                <label className="form-label text-muted fw-medium">Full Name</label>
                <input
                  type="text"
                  className="form-control p-2 bg-light border-0"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted fw-medium">Email address</label>
                <input
                  type="email"
                  className="form-control p-2 bg-light border-0"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted fw-medium">Password</label>
                <input
                  type="password"
                  className="form-control p-2 bg-light border-0"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3">
                Register
              </button>
            </form>
            <div className="text-center">
              <span className="text-muted">Already have an account? </span>
              <Link href="/login" className="text-decoration-none fw-bold text-primary">
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
