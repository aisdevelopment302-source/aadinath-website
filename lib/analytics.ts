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
    const docData: Record<string, any> = {
      batchId,
      sessionId,
      pageUrl: '/verify',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      userLocation: userLocation || locationData?.city || 'unknown',
      timestamp: serverTimestamp(),
      type: 'verification_scan',
    };

    // Only include location fields if they have values
    if (locationData?.city) docData.city = locationData.city;
    if (locationData?.country) docData.country = locationData.country;
    if (locationData?.latitude !== undefined) docData.latitude = locationData.latitude;
    if (locationData?.longitude !== undefined) docData.longitude = locationData.longitude;

    await addDoc(collection(db, 'scan_events'), docData);
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
    // Filter out undefined and empty string values from data
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined && value !== '')
    );

    // Build document object, filtering out undefined values
    const docData: Record<string, any> = {
      ...cleanData,
      sessionId,
      submittedAt: serverTimestamp(),
      source: 'verification_page',
    };

    // Only include scanEventId if it's provided and not empty
    if (scanEventId) {
      docData.scanEventId = scanEventId;
    }

    // Only include timeFromScanToSubmit if it's provided
    if (timeFromScanToSubmit !== undefined) {
      docData.timeFromScanToSubmit = timeFromScanToSubmit;
    }

    await addDoc(collection(db, 'customer_data'), docData);
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
    // Filter out undefined and empty string values from customData
    const cleanData = customData
      ? Object.fromEntries(
          Object.entries(customData).filter(([, value]) => value !== undefined && value !== '')
        )
      : {};

    await addDoc(collection(db, 'page_views'), {
      pageName,
      timestamp: serverTimestamp(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...cleanData,
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track WhatsApp button click
 */
export async function trackWhatsAppClick(sessionId?: string, source?: string) {
  try {
    const docData: Record<string, any> = {
      type: 'whatsapp_click',
      timestamp: serverTimestamp(),
      page: '/verify',
    };
    
    if (sessionId) docData.sessionId = sessionId;
    if (source) docData.source = source;
    
    await addDoc(collection(db, 'engagement_events'), docData);
  } catch (error) {
    console.error('Error tracking WhatsApp click:', error);
  }
}

/**
 * Track form interactions (open, submit, skip)
 */
export async function trackFormInteraction(
  action: 'form_open' | 'form_submit' | 'form_skip',
  sessionId?: string,
  source?: string
) {
  try {
    const docData: Record<string, any> = {
      type: action,
      timestamp: serverTimestamp(),
      page: '/verify',
    };
    
    if (sessionId) docData.sessionId = sessionId;
    if (source) docData.source = source;
    
    await addDoc(collection(db, 'engagement_events'), docData);
  } catch (error) {
    console.error('Error tracking form interaction:', error);
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
