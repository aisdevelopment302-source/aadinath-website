'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthChange } from '@/lib/firebase-admin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setIsAuthenticated(true)
        setIsLoading(false)
      } else {
        setIsAuthenticated(false)
        setIsLoading(false)
        // Redirect to login if not on login page
        if (!pathname.includes('/admin/login')) {
          router.push('/admin/login')
        }
      }
    })

    return () => unsubscribe()
  }, [router, pathname])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page or protected content
  if (!isAuthenticated && !pathname.includes('/admin/login')) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
