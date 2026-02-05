'use client'

import { useEffect, useState } from 'react'
import { collection, query, getDocs, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Image from 'next/image'
import Link from 'next/link'

interface CustomerData {
  id: string
  name?: string
  email?: string
  phone?: string
  city?: string
  state?: string
  country?: string
  useCase?: string
  quantityNeeded?: string
  submittedAt: Date
}

interface ScanEvent {
  id: string
  userLocation?: string
  timestamp: Date
  pageUrl?: string
}

interface Metrics {
  totalCustomers: number
  totalScans: number
  weekCustomers: number
  weekScans: number
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>({
    totalCustomers: 0,
    totalScans: 0,
    weekCustomers: 0,
    weekScans: 0,
  })
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [scans, setScans] = useState<ScanEvent[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [loadingData, setLoadingData] = useState(false)

  const ADMIN_PASSWORD = 'aadinath2026'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setPassword('')
      await loadData()
    } else {
      alert('Invalid password')
    }
  }

  const loadData = async () => {
    setLoadingData(true)
    try {
      // Load customer data
      const customerQuery = query(collection(db, 'customer_data'), orderBy('submittedAt', 'desc'))
      const customerDocs = await getDocs(customerQuery)
      const customerList: CustomerData[] = customerDocs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
        submittedAt: doc.data().submittedAt?.toDate() || new Date(),
      }))

      // Load scan events
      const scanQuery = query(collection(db, 'scan_events'), orderBy('timestamp', 'desc'))
      const scanDocs = await getDocs(scanQuery)
      const scanList: ScanEvent[] = scanDocs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }))

      setCustomers(customerList)
      setScans(scanList)

      // Calculate metrics
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const weekCustomers = customerList.filter((c) => c.submittedAt >= weekAgo).length
      const weekScans = scanList.filter((s) => s.timestamp >= weekAgo).length

      setMetrics({
        totalCustomers: customerList.length,
        totalScans: scanList.length,
        weekCustomers,
        weekScans,
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'City', 'State', 'Use Case', 'Quantity', 'Date']
    const rows = customers.map((c) => [
      c.name || '',
      c.phone || '',
      c.email || '',
      c.city || '',
      c.state || '',
      c.useCase || '',
      c.quantityNeeded || '',
      c.submittedAt.toLocaleString(),
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customer-data-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const filteredCustomers = customers
    .filter((c) => {
      const matchesSearch =
        !searchTerm ||
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
      const matchesDate =
        dateFilter === 'all' ||
        (dateFilter === 'week' && c.submittedAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === 'month' && c.submittedAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      return matchesSearch && matchesDate
    })

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <Image src="/images/logo-aa.png" alt="AA" width={64} height={64} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Admin Dashboard</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Login
            </button>
          </form>
          <Link href="/" className="block text-center text-orange-600 hover:underline text-sm mt-4">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/logo-aa.png" alt="AA" width={40} height={40} />
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-orange-600">{metrics.totalCustomers}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">Total Scans</p>
            <p className="text-3xl font-bold text-orange-600">{metrics.totalScans}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">This Week (Customers)</p>
            <p className="text-3xl font-bold text-blue-600">{metrics.weekCustomers}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-semibold mb-2">This Week (Scans)</p>
            <p className="text-3xl font-bold text-blue-600">{metrics.weekScans}</p>
          </div>
        </div>

        {/* Customer Data Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Customer Data</h2>
            <button
              onClick={exportCSV}
              disabled={customers.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              📥 Export CSV
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {loadingData ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : filteredCustomers.length === 0 ? (
            <p className="text-center text-gray-600">No customer data found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Phone</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">City</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Use Case</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Quantity</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="px-4 py-3">{customer.name || '—'}</td>
                      <td className="px-4 py-3">
                        {customer.phone ? (
                          <a
                            href={`https://wa.me/${customer.phone.replace(/[^\d]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline"
                          >
                            {customer.phone}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3">{customer.email || '—'}</td>
                      <td className="px-4 py-3">{customer.city || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                          {customer.useCase || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{customer.quantityNeeded || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{customer.submittedAt.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Scan Events Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Verification Scans</h2>

          {loadingData ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : scans.length === 0 ? (
            <p className="text-center text-gray-600">No scan events found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Location</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Timestamp</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Page</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.slice(0, 50).map((scan) => (
                    <tr key={scan.id} className="border-b border-gray-100 hover:bg-blue-50">
                      <td className="px-4 py-3">{scan.userLocation || 'Unknown'}</td>
                      <td className="px-4 py-3 text-gray-600">{scan.timestamp.toLocaleString()}</td>
                      <td className="px-4 py-3">{scan.pageUrl || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {scans.length > 50 && <p className="text-xs text-gray-500 mt-2">Showing first 50 scans</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
