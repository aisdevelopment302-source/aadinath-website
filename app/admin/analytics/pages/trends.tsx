'use client';

import { useEffect, useState } from 'react';
import { getTrendData, TrendData } from '@/lib/analytics-queries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TrendsPage() {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getTrendData(days);
        setTrendData(data);
      } catch (error) {
        console.error('Error loading trend data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [days]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trend Analysis</h1>
          <p className="text-gray-600 mt-1">Time-based analytics and performance trends.</p>
        </div>

        {/* Time Period Selector */}
        <div className="flex gap-2">
          {[7, 14, 30, 60].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                days === d
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Main Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Overall Trends</h2>
        {loading ? (
          <div className="h-80 bg-gray-100 rounded animate-pulse" />
        ) : trendData.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-600">
            No trend data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="scans"
                stroke="#3b82f6"
                strokeWidth={2}
                name="QR Scans"
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#10b981"
                strokeWidth={2}
                name="Lead Submissions"
              />
              <Line
                type="monotone"
                dataKey="pageViews"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Page Views"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-blue-900 font-semibold">Total Scans ({days}d)</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-3xl font-bold text-blue-900 mt-2">
              {trendData.reduce((sum, d) => sum + d.scans, 0)}
            </p>
          )}
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <p className="text-green-900 font-semibold">Total Leads ({days}d)</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-3xl font-bold text-green-900 mt-2">
              {trendData.reduce((sum, d) => sum + d.leads, 0)}
            </p>
          )}
        </div>

        <div className="bg-amber-50 rounded-lg p-6">
          <p className="text-amber-900 font-semibold">Total Page Views ({days}d)</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-3xl font-bold text-amber-900 mt-2">
              {trendData.reduce((sum, d) => sum + d.pageViews, 0)}
            </p>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <p className="text-blue-900 font-semibold">Understanding Trends</p>
          <ul className="text-gray-600 text-sm mt-2 space-y-2">
            <li>• <strong>QR Scans:</strong> How often customers verify your products</li>
            <li>• <strong>Lead Submissions:</strong> Customer contact info collected</li>
            <li>• <strong>Page Views:</strong> Total website traffic</li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <p className="text-green-900 font-semibold">How to Use This</p>
          <ul className="text-gray-600 text-sm mt-2 space-y-2">
            <li>• Track growth over time</li>
            <li>• Compare weekly/monthly performance</li>
            <li>• Identify seasonal patterns</li>
            <li>• Monitor conversion efficiency</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
