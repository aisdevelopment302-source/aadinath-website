'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/firebase';

export default function PageTracker() {
  const pathname = usePathname();

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

        // Detect device type
        const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
        const deviceType = detectDeviceType(userAgent);

        // Get location data from ipapi.co
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
        };

        const pageViewsRef = collection(db, 'page_views');
        await addDoc(pageViewsRef, trackingData);
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [pathname]);

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
 * Get location data from ipapi.co
 */
async function getLocationFromIP(): Promise<{
  userLocation: string;
  country: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
}> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const city = data.city || '';
    const region = data.region || '';
    const userLocation = city && region ? `${city}, ${region}` : city || region || 'unknown';

    return {
      userLocation,
      country: data.country_name || '',
      city: city,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    };
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return {
      userLocation: 'unknown',
      country: '',
      city: '',
      latitude: null,
      longitude: null,
    };
  }
}
