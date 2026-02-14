"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/firebase'
import { getUserLocationFromIP } from '@/lib/analytics'
import CustomerDataForm from '@/components/CustomerDataForm'

export default function VerifyContent() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const source = searchParams.get('source') || 'UNKNOWN'
    const product = searchParams.get('product') || 'UNKNOWN'

    const trackScanEvent = async () => {
      try {
        // Get or create sessionId (same logic as PageTracker)
        let sessionId = ''
        if (typeof window !== 'undefined') {
          sessionId = localStorage.getItem('sessionId') || uuidv4()
          localStorage.setItem('sessionId', sessionId)
          
          // Store source in sessionStorage for PageTracker to pick up
          if (source !== 'UNKNOWN') {
            sessionStorage.setItem('trafficSource', source)
          }
        }

        const { city = 'UNKNOWN', state = 'UNKNOWN', country = 'UNKNOWN' } =
          (await getUserLocationFromIP()) || {}

        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
        const isMobile = /Mobile|Android|iPhone/i.test(userAgent)
        const deviceType = isMobile ? 'mobile' : 'desktop'
        const referrer = typeof document !== 'undefined' ? document.referrer : ''

        const scanEventsRef = collection(db, 'scan_events')

        await addDoc(scanEventsRef, {
          sessionId,  // Now linked to page_views!
          source,
          product,
          city,
          state,
          country,
          deviceType,
          userAgent,
          referrer,
          timestamp: serverTimestamp(),
        })
      } catch (error) {
        // Swallow errors to keep tracking silent for the user
        console.error('Failed to log scan event', error)
      }
    }

    // Fire and forget tracking; do not block rendering
    trackScanEvent()
  }, [])

  // Only render after hydration to avoid mismatch
  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        {/* Top accent bar */}
        <div className="h-2 bg-orange-600" />

        <div className="p-8 flex flex-col items-center text-center">
          {/* Logo */}
          <Image src="/images/logo-aa.png" alt="Aadinath Industries" width={64} height={64} className="mb-4" />

          {/* Verified Badge */}
          <Image src="/images/verified-badge.png" alt="Verified" width={72} height={72} className="mb-4" />

          {/* Verified Text */}
          <h1 className="text-2xl font-bold text-gray-800">Verified Steel Product</h1>
          <h2 className="text-lg font-semibold text-orange-600 mt-1">Aadinath Industries</h2>

          <div className="w-16 h-0.5 bg-orange-200 my-5" />

          <p className="text-gray-600 leading-relaxed">
            This product has been <strong>digitally verified</strong> by the manufacturer.
          </p>
          <p className="text-gray-600 mt-2">
            You are viewing a verified <strong>MS Angle Bar</strong> manufactured by Aadinath Industries.
          </p>

          <div className="w-16 h-0.5 bg-gray-200 my-5" />

          {/* Quality Checks */}
          <div className="w-full bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-3 text-left">Each product is produced under controlled rolling conditions to ensure:</p>
            <ul className="flex flex-col gap-2">
              {[
                'Accurate dimensions & weight',
                'Controlled weight tolerance',
                'Straightness and surface quality',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-600 font-bold">✔</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {['Weight Verified', 'Straightness Verified', 'Tolerances Controlled'].map((badge) => (
              <span key={badge} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <span>✔</span> {badge}
              </span>
            ))}
          </div>

          <div className="w-full h-px bg-gray-200 my-4" />

          {/* Manufacturer Info */}
          <div className="w-full text-left bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600"><span className="font-semibold">Manufacturer:</span> Aadinath Industries</p>
            <p className="text-sm text-gray-600 mt-1"><span className="font-semibold">📍</span> Sihor, Bhavnagar, Gujarat</p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">📞</span>{' '}
              <a href="tel:+919825207616" className="text-orange-600 hover:underline">+91-9825207616</a>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold">🌐</span>{' '}
              <a href="https://aadinathindustries.in" className="text-orange-600 hover:underline" target="_blank" rel="noopener noreferrer">aadinathindustries.in</a>
            </p>
          </div>

          {/* Customer Data Form */}
          <div className="w-full mb-6">
            <CustomerDataForm />
          </div>

          {/* Feedback CTA */}
          <div className="w-full border border-green-200 bg-green-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-3">
              For bulk supply, dealership, export enquiries, or feedback, please contact us directly.
            </p>
            <a
              href="https://wa.me/919825207616"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-block text-center bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
