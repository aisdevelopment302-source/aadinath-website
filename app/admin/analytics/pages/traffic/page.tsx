'use client';

import { useEffect, useState } from 'react';
import { getTrafficByPage, PageMetrics } from '@/lib/analytics-queries';

export default function TrafficPage() {
  const [pageData, setPageData] = useState<PageMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getTrafficByPage();
        setPageData(data);
      } catch (error) {
        console.error('Error loading page traffic:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Page Traffic</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Visits per page and engagement metrics.</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Page</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Visits</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Last Visited</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-3 md:px-6 py-6 md:py-8 text-center">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
                  </td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 md:px-6 py-6 md:py-8 text-center text-xs md:text-sm text-gray-600">
                    No page views yet
                  </td>
                </tr>
              ) : (
                pageData.map((page) => (
                  <tr key={page.page} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-900 truncate">{page.page}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{page.visits}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 truncate">
                      {new Date(page.lastVisited).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
