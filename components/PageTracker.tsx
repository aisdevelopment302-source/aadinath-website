'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/firebase';

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Skip tracking for admin pages
        if (pathname.startsWith('/admin')) {
          return;
        }

        // Generate or retrieve sessionId
        let sessionId = '';
        if (typeof window !== 'undefined') {
          sessionId = localStorage.getItem('sessionId') || uuidv4();
          localStorage.setItem('sessionId', sessionId);
        }

        // Get previous page from sessionStorage
        let previousPage: string | null = null;
        if (typeof window !== 'undefined') {
          previousPage = sessionStorage.getItem('currentPage');
          sessionStorage.setItem('currentPage', pathname || '/');
        }

        // Get source from URL params (e.g., ?source=QR_BATCH_001)
        // Once captured, store in sessionStorage so all pages in session have it
        let source: string | null = searchParams.get('source');
        if (typeof window !== 'undefined') {
          if (source) {
            // New source in URL - store it for the session
            sessionStorage.setItem('trafficSource', source);
          } else {
            // Check if we have a stored source from earlier in the session
            source = sessionStorage.getItem('trafficSource');
          }
        }

        // Determine source type based on source param or referrer
        let sourceType = 'direct';
        if (source) {
          sourceType = 'qr'; // If source param exists, it's from QR code
        } else if (typeof document !== 'undefined' && document.referrer) {
          const referrer = document.referrer.toLowerCase();
          if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo')) {
            sourceType = 'organic';
          } else if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('linkedin')) {
            sourceType = 'social';
          } else if (!referrer.includes(window.location.hostname)) {
            sourceType = 'referral';
          }
        }

        // Detect device type
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
        const deviceType = detectDeviceType(userAgent);

        // Get location data via our API route
        const locationData = await getLocationFromIP();

        // Prepare tracking data
        const trackingData = {
          sessionId,
          previousPage,
          currentPage: pathname || '/',
          timestamp: Timestamp.now(),
          userAgent,
          userLocation: locationData.userLocation,
          country: locationData.country || 'unknown',
          city: locationData.city || 'unknown',
          latitude: locationData.latitude || null,
          longitude: locationData.longitude || null,
          deviceType,
          source: source || null,      // The actual source param (e.g., "QR_BATCH_001")
          sourceType,                   // Category: qr, direct, organic, social, referral
        };

        const pageViewsRef = collection(db, 'page_views');
        await addDoc(pageViewsRef, trackingData);
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [pathname, searchParams]);

  return null;
}

/**
 * Detect device type based on userAgent
 */
function detectDeviceType(userAgent: string): string {
  const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent) ? 'mobile' : 'desktop';
}

/**
 * Get location data via our API route (avoids CORS issues)
 */
async function getLocationFromIP(): Promise<{
  userLocation: string;
  country: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
}> {
  try {
    const response = await fetch('/api/geolocation');
    const data = await response.json();

    return {
      userLocation: data.userLocation,
      country: data.country || '',
      city: data.city || '',
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    };
  } catch (error) {
    console.error('Error getting location from geolocation API:', error);
    return {
      userLocation: 'unknown',
      country: '',
      city: '',
      latitude: null,
      longitude: null,
    };
  }
}
