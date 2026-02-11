'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  getVerifyPageMetrics,
  getScanToSubmitConversion,
  VerifyPageMetricsData,
  ScanToSubmitConversionData,
} from '@/lib/analytics-queries';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface KPICardProps {
  label: string;
  value: number | string;
  format?: 'number' | 'percentage' | 'duration';
  loading?: boolean;
}

function KPICard({ label, value, format = 'number', loading }: KPICardProps) {
  let formattedValue = value;

  if (!loading) {
    if (format === 'percentage') {
      formattedValue = `${(Number(value) || 0).toFixed(1)}%`;
    } else if (format === 'duration') {
      const ms = Number(value) || 0;
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      if (minutes > 0) {
        formattedValue = `${minutes}m ${seconds % 60}s`;
      } else {
        formattedValue = `${seconds}s`;
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <p className="text-gray-600 text-xs md:text-sm font-medium truncate">{label}</p>
      <div className="mt-2">
        {loading ? (
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        ) : (
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{formattedValue}</p>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const [metrics, setMetrics] = useState<VerifyPageMetricsData | null>(null);
  const [conversions, setConversions] = useState<ScanToSubmitConversionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'timelag'>('recent');
  const [filterCity, setFilterCity] = useState<string>('');
  const [cities, setCities] = useState<string[]>([]);

  // Load metrics and conversions
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [metricsData, conversionsData] = await Promise.all([
          getVerifyPageMetrics(),
          getScanToSubmitConversion(),
        ]);

        setMetrics(metricsData);
        setConversions(conversionsData);

        // Extract unique cities
        const uniqueCities = Array.from(
          new Set(conversionsData.map((c) => c.city).filter(Boolean))
        );
        setCities(uniqueCities);
      } catch (error) {
        console.error('Error loading verify page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort conversions
  let filteredConversions = conversions.filter((c) => {
    if (filterCity && c.city !== filterCity) return false;
    return true;
  });

  if (sortBy === 'recent') {
    filteredConversions = filteredConversions.sort(
      (a, b) => b.submitTimestamp.getTime() - a.submitTimestamp.getTime()
    );
  } else if (sortBy === 'timelag') {
    filteredConversions = filteredConversions.sort((a, b) => a.timeLag - b.timeLag);
  }

  // Funnel data
  const funnelData = [
    {
      stage: 'QR Scans',
      count: metrics?.totalScans || 0,
      color: '#3b82f6',
    },
    {
      stage: 'Form Submissions',
      count: metrics?.totalSubmissions || 0,
      color: '#10b981',
    },
  ];

  // Location breakdown (pie chart)
  const locationBreakdown = conversions.reduce(
    (acc, c) => {
      const existing = acc.find((item) => item.city === c.city);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ city: c.city || 'Unknown', value: 1 });
      }
      return acc;
    },
    [] as { city: string; value: number }[]
  );

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Verify Page Analytics
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          QR verification and lead conversion metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <KPICard
          label="Total Scans"
          value={metrics?.totalScans || 0}
          loading={loading}
        />
        <KPICard
          label="Form Submissions"
          value={metrics?.totalSubmissions || 0}
          loading={loading}
        />
        <KPICard
          label="Conversion Rate"
          value={metrics?.conversionRate || 0}
          format="percentage"
          loading={loading}
        />
        <KPICard
          label="Avg Time to Submit"
          value={metrics?.avgTimeToSubmit || 0}
          format="duration"
          loading={loading}
        />
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-base md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
          Conversion Funnel
        </h2>
        {loading ? (
          <div className="h-48 md:h-64 bg-gray-100 rounded animate-pulse" />
        ) : (
          <div className="space-y-4">
            {funnelData.map((item, idx) => {
              const maxCount = Math.max(...funnelData.map((d) => d.count));
              const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              const conversionPercent =
                idx === 1 && funnelData[0].count > 0
                  ? ((item.count / funnelData[0].count) * 100).toFixed(1)
                  : null;

              return (
                <div key={item.stage}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                      {conversionPercent && (
                        <span className="text-xs text-gray-600">({conversionPercent}%)</span>
                      )}
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500`}
                      style={{ width: `${percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Location Breakdown */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
            Conversions by Location
          </h2>
          {loading ? (
            <div className="h-64 bg-gray-100 rounded animate-pulse" />
          ) : locationBreakdown.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No conversion data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={locationBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ city, value }) => `${city}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {locationBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} conversions`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Converting Cities */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
            Top Converting Cities
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : locationBreakdown.length === 0 ? (
            <p className="text-gray-500 text-sm">No conversion data available</p>
          ) : (
            <div className="space-y-3">
              {locationBreakdown
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
                .map((item, idx) => (
                  <div key={item.city} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-600 w-6">#{idx + 1}</span>
                      <span className="text-sm font-medium text-gray-900">{item.city}</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{item.value}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Conversions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-base md:text-lg font-bold text-gray-900">Recent Conversions</h2>
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="timelag">Fastest Conversion</option>
              </select>

              {cities.length > 0 && (
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Location
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Scan Time
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Submit Time
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Time Lag
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
              ) : filteredConversions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    {filterCity ? 'No conversions found for selected city.' : 'No conversions yet.'}
                  </td>
                </tr>
              ) : (
                filteredConversions.slice(0, 20).map((conversion) => (
                  <tr key={conversion.sessionId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-900 font-medium">
                      {conversion.customerName}
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                      {conversion.city}
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                      {conversion.scanTimestamp.toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                      {conversion.submitTimestamp.toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm font-medium">
                      <span
                        className={`px-2 py-1 rounded ${
                          conversion.timeLag < 60000
                            ? 'bg-green-100 text-green-800'
                            : conversion.timeLag < 300000
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {Math.floor(conversion.timeLag / 1000)}s
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredConversions.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">
            No conversion data to display
          </div>
        )}

        {!loading && filteredConversions.length > 20 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
            Showing 20 of {filteredConversions.length} conversions
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <div className="bg-blue-50 rounded-lg p-4 md:p-6">
          <p className="text-blue-900 font-semibold text-sm md:text-base">Conversion Funnel</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            Track how many QR scans lead to form submissions. The conversion rate shows the
            percentage of scans that result in customer leads.
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 md:p-6">
          <p className="text-green-900 font-semibold text-sm md:text-base">Time Lag Insights</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            Green = fast (under 1m), Yellow = medium (under 5m), Red = slow. Faster conversions
            indicate higher engagement.
          </p>
        </div>
      </div>
    </div>
  );
}
