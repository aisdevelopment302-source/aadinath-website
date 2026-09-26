// Browser-side tracking. Everything goes to our own /api/track route, which
// stores it in the mill's database; nothing is sent to third parties.

const SESSION_KEY = 'sessionId'
const SOURCE_KEY = 'trafficSource'

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

/** One id per browser, kept across visits, so a visitor's pages and scans link up. */
export function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = newId()
      localStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

/** The ?source= this browser session arrived with (e.g. "qr"), if any. */
export function getTrafficSource(): string {
  if (typeof window === 'undefined') return ''
  try {
    return sessionStorage.getItem(SOURCE_KEY) || ''
  } catch {
    return ''
  }
}

export function rememberTrafficSource(source: string) {
  try {
    sessionStorage.setItem(SOURCE_KEY, source)
  } catch {
    // storage blocked: the source is simply not carried to later pages
  }
}

function send(payload: Record<string, unknown>): Promise<Response> {
  return fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  })
}

/** Fire and forget: analytics must never disturb the visitor. */
function track(payload: Record<string, unknown>) {
  send({ sessionId: getSessionId(), ...payload }).catch(() => {})
}

export function trackPageView(fields: {
  page: string
  previousPage?: string | null
  source?: string | null
  sourceType: string
  deviceType: string
}) {
  track({ kind: 'page_view', ...fields })
}

/** Records a QR scan; resolves to the scan's id (null on failure) so its location can follow. */
export async function trackScan(fields: { source: string; product: string; referrer?: string }): Promise<string | null> {
  try {
    const res = await send({ kind: 'scan', sessionId: getSessionId(), ...fields })
    if (!res.ok) return null
    const body = await res.json()
    return typeof body.id === 'string' ? body.id : null
  } catch {
    return null
  }
}

export type LocationStatus = 'granted' | 'denied' | 'unavailable' | 'timeout' | 'unsupported'

/** The phone's answer to the location prompt for one scan. */
export function trackScanLocation(
  scanId: string,
  fields: { status: LocationStatus; latitude?: number; longitude?: number; accuracy?: number },
) {
  track({ kind: 'scan_location', scanId, ...fields })
}

export function trackWhatsAppClick(source?: string) {
  track({ kind: 'event', type: 'whatsapp_click', page: window.location.pathname, source })
}

export function trackFormInteraction(action: 'form_open' | 'form_submit' | 'form_skip', source?: string) {
  track({ kind: 'event', type: action, page: window.location.pathname, source })
}

/** The verification-page form. Awaited, so the visitor learns if it failed. */
export async function submitLead(data: {
  name?: string
  phone?: string
  email?: string
  city?: string
  state?: string
  pincode?: string
  useCase?: string
  quantityNeeded?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await send({ kind: 'lead', sessionId: getSessionId(), source: 'verification_page', ...data })
    if (res.ok) return { success: true }
    const body = await res.json().catch(() => ({}))
    return { success: false, error: typeof body.error === 'string' ? body.error : undefined }
  } catch {
    return { success: false }
  }
}
