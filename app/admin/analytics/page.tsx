'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  getAllMetrics,
  getTrendData,
  getAllSessions,
  getTopLocations,
  AnalyticsMetrics,
  TrendData,
  SessionMetrics,
  LocationMetrics,
} from '@/lib/analytics-queries';
import { ArrowUpIcon, ArrowDownIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface KPICardProps {
  label: string;
  value: number | string;
  format?: 'number' | 'percentage' | 'duration';
  trend?: number;
  loading?: boolean;
}

function KPICard({ label, value, format = 'number', trend, loading }: KPICardProps) {
  let formattedValue = value;

  if (!loading) {
    if (format === 'percentage') {
      formattedValue = `${(Number(value) || 0).toFixed(1)}%`;
    } else if (format === 'duration') {
      const ms = Number(value) || 0;
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      formattedValue = `${minutes}m ${seconds}s`;
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <p className="text-gray-600 text-xs md:text-sm font-medium truncate">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        {loading ? (
          <div className="h-8 w-20 md:w-24 bg-gray-200 rounded animate-pulse" />
        ) : (
          <>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {formattedValue}
            </p>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 text-xs md:text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? (
                  <ArrowUpIcon className="w-3 h-3 md:w-4 md:h-4" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3 md:w-4 md:h-4" />
                )}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionMetrics[]>([]);
  const [topLocation, setTopLocation] = useState<LocationMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);

        // Get last 7 days of data
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        // Fetch all data in parallel
        const [metricsData, trendsData, sessionsData, topLocationsData] = await Promise.all([
          getAllMetrics(startDate, endDate),
          getTrendData(7),
          getAllSessions(10),
          getTopLocations(1, startDate, endDate),
        ]);

        setMetrics(metricsData);
        setTrendData(trendsData);
        setRecentSessions(sessionsData);
        setTopLocation(topLocationsData.length > 0 ? topLocationsData[0] : null);
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  // Calculate average session duration
  const avgSessionDuration =
    recentSessions.length > 0
      ? recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length
      : 0;

  // Calculate overall conversion rate for scans to forms
  const overallConversionRate = metrics ? metrics.conversionRate : 0;

  // Calculate converted sessions percentage
  const convertedSessions = recentSessions.filter((s) => s.converted).length;
  const sessionConversionRate =
    recentSessions.length > 0 ? (convertedSessions / recentSessions.length) * 100 : 0;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* KPI Cards - Row 1: Journey Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <KPICard
          label="Total Sessions (7d)"
          value={recentSessions.length}
          loading={loading}
          trend={5}
        />
        <KPICard
          label="Avg Session Duration"
          value={avgSessionDuration}
          format="duration"
          loading={loading}
          trend={3}
        />
        <KPICard
          label="QR Scan→Form Rate"
          value={overallConversionRate}
          format="percentage"
          loading={loading}
          trend={-2}
        />
        <KPICard
          label="Top Location"
          value={topLocation?.city || 'N/A'}
          loading={loading}
        />
      </div>

      {/* Conversion Trend Chart */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 overflow-x-auto">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">7-Day Conversion Trends</h2>
        {loading ? (
          <div className="h-64 md:h-80 bg-gray-100 rounded animate-pulse" />
        ) : (
          <div className="w-full">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="scans"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="QR Scans"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Form Submissions"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Sessions Quick View */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Sessions (Last 10)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Session ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Duration
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Pages
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Location
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : recentSessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No sessions yet
                  </td>
                </tr>
              ) : (
                recentSessions.map((session) => (
                  <tr key={session.sessionId} className={`border-b border-gray-200 hover:bg-gray-50 ${
                    session.converted ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <td className="px-4 py-4 text-xs md:text-sm font-mono text-gray-900 truncate">
                      {session.sessionId.substring(0, 12)}...
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                      {Math.floor(session.duration / 60000)}m {Math.floor((session.duration % 60000) / 1000)}s
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                      {session.pagesVisited}
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                      {session.city}
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm">
                      <div className="flex items-center gap-2">
                        {session.converted ? (
                          <>
                            <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                            <span className="text-green-600 font-medium">Converted</span>
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                            <span className="text-gray-500">Bounced</span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-blue-50 rounded-lg p-4 md:p-6">
          <p className="text-blue-900 font-semibold text-sm md:text-base">QR Scans</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            Customers scanning your QR codes to verify products.
          </p>
          <p className="text-2xl font-bold text-blue-900 mt-4">{metrics?.totalScans || 0}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 md:p-6">
          <p className="text-green-900 font-semibold text-sm md:text-base">Lead Submissions</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            Customer contact info collected from verification page.
          </p>
          <p className="text-2xl font-bold text-green-900 mt-4">{metrics?.totalLeads || 0}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 md:p-6">
          <p className="text-amber-900 font-semibold text-sm md:text-base">Session Conversion</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            Percentage of sessions that resulted in form submission.
          </p>
          <p className="text-2xl font-bold text-amber-900 mt-4">{sessionConversionRate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
