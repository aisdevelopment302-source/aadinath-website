import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { visitorLocation } from '@/lib/geo'

// POST /api/track — the only way the website records anything. The browser never
// talks to the database; this route validates the payload, adds the approximate
// location from Vercel's headers and inserts as role website_app (insert-only,
// schema `website`). The ERP reads the data.
//
// Body: { kind: 'page_view' | 'scan' | 'event' | 'lead', ...fields }
// Returns 204 on success. Analytics callers ignore failures; the lead form shows them.

export const runtime = 'nodejs'

const MAX_BODY = 4096
const EVENT_TYPES = new Set(['whatsapp_click', 'form_open', 'form_skip', 'form_submit'])
const SOURCE_TYPES = new Set(['qr', 'organic', 'social', 'referral', 'direct'])
const DEVICE_TYPES = new Set(['mobile', 'desktop'])

type Body = Record<string, unknown>

function str(body: Body, key: string, max: number): string | null {
  const value = body[key]
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, max) : null
}

function oneOf(body: Body, key: string, allowed: Set<string>): string | null {
  const value = str(body, key, 50)
  return value && allowed.has(value) ? value : null
}

function path(body: Body, key: string): string | null {
  const value = str(body, key, 300)
  return value && value.startsWith('/') ? value : null
}

function sameSite(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true // same-origin navigations/beacons may omit it
  try {
    return new URL(origin).host === req.headers.get('host')
  } catch {
    return false
  }
}

function deviceFrom(userAgent: string | null): string {
  return /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent ?? '') ? 'mobile' : 'desktop'
}

export async function POST(req: NextRequest) {
  if (!sameSite(req)) return new NextResponse(null, { status: 403 })

  const raw = await req.text()
  if (raw.length > MAX_BODY) return new NextResponse(null, { status: 413 })

  let body: Body
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object')
    body = parsed as Body
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const userAgent = req.headers.get('user-agent')?.slice(0, 500) ?? null
  const sessionId = str(body, 'sessionId', 64)
  const where = visitorLocation(req.headers)
  const sql = db()

  try {
    switch (body.kind) {
      case 'page_view': {
        const page = path(body, 'page')
        if (!page) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        await sql`
          insert into website.page_views
            (session_id, page, previous_page, source, source_type, device_type, user_agent,
             city, region, country, latitude, longitude)
          values
            (${sessionId}, ${page}, ${path(body, 'previousPage')}, ${str(body, 'source', 100)},
             ${oneOf(body, 'sourceType', SOURCE_TYPES)}, ${oneOf(body, 'deviceType', DEVICE_TYPES) ?? deviceFrom(userAgent)},
             ${userAgent}, ${where.city}, ${where.region}, ${where.country}, ${where.latitude}, ${where.longitude})`
        break
      }
      case 'scan': {
        await sql`
          insert into website.scan_events
            (session_id, source, product, device_type, user_agent, referrer, city, region, country)
          values
            (${sessionId}, ${str(body, 'source', 100)}, ${str(body, 'product', 100)}, ${deviceFrom(userAgent)},
             ${userAgent}, ${str(body, 'referrer', 500)}, ${where.city}, ${where.region}, ${where.country})`
        break
      }
      case 'event': {
        const eventType = oneOf(body, 'type', EVENT_TYPES)
        if (!eventType) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        await sql`
          insert into website.engagement_events (event_type, page, session_id, source)
          values (${eventType}, ${path(body, 'page')}, ${sessionId}, ${str(body, 'source', 100)})`
        break
      }
      case 'lead': {
        const phone = str(body, 'phone', 30)
        const email = str(body, 'email', 200)
        if (!phone && !email) {
          return NextResponse.json({ error: 'Please give a phone number or email.' }, { status: 400 })
        }
        if (phone && !/^[+\d][\d\s()-]{5,29}$/.test(phone)) {
          return NextResponse.json({ error: 'Please check the phone number.' }, { status: 400 })
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return NextResponse.json({ error: 'Please check the email address.' }, { status: 400 })
        }
        await sql`
          insert into website.leads
            (name, phone, email, city, state, country, use_case, quantity_needed, session_id, source)
          values
            (${str(body, 'name', 120)}, ${phone}, ${email}, ${str(body, 'city', 100) ?? where.city},
             ${str(body, 'state', 100) ?? where.region}, ${where.country}, ${str(body, 'useCase', 100)},
             ${str(body, 'quantityNeeded', 100)}, ${sessionId}, ${str(body, 'source', 100) ?? 'verification_page'})`
        break
      }
      default:
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
  } catch (error) {
    console.error('[track] insert failed', body.kind, (error as { code?: string })?.code ?? 'unknown')
    return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
