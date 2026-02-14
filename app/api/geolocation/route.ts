import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get client IP from request headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               request.headers.get('x-real-ip') || 
               request.ip ||
               'unknown';

    // Fetch geolocation from ipapi.co (server-side, no CORS issues)
    const response = await fetch('https://ipapi.co/json/', {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`ipapi.co returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      userLocation: data.city && data.region ? `${data.city}, ${data.region}` : data.city || data.region || 'unknown',
      country: data.country_name || '',
      city: data.city || '',
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    });
  } catch (error) {
    console.error('Error in geolocation API:', error);
    return NextResponse.json({
      userLocation: 'unknown',
      country: '',
      city: '',
      latitude: null,
      longitude: null,
    }, { status: 200 }); // Return 200 to avoid breaking the page tracker
  }
}
