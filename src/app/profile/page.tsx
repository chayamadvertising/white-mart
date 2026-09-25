'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState({ name: '', phone: '', address: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((user) => {
          setData({
            name: user.name || '',
            phone: user.profile?.phone || '',
            address: user.profile?.address || '',
          })
          setLoading(false)
        })
    }
  }, [status, router])

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast.success('Profile updated successfully')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>

  return (
    <div className="row mt-4">
      <div className="col-md-8 mx-auto">
        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
            <h4 className="card-title fw-bold text-primary mb-0">My Profile</h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={updateProfile}>
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
                <label className="form-label text-muted fw-medium">Email</label>
                <input
                  type="email"
                  className="form-control p-2 bg-light border-0 text-muted"
                  value={session?.user?.email || ''}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted fw-medium">Phone</label>
                <input
                  type="tel"
                  className="form-control p-2 bg-light border-0"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted fw-medium">Address</label>
                <textarea
                  className="form-control p-2 bg-light border-0"
                  rows={3}
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary px-4 py-2 fw-bold">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
