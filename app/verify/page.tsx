import { randomUUID } from 'node:crypto'
import { Suspense } from 'react'
import { headers } from 'next/headers'
import { after } from 'next/server'
import VerifyContent from '@/components/VerifyContent'
import { db } from '@/lib/db'
import { visitorLocation } from '@/lib/geo'

function VerifyLoading() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-600">Loading verification...</p>
      </div>
    </div>
  )
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)
const clip = (value: string | null | undefined, max: number) => value?.trim().slice(0, max) || null

/** Counts this load on the server (website.page_loads), whatever the visitor's
 * browser then does. The scan itself is recorded by the page's script; it sends
 * this load's id along, so the ERP can see loads that never became a scan. The
 * insert runs after the response and its failure never reaches the visitor. */
async function countLoad(searchParams: Record<string, string | string[] | undefined>): Promise<string> {
  const id = randomUUID()
  const h = await headers()
  const where = visitorLocation(h)
  const row = {
    source: clip(first(searchParams.source), 100),
    product: clip(first(searchParams.product), 100),
    userAgent: clip(h.get('user-agent'), 500),
    referrer: clip(h.get('referer'), 500),
    // set by browsers that fetch a page ahead of showing it, and by Next's own link prefetch
    purpose: clip(h.get('sec-purpose') ?? h.get('purpose') ?? (h.has('next-router-prefetch') ? 'next-prefetch' : null), 50),
    fetchDest: clip(h.get('sec-fetch-dest'), 30),
  }
  after(async () => {
    try {
      await db()`
        insert into website.page_loads
          (id, path, source, product, user_agent, referrer, purpose, fetch_dest, city, region, country)
        values
          (${id}, '/verify', ${row.source}, ${row.product}, ${row.userAgent}, ${row.referrer}, ${row.purpose},
           ${row.fetchDest}, ${where.city}, ${where.region}, ${where.country})`
    } catch (error) {
      console.error('[verify] load count failed', (error as { code?: string })?.code ?? 'unknown')
    }
  })
  return id
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const loadId = await countLoad(await searchParams)
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyContent loadId={loadId} />
    </Suspense>
  )
}
