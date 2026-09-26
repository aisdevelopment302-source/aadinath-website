import 'server-only'

// Approximate visitor location from the request headers. This replaces the
// ipapi.co lookups, so visitor IPs are no longer sent to a third party and there
// is no daily quota to run out of. Outside Vercel (local dev) the headers are absent.
//
// The domain is proxied through Cloudflare, so Vercel sees Cloudflare's server,
// not the visitor, and its x-vercel-ip-* headers name that server's city
// (Singapore, Marseille, ...). When a request came through Cloudflare we use only
// Cloudflare's headers: cf-ipcountry is always sent; city, region and coordinates
// need the Managed Transform "Add visitor location headers" to be switched on.

// ISO 3166-2:IN subdivision codes → state / UT names, as Vercel reports them.
const INDIAN_STATES: Record<string, string> = {
  AN: 'Andaman and Nicobar Islands', AP: 'Andhra Pradesh', AR: 'Arunachal Pradesh', AS: 'Assam',
  BR: 'Bihar', CH: 'Chandigarh', CT: 'Chhattisgarh', CG: 'Chhattisgarh', DH: 'Dadra and Nagar Haveli and Daman and Diu',
  DN: 'Dadra and Nagar Haveli and Daman and Diu', DD: 'Dadra and Nagar Haveli and Daman and Diu', DL: 'Delhi',
  GA: 'Goa', GJ: 'Gujarat', HP: 'Himachal Pradesh', HR: 'Haryana', JH: 'Jharkhand', JK: 'Jammu and Kashmir',
  KA: 'Karnataka', KL: 'Kerala', LA: 'Ladakh', LD: 'Lakshadweep', MH: 'Maharashtra', ML: 'Meghalaya',
  MN: 'Manipur', MP: 'Madhya Pradesh', MZ: 'Mizoram', NL: 'Nagaland', OR: 'Odisha', OD: 'Odisha',
  PB: 'Punjab', PY: 'Puducherry', RJ: 'Rajasthan', SK: 'Sikkim', TG: 'Telangana', TS: 'Telangana',
  TN: 'Tamil Nadu', TR: 'Tripura', UP: 'Uttar Pradesh', UK: 'Uttarakhand', UT: 'Uttarakhand', WB: 'West Bengal',
}

const countryNames = new Intl.DisplayNames(['en'], { type: 'region' })

function header(headers: Headers, name: string): string | null {
  const value = headers.get(name)
  if (!value) return null
  try {
    return decodeURIComponent(value).slice(0, 100) || null
  } catch {
    return value.slice(0, 100) || null
  }
}

function coordinate(value: string | null, limit: number): number | null {
  const n = value == null ? Number.NaN : Number(value)
  return Number.isFinite(n) && Math.abs(n) <= limit ? Math.round(n * 1e5) / 1e5 : null
}

export type VisitorLocation = {
  city: string | null
  region: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
}

export function visitorLocation(headers: Headers): VisitorLocation {
  const viaCloudflare = headers.has('cf-ray')
  const countryCode = header(headers, viaCloudflare ? 'cf-ipcountry' : 'x-vercel-ip-country')
  const regionCode = header(headers, viaCloudflare ? 'cf-region-code' : 'x-vercel-ip-country-region')
  // Cloudflare's "XX" / "T1" mean unknown / Tor
  const knownCountry = countryCode && !['XX', 'T1'].includes(countryCode) ? countryCode : null
  let country: string | null = null
  if (knownCountry) {
    try {
      country = countryNames.of(knownCountry) ?? knownCountry
    } catch {
      country = knownCountry
    }
  }
  // Cloudflare also sends the region's name; Vercel sends only the code
  const region = (viaCloudflare ? header(headers, 'cf-region') : null)
    ?? (regionCode ? (knownCountry === 'IN' ? INDIAN_STATES[regionCode] ?? regionCode : regionCode) : null)
  return {
    city: header(headers, viaCloudflare ? 'cf-ipcity' : 'x-vercel-ip-city'),
    region,
    country,
    latitude: coordinate(headers.get(viaCloudflare ? 'cf-iplatitude' : 'x-vercel-ip-latitude'), 90),
    longitude: coordinate(headers.get(viaCloudflare ? 'cf-iplongitude' : 'x-vercel-ip-longitude'), 180),
  }
}
