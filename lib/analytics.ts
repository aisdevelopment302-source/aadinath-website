import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Track verification page scan
 * Called when user visits /verify page with a QR code batch ID
 */
export async function trackVerificationScan(
  batchId: string,
  sessionId: string,
  userLocation?: string,
  locationData?: {
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }
) {
  try {
    await addDoc(collection(db, 'scan_events'), {
      batchId,
      sessionId,
      pageUrl: '/verify',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      userLocation: userLocation || locationData?.city || 'unknown',
      city: locationData?.city || '',
      country: locationData?.country || '',
      latitude: locationData?.latitude || null,
      longitude: locationData?.longitude || null,
      timestamp: serverTimestamp(),
      type: 'verification_scan',
    });
  } catch (error) {
    console.error('Error tracking verification scan:', error);
  }
}

/**
 * Track customer data submission from verification page
 */
export async function trackCustomerSubmission(
  data: {
    name?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    useCase?: string;
    quantityNeeded?: string;
    batchId?: string;
  },
  sessionId: string,
  scanEventId?: string,
  timeFromScanToSubmit?: number
) {
  try {
    await addDoc(collection(db, 'customer_data'), {
      ...data,
      sessionId,
      scanEventId,
      timeFromScanToSubmit: timeFromScanToSubmit || null, // Time in milliseconds between scan and form submission
      submittedAt: serverTimestamp(),
      source: 'verification_page',
    });
    return { success: true };
  } catch (error) {
    console.error('Error tracking customer submission:', error);
    return { success: false, error };
  }
}

/**
 * Track page views (generic)
 */
export async function trackPageView(
  pageName: string,
  customData?: Record<string, any> & {
    sessionId?: string;
    previousPage?: string;
    currentPage?: string;
    userLocation?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    deviceType?: string;
  }
) {
  try {
    await addDoc(collection(db, 'page_views'), {
      pageName,
      timestamp: serverTimestamp(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...customData,
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track WhatsApp button click
 */
export async function trackWhatsAppClick() {
  try {
    await addDoc(collection(db, 'engagement_events'), {
      type: 'whatsapp_click',
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error tracking WhatsApp click:', error);
  }
}

/**
 * Track contact form submission
 */
export async function trackContactFormSubmission(data: Record<string, any>) {
  try {
    await addDoc(collection(db, 'contact_submissions'), {
      ...data,
      submittedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error tracking contact submission:', error);
  }
}

/**
 * Get user's approximate location from IP (requires backend)
 * For now, we'll use a simple approach with a service
 */
export async function getUserLocationFromIP(): Promise<{
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      city: data.city,
      state: data.region,
      country: data.country_name,
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    console.error('Error getting location from IP:', error);
    return {};
  }
}
