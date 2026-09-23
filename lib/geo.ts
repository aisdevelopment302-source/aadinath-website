import 'server-only'

// Approximate visitor location from Vercel's edge headers. This replaces the
// ipapi.co lookups, so visitor IPs are no longer sent to a third party and there
// is no daily quota to run out of. Outside Vercel (local dev) the headers are absent.

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
  const countryCode = header(headers, 'x-vercel-ip-country')
  const regionCode = header(headers, 'x-vercel-ip-country-region')
  let country: string | null = null
  if (countryCode) {
    try {
      country = countryNames.of(countryCode) ?? countryCode
    } catch {
      country = countryCode
    }
  }
  return {
    city: header(headers, 'x-vercel-ip-city'),
    region: regionCode ? (countryCode === 'IN' ? INDIAN_STATES[regionCode] ?? regionCode : regionCode) : null,
    country,
    latitude: coordinate(headers.get('x-vercel-ip-latitude'), 90),
    longitude: coordinate(headers.get('x-vercel-ip-longitude'), 180),
  }
}
