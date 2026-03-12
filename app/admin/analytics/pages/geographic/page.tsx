'use client';

import { useEffect, useState } from 'react';
import { getTopLocations, LocationMetrics } from '@/lib/analytics-queries';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GeographicPage() {
  const [locations, setLocations] = useState<LocationMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getTopLocations(15);
        setLocations(data);
      } catch (error) {
        console.error('Error loading geographic data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Geographic Analytics</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Where your customers are scanning from.</p>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 overflow-x-auto">
        <h2 className="text-base md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Top 15 Locations</h2>
        {loading ? (
          <div className="h-64 md:h-80 bg-gray-100 rounded animate-pulse" />
        ) : locations.length === 0 ? (
          <div className="h-64 md:h-80 flex items-center justify-center text-xs md:text-base text-gray-600">
            No location data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={locations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="Scans" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">City</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Country</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Scans</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">%</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-3 md:px-6 py-6 md:py-8 text-center">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
                  </td>
                </tr>
              ) : locations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 md:px-6 py-6 md:py-8 text-center text-xs md:text-sm text-gray-600">
                    No data available
                  </td>
                </tr>
              ) : (
                locations.map((loc, idx) => {
                  const total = locations.reduce((sum, l) => sum + l.count, 0);
                  const percentage = ((loc.count / total) * 100).toFixed(1);
                  return (
                    <tr key={`${loc.city}-${idx}`} className="hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-900 truncate">{loc.city}</td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{loc.country}</td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{loc.count}</td>
                      <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{percentage}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
