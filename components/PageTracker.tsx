'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getTrafficSource, rememberTrafficSource, trackPageView } from '@/lib/analytics';

// Records one page view per route change. Location is added on the server.
function PageTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const page = pathname || '/';

    // Previous page in this browser session, for journey analysis
    let previousPage: string | null = null;
    try {
      previousPage = sessionStorage.getItem('currentPage');
      sessionStorage.setItem('currentPage', page);
    } catch {
      // storage blocked
    }

    // ?source= (e.g. from a QR code) sticks for the rest of the session
    let source = searchParams.get('source');
    if (source) rememberTrafficSource(source);
    else source = getTrafficSource() || null;

    trackPageView({
      page,
      previousPage,
      source,
      sourceType: sourceTypeOf(source),
      deviceType: /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    });
  }, [pathname, searchParams]);

  return null;
}

export default function PageTracker() {
  return (
    <Suspense fallback={null}>
      <PageTrackerInner />
    </Suspense>
  );
}

/** qr when a ?source= was given, otherwise from the referrer. */
function sourceTypeOf(source: string | null): string {
  if (source) return 'qr';
  const referrer = document.referrer.toLowerCase();
  if (!referrer) return 'direct';
  if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo')) return 'organic';
  if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('linkedin')) return 'social';
  if (!referrer.includes(window.location.hostname)) return 'referral';
  return 'direct';
}
