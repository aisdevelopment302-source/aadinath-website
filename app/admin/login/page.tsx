'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin, loginWithGoogle } from '@/lib/firebase-admin'
import Image from 'next/image'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginAdmin(email, password)
      // Redirect to analytics dashboard on success
      router.push('/admin/analytics')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setGoogleLoading(true)

    try {
      await loginWithGoogle()
      router.push('/admin/analytics')
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src="/images/logo-aa.png" alt="Aadinath Industries" width={80} height={80} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 text-center mb-8">Sign in to access analytics</p>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              disabled={loading || googleLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              disabled={loading || googleLoading}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-2.5 rounded-lg transition-colors duration-200 mt-6"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200" />
          <span className="mx-4 text-sm text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors duration-200"
        >
          {googleLoading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          {googleLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {/* Footer */}
        <p className="text-gray-600 text-xs text-center mt-6">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  )
}
