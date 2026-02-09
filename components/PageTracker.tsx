'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
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

        const pageViewsRef = collection(db, 'page_views');
        
        await addDoc(pageViewsRef, {
          page: pathname || '/',
          timestamp: Timestamp.now(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          location: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
        });
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, [pathname]);

  return null;
}
