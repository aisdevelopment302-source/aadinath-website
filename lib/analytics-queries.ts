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
  page: string;
  timestamp: Timestamp;
  userAgent?: string;
  location?: string;
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
      const page = data.page || 'unknown';
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

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as CustomerData));
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
