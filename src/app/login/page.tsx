'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function Login() {
  const router = useRouter()
  const [data, setData] = useState({ email: '', password: '' })

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault()
    const callback = await signIn('credentials', {
      ...data,
      redirect: false,
    })

    if (callback?.error) {
      toast.error(callback.error)
    }

    if (callback?.ok && !callback?.error) {
      toast.success('Logged in successfully!')
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body p-4">
            <h3 className="text-center mb-4 fw-bold text-primary">Login</h3>
            <form onSubmit={loginUser}>
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
                Login
              </button>
            </form>
            <div className="text-center">
              <span className="text-muted">Don't have an account? </span>
              <Link href="/signup" className="text-decoration-none fw-bold text-primary">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
