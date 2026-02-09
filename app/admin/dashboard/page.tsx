'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, logoutAdmin } from '@/lib/firebase-admin'
import Image from 'next/image'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setIsLoading(false)
  }, [])

  const handleLogout = async () => {
    try {
      await logoutAdmin()
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/logo-aa.png" alt="Aadinath Industries" width={48} height={48} />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Analytics & Insights</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.email}</p>
              <p className="text-xs text-gray-600">Authenticated</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="inline-block p-4 bg-orange-100 rounded-full">
              <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Analytics Dashboard</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            This admin dashboard will show real-time analytics, customer leads, geographic data, and QR verification insights.
          </p>
          <div className="inline-block bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800 font-medium">
              🚀 Dashboard features coming soon (Feb 10-23)
            </p>
          </div>
        </div>

        {/* Placeholder Sections */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-gray-500 font-medium">📊 Page Analytics</p>
              <p className="text-xs text-gray-400 mt-1">Track visits per page</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-gray-500 font-medium">🌍 Geographic Data</p>
              <p className="text-xs text-gray-400 mt-1">Heatmap by country/city</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-gray-500 font-medium">✅ Verify Page Deep-Dive</p>
              <p className="text-xs text-gray-400 mt-1">QR scan analytics</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-gray-500 font-medium">💼 Lead Management</p>
              <p className="text-xs text-gray-400 mt-1">Customer submissions & export</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
