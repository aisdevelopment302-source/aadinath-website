"use client"

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  getTrafficSource,
  rememberTrafficSource,
  trackScan,
  trackScanAnswer,
  trackScanLocation,
  trackWhatsAppClick,
  type ScanQuestion,
} from '@/lib/analytics'
import CustomerDataForm from '@/components/CustomerDataForm'
import ScanQuestions, { ISSUES, labelOf, type ScanAnswers } from '@/components/ScanQuestions'

const WHATSAPP_NUMBER = '919825207616'

export default function VerifyContent() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [locationHelp, setLocationHelp] = useState<LocationHelp | null>(null)
  const askAgain = useRef<() => void>(() => {})
  const [scanned, setScanned] = useState(false)
  const scanId = useRef<Promise<string | null>>(Promise.resolve(null))
  const [answers, setAnswers] = useState<ScanAnswers>({})

  useEffect(() => {
    setMounted(true)

    const source = searchParams.get('source') || ''
    const product = searchParams.get('product') || ''

    // Only a visit from a printed code (it carries ?source=) is a scan. A plain
    // /verify visit is still recorded as a page view by the page tracker.
    // Store the source for the page tracker, log the scan (approximate location
    // and device are added on the server), then ask the phone where it is.
    if (source) {
      rememberTrafficSource(source)
      setScanned(true)
      scanId.current = trackScan({ source, product, referrer: document.referrer })
      scanId.current.then((id) => {
        if (id) askAgain.current = locateScan(id, setLocationHelp)
      })
    }
  }, [])

  // Answers are shown at once and sent when the scan's id arrives.
  const onAnswer = (question: ScanQuestion, answer: string) => {
    setAnswers((prev) => ({ ...prev, [question]: answer }))
    scanId.current.then((id) => {
      if (id) trackScanAnswer(id, question, answer)
    })
  }

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
          <p className="text-xs text-gray-400 mt-3">
            We ask for your location only to learn where our steel reaches. It is never shared. Allowing it
            is optional.
          </p>
          {locationHelp === 'ask' && (
            <button
              type="button"
              onClick={() => askAgain.current()}
              className="mt-3 text-sm font-semibold text-orange-600 border border-orange-300 rounded-lg px-4 py-2 hover:bg-orange-50"
            >
              📍 Share my location
            </button>
          )}
          {locationHelp === 'blocked' && (
            <p className="text-xs text-gray-500 mt-3">
              Your browser has blocked location for this website. To allow it, tap the icon left of the web
              address, then Permissions → Location → Allow, and reload. If a scanner app opened this page,
              open it in Chrome instead.
            </p>
          )}

          <div className="w-16 h-0.5 bg-gray-200 my-5" />

          {scanned && <ScanQuestions answers={answers} onAnswer={onAnswer} />}

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
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsAppMessage(answers))}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick(getTrafficSource())}
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

/** The WhatsApp message is typed out for the visitor, with what they told us. */
function whatsAppMessage(answers: ScanAnswers): string {
  const lines = ['Hi, I scanned the QR code on an Aadinath MS Angle Bar.']
  if (answers.rating === 'bad') {
    const issue = labelOf(ISSUES, answers.issue)
    lines.push(issue ? `Quality problem: ${issue}.` : 'I have a quality problem.')
  }
  return lines.join('\n')
}

// A fix this good is sent at once; otherwise the best one after MAX_WAIT_MS.
const GOOD_ENOUGH_M = 10
const MAX_WAIT_MS = 10_000
// A refusal faster than this came from the browser, not the visitor: no prompt was shown.
const NO_PROMPT_MS = 1_500

/** 'ask': the browser refused without showing a prompt, which Chrome on Android
 * does to requests a page makes on its own; a tap usually gets the prompt.
 * 'blocked': the browser refuses this site outright (blocked earlier, or an app's
 * built-in browser), so only its settings can change that. */
type LocationHelp = 'ask' | 'blocked'

/** Asks the phone where it is (the owner chose to ask on every scan, at full
 * precision) and records the answer once. GPS sharpens over the first seconds,
 * so after the first fix it keeps watching for up to MAX_WAIT_MS and sends the
 * most accurate one, or the best so far if the visitor leaves the page. If the
 * browser refuses without asking, the refusal is held until the visitor leaves,
 * and the returned function asks again from their tap. If the visitor never
 * answers the prompt, nothing is recorded. */
function locateScan(scanId: string, setHelp: (help: LocationHelp | null) => void): () => void {
  if (!('geolocation' in navigator)) {
    trackScanLocation(scanId, { status: 'unsupported' })
    return () => {}
  }
  let recorded = false
  const record = (fields: Parameters<typeof trackScanLocation>[1]) => {
    if (recorded) return
    recorded = true
    window.removeEventListener('pagehide', recordRefusal)
    trackScanLocation(scanId, fields)
  }
  const recordRefusal = () => record({ status: 'denied' })

  const ask = (tapped: boolean) => {
    const started = Date.now()
    let best: GeolocationCoordinates | null = null
    let stopped = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const stop = () => {
      stopped = true
      navigator.geolocation.clearWatch(watch)
      clearTimeout(timer)
      window.removeEventListener('pagehide', sendBest)
    }
    function sendBest() {
      if (!best || stopped) return
      stop()
      setHelp(null)
      record({ status: 'granted', latitude: best.latitude, longitude: best.longitude, accuracy: Math.round(best.accuracy) })
    }

    const watch = navigator.geolocation.watchPosition(
      ({ coords }) => {
        if (!best || coords.accuracy < best.accuracy) best = coords
        if (coords.accuracy <= GOOD_ENOUGH_M) sendBest()
        else if (!timer) timer = setTimeout(sendBest, MAX_WAIT_MS)
      },
      async (error) => {
        if (best || stopped) return // keep the fix we have; the timer sends it
        stop()
        if (error.code !== error.PERMISSION_DENIED) {
          record({ status: error.code === error.TIMEOUT ? 'timeout' : 'unavailable' })
        } else if (Date.now() - started >= NO_PROMPT_MS) {
          setHelp(null) // the visitor saw the prompt and said no
          record({ status: 'denied' })
        } else {
          window.addEventListener('pagehide', recordRefusal)
          const state = await navigator.permissions?.query({ name: 'geolocation' }).then((s) => s.state, () => null)
          if (!recorded) setHelp(tapped || state === 'denied' ? 'blocked' : 'ask')
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 30_000 },
    )
    window.addEventListener('pagehide', sendBest)
  }

  ask(false)
  return () => {
    if (!recorded) ask(true)
  }
}
