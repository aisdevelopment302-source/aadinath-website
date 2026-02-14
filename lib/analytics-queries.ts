import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';

export interface ScanEvent {
  id: string;
  timestamp: Timestamp;
  batch?: string;
  city?: string;
  country?: string;
  userAgent?: string;
  source?: string;
}

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state?: string;
  useCase: string;
  quantity: number;
  timestamp: Timestamp;
}

export interface PageView {
  id: string;
  sessionId: string;
  page: string;
  currentPage?: string;
  previousPage?: string | null;
  timestamp: Timestamp;
  userAgent?: string;
  location?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  deviceType?: string;
}

export interface AnalyticsMetrics {
  totalScans: number;
  totalLeads: number;
  totalPageViews: number;
  conversionRate: number;
}

export interface LocationMetrics {
  city: string;
  country?: string;
  count: number;
}

export interface PageMetrics {
  page: string;
  visits: number;
  lastVisited: Date;
}

export interface TrendData {
  date: string;
  scans: number;
  leads: number;
  pageViews: number;
}

// Phase 2: Journey Analytics Interfaces
export interface SessionView {
  id: string;
  currentPage: string;
  previousPage: string | null;
  timestamp: Date;
  location: string;
  city?: string;
  country?: string;
  deviceType?: string;
}

export interface JourneyData {
  pages: string[];
  duration: number; // milliseconds
  converted: boolean;
  sessionId: string;
}

export interface SessionMetrics {
  sessionId: string;
  duration: number; // milliseconds
  pagesVisited: number;
  path: string; // e.g., "Home → Products → Verify → Form"
  city: string;
  country?: string;
  timestamp: Date;
  converted: boolean;
  userAgent?: string; // Full user agent string
  deviceType?: string; // mobile/desktop
  sourceType?: string; // direct, qr, organic, social, referral
  source?: string; // actual source param from URL (e.g., "QR_BATCH_001")
  latitude?: number;
  longitude?: number;
}

export interface VerifyPageMetricsData {
  totalScans: number;
  totalSubmissions: number;
  conversionRate: number; // percentage
  avgTimeToSubmit: number; // milliseconds
}

export interface ScanToSubmitConversionData {
  sessionId: string;
  scanTimestamp: Date;
  submitTimestamp: Date;
  timeLag: number; // milliseconds
  location: string;
  customerName: string;
  city?: string;
}

// Get total scans within date range
export async function getTotalScans(
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  try {
    const scanRef = collection(db, 'scan_events');
    let q = query(scanRef);

    if (startDate && endDate) {
      q = query(
        scanRef,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching total scans:', error);
    return 0;
  }
}

// Get total leads (customer submissions)
export async function getTotalLeads(
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  try {
    const leadsRef = collection(db, 'customer_data');
    let q = query(leadsRef);

    if (startDate && endDate) {
      q = query(
        leadsRef,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching total leads:', error);
    return 0;
  }
}

// Get total page views
export async function getTotalPageViews(
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  try {
    const pagesRef = collection(db, 'page_views');
    let q = query(pagesRef);

    if (startDate && endDate) {
      q = query(
        pagesRef,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      );
    }

    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error fetching total page views:', error);
    return 0;
  }
}

// Get conversion rate (leads / scans)
export async function getConversionRate(
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  try {
    const scans = await getTotalScans(startDate, endDate);
    const leads = await getTotalLeads(startDate, endDate);

    if (scans === 0) return 0;
    return (leads / scans) * 100;
  } catch (error) {
    console.error('Error calculating conversion rate:', error);
    return 0;
  }
}

// Get traffic by page
export async function getTrafficByPage(
  startDate?: Date,
  endDate?: Date
): Promise<PageMetrics[]> {
  try {
    const pagesRef = collection(db, 'page_views');
    let q = query(pagesRef, orderBy('timestamp', 'desc'));

    if (startDate && endDate) {
      q = query(
        pagesRef,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate)),
        orderBy('timestamp', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    const pageMap = new Map<string, { count: number; lastTime: Date }>();

    snapshot.docs.forEach((doc) => {
      const data = doc.data() as PageView;
      const page = data.currentPage || data.page || 'unknown';
      const timestamp = data.timestamp?.toDate() || new Date();

      if (pageMap.has(page)) {
        const existing = pageMap.get(page)!;
        existing.count += 1;
        if (timestamp > existing.lastTime) {
          existing.lastTime = timestamp;
        }
      } else {
        pageMap.set(page, { count: 1, lastTime: timestamp });
      }
    });

    return Array.from(pageMap.entries())
      .map(([page, data]) => ({
        page,
        visits: data.count,
        lastVisited: data.lastTime,
      }))
      .sort((a, b) => b.visits - a.visits);
  } catch (error) {
    console.error('Error fetching traffic by page:', error);
    return [];
  }
}

// Get top locations
export async function getTopLocations(
  limitCount: number = 10,
  startDate?: Date,
  endDate?: Date
): Promise<LocationMetrics[]> {
  try {
    const scansRef = collection(db, 'scan_events');
    let q = query(scansRef);

    if (startDate && endDate) {
      q = query(
        scansRef,
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        where('timestamp', '<=', Timestamp.fromDate(endDate))
      );
    }

    const snapshot = await getDocs(q);
    const locationMap = new Map<string, { city: string; country?: string; count: number }>();

    snapshot.docs.forEach((doc) => {
      const data = doc.data() as ScanEvent;
      const city = data.city || 'Unknown';
      const country = data.country || 'Unknown';
      const key = `${city}, ${country}`;

      if (locationMap.has(key)) {
        const existing = locationMap.get(key)!;
        existing.count += 1;
      } else {
        locationMap.set(key, { city, country, count: 1 });
      }
    });

    return Array.from(locationMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching top locations:', error);
    return [];
  }
}

// Get all leads with optional filters
export async function getLeads(filters?: {
  city?: string;
  useCase?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<CustomerData[]> {
  try {
    const leadsRef = collection(db, 'customer_data');
    let constraints = [];

    if (filters?.startDate && filters?.endDate) {
      constraints.push(
        where('timestamp', '>=', Timestamp.fromDate(filters.startDate))
      );
      constraints.push(
        where('timestamp', '<=', Timestamp.fromDate(filters.endDate))
      );
    }

    if (filters?.city) {
      constraints.push(where('city', '==', filters.city));
    }

    if (filters?.useCase) {
      constraints.push(where('useCase', '==', filters.useCase));
    }

    const q = constraints.length > 0 ? query(leadsRef, ...constraints) : query(leadsRef);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unknown',
        email: data.email || '',
        phone: data.phone || '',
        city: data.city || '',
        state: data.state,
        useCase: data.useCase || '',
        quantity: data.quantity || 0,
        timestamp: data.timestamp || Timestamp.now(),
      } as CustomerData;
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
}

// Get trend data (daily aggregation)
export async function getTrendData(days: number = 30): Promise<TrendData[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const scans = await getTotalScans(startDate);
    const leads = await getTotalLeads(startDate);
    const pageViews = await getTotalPageViews(startDate);

    // For detailed trends, we'd need to aggregate by day
    // For now, return a simple overview
    const trendData: TrendData[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // This is simplified - in production, query per-day
      trendData.push({
        date: dateStr,
        scans: Math.floor(scans / days),
        leads: Math.floor(leads / days),
        pageViews: Math.floor(pageViews / days),
      });
    }

    return trendData;
  } catch (error) {
    console.error('Error fetching trend data:', error);
    return [];
  }
}

// Get all metrics at once
export async function getAllMetrics(
  startDate?: Date,
  endDate?: Date
): Promise<AnalyticsMetrics> {
  try {
    const totalScans = await getTotalScans(startDate, endDate);
    const totalLeads = await getTotalLeads(startDate, endDate);
    const conversionRate = await getConversionRate(startDate, endDate);

    return {
      totalScans,
      totalLeads,
      totalPageViews: 0, // Will add this in a separate call if needed
      conversionRate,
    };
  } catch (error) {
    console.error('Error fetching all metrics:', error);
    return {
      totalScans: 0,
      totalLeads: 0,
      totalPageViews: 0,
      conversionRate: 0,
    };
  }
}

// ============================================
// PHASE 2: JOURNEY PAGE ANALYTICS
// ============================================

/**
 * Get all page views for a single user session
 * 
 * @param sessionId - Unique session identifier (UUID)
 * @returns Array of page views in chronological order with location and device data
 * @throws Will log error but return empty array
 * 
 * Use case: Show complete user journey for one session
 * Example: User's path: Home (8:00) → Products (8:15) → Verify (8:20) → Form (8:22)
 */
export async function getUserSession(sessionId: string): Promise<SessionView[]> {
  try {
    if (!sessionId) {
      console.warn('getUserSession: sessionId is required');
      return [];
    }

    const pagesRef = collection(db, 'page_views');
    const q = query(
      pagesRef,
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.warn(`getUserSession: No page views found for sessionId ${sessionId}`);
      return [];
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      return {
        id: doc.id,
        currentPage: data.currentPage || data.page || '/',
        previousPage: data.previousPage || null,
        timestamp: data.timestamp?.toDate() || new Date(),
        location: data.userLocation || `${data.city || 'Unknown'}, ${data.country || ''}`,
        city: data.city,
        country: data.country,
        deviceType: data.deviceType,
      } as SessionView;
    });
  } catch (error) {
    console.error('Error fetching user session:', error);
    return [];
  }
}

/**
 * Get simplified user journey for a session
 * 
 * @param sessionId - Unique session identifier (UUID)
 * @returns Journey data: pages visited, total duration, conversion status
 * @throws Will log error but return null/empty values
 * 
 * Use case: Quick summary - "User visited 4 pages over 3m 20s and submitted form"
 */
export async function getUserJourney(sessionId: string): Promise<JourneyData | null> {
  try {
    if (!sessionId) {
      console.warn('getUserJourney: sessionId is required');
      return null;
    }

    const sessionViews = await getUserSession(sessionId);
    
    if (sessionViews.length === 0) {
      return null;
    }

    // Extract unique pages in order
    const pages = sessionViews.map(v => v.currentPage);
    const uniquePages = Array.from(new Set(pages));

    // Calculate duration (first page to last page)
    const firstTimestamp = sessionViews[0].timestamp.getTime();
    const lastTimestamp = sessionViews[sessionViews.length - 1].timestamp.getTime();
    const duration = lastTimestamp - firstTimestamp;

    // Check if user converted (submitted form via customer_data)
    const customerDataRef = collection(db, 'customer_data');
    const convertQuery = query(
      customerDataRef,
      where('sessionId', '==', sessionId)
    );
    const convertSnapshot = await getDocs(convertQuery);
    const converted = convertSnapshot.size > 0;

    return {
      pages: uniquePages,
      duration,
      converted,
      sessionId,
    };
  } catch (error) {
    console.error('Error fetching user journey:', error);
    return null;
  }
}

/**
 * Get all unique sessions with aggregated metrics
 * 
 * @param limitCount - Maximum number of sessions to return (default: 100)
 * @returns Array of session metrics sorted by most recent first
 * @throws Will log error but return empty array
 * 
 * Use case: Journey page table showing all user sessions
 * Fields: sessionId, duration, pagesVisited, path, location, timestamp, converted
 */
export async function getAllSessions(limitCount: number = 100): Promise<SessionMetrics[]> {
  try {
    const pagesRef = collection(db, 'page_views');
    const q = query(
      pagesRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount * 10) // Get more docs to extract unique sessions
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('getAllSessions: No page views found');
      return [];
    }

    // Group by sessionId
    const sessionMap = new Map<string, any[]>();
    
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const sessionId = data.sessionId;
      
      if (!sessionId) return; // Skip documents without sessionId
      
      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, []);
      }
      sessionMap.get(sessionId)!.push(data);
    });

    // Get conversion data
    const customerDataRef = collection(db, 'customer_data');
    const customerSnapshot = await getDocs(customerDataRef);
    const convertedSessionIds = new Set(
      customerSnapshot.docs.map(doc => doc.data().sessionId).filter(Boolean)
    );

    // Build session metrics
    const sessions: SessionMetrics[] = [];
    
    sessionMap.forEach((pageViews, sessionId) => {
      const sortedViews = pageViews.sort((a, b) => {
        const aTime = a.timestamp?.toDate?.()?.getTime() || 0;
        const bTime = b.timestamp?.toDate?.()?.getTime() || 0;
        return aTime - bTime;
      });

      if (sortedViews.length === 0) return;

      const firstTime = sortedViews[0].timestamp?.toDate?.()?.getTime() || 0;
      const lastTime = sortedViews[sortedViews.length - 1].timestamp?.toDate?.()?.getTime() || 0;
      const duration = lastTime - firstTime;

      // Extract path
      const pages = sortedViews.map(v => v.currentPage || v.page || '/');
      const uniquePages = Array.from(new Set(pages));
      const path = uniquePages.slice(0, 5).join(' → '); // Show first 5 pages

      // Get location from first page view
      const firstView = sortedViews[0];
      const city = firstView.city || 'Unknown';
      const country = firstView.country;
      const timestamp = firstView.timestamp?.toDate?.() || new Date();
      const userAgent = firstView.userAgent;
      const deviceType = firstView.deviceType;
      const latitude = firstView.latitude;
      const longitude = firstView.longitude;

      // Get source type from stored data, or fall back to detection
      let sourceType = firstView.sourceType || 'direct';
      const source = firstView.source || null;
      
      // If no sourceType stored, try to detect from previousPage (legacy fallback)
      if (!firstView.sourceType && firstView.previousPage) {
        const prevPage = firstView.previousPage.toLowerCase();
        if (prevPage.includes('verify') || prevPage.includes('qr')) {
          sourceType = 'qr';
        } else if (prevPage.includes('google') || prevPage.includes('organic')) {
          sourceType = 'organic';
        }
      }

      sessions.push({
        sessionId,
        duration,
        pagesVisited: uniquePages.length,
        path,
        city,
        country,
        timestamp,
        converted: convertedSessionIds.has(sessionId),
        userAgent,
        deviceType,
        sourceType,
        source,
        latitude,
        longitude,
      });
    });

    // Sort by timestamp descending (most recent first)
    return sessions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limitCount);
  } catch (error) {
    console.error('Error fetching all sessions:', error);
    return [];
  }
}

/**
 * Get QR verification page metrics
 * 
 * @returns Object with scan counts, submission counts, conversion rate, and avg time
 * @throws Will log error but return zero values
 * 
 * Use case: Verify/QR analytics card on dashboard
 * Shows: Total scans, form submissions, conversion %, avg time to submit
 */
export async function getVerifyPageMetrics(): Promise<VerifyPageMetricsData> {
  try {
    // Count total /verify page scans (from scan_events collection)
    const scanRef = collection(db, 'scan_events');
    const scanSnapshot = await getDocs(scanRef);
    const totalScans = scanSnapshot.size;

    if (totalScans === 0) {
      return {
        totalScans: 0,
        totalSubmissions: 0,
        conversionRate: 0,
        avgTimeToSubmit: 0,
      };
    }

    // Count form submissions (from customer_data collection)
    const customerRef = collection(db, 'customer_data');
    const customerSnapshot = await getDocs(customerRef);
    const totalSubmissions = customerSnapshot.size;

    // Calculate conversion rate
    const conversionRate = (totalSubmissions / totalScans) * 100;

    // Calculate average time from scan to submission
    let totalTimeToSubmit = 0;
    let submissionCount = 0;

    customerSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const timeFromScanToSubmit = data.timeFromScanToSubmit;
      
      if (typeof timeFromScanToSubmit === 'number' && timeFromScanToSubmit > 0) {
        totalTimeToSubmit += timeFromScanToSubmit;
        submissionCount += 1;
      }
    });

    const avgTimeToSubmit = submissionCount > 0 ? totalTimeToSubmit / submissionCount : 0;

    return {
      totalScans,
      totalSubmissions,
      conversionRate,
      avgTimeToSubmit,
    };
  } catch (error) {
    console.error('Error fetching verify page metrics:', error);
    return {
      totalScans: 0,
      totalSubmissions: 0,
      conversionRate: 0,
      avgTimeToSubmit: 0,
    };
  }
}

/**
 * Get scan-to-form-submission conversion data
 * 
 * @returns Array of conversions showing which scans led to form submissions
 * @throws Will log error but return empty array
 * 
 * Use case: Detailed conversion tracking
 * Shows: "Of 100 QR scans, 26 filled the form" (with details for each one)
 */
export async function getScanToSubmitConversion(): Promise<ScanToSubmitConversionData[]> {
  try {
    // Get all customer submissions
    const customerRef = collection(db, 'customer_data');
    const customerSnapshot = await getDocs(customerRef);

    if (customerSnapshot.empty) {
      console.log('getScanToSubmitConversion: No conversions found');
      return [];
    }

    // Get all scan events for reference
    const scanRef = collection(db, 'scan_events');
    const scanSnapshot = await getDocs(scanRef);
    
    const scanMap = new Map<string, any>();
    scanSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.sessionId) {
        scanMap.set(data.sessionId, {
          timestamp: data.timestamp?.toDate?.() || new Date(),
          location: data.userLocation || `${data.city || 'Unknown'}, ${data.country || ''}`,
          city: data.city,
        });
      }
    });

    // Build conversion data
    const conversions: ScanToSubmitConversionData[] = customerSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        const scanData = scanMap.get(data.sessionId);

        if (!scanData) {
          return null; // Skip if no matching scan
        }

        const submitTimestamp = data.submittedAt?.toDate?.() || new Date();
        const scanTimestamp = scanData.timestamp;
        const timeLag = submitTimestamp.getTime() - scanTimestamp.getTime();

        return {
          sessionId: data.sessionId || 'unknown',
          scanTimestamp,
          submitTimestamp,
          timeLag,
          location: scanData.location,
          customerName: data.name || 'Unknown',
          city: scanData.city,
        } as ScanToSubmitConversionData;
      })
      .filter((item): item is ScanToSubmitConversionData => item !== null)
      .sort((a, b) => b.submitTimestamp.getTime() - a.submitTimestamp.getTime());

    return conversions;
  } catch (error) {
    console.error('Error fetching scan to submit conversions:', error);
    return [];
  }
}
