'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  getAllMetrics,
  getTrendData,
  AnalyticsMetrics,
  TrendData,
} from '@/lib/analytics-queries';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface KPICardProps {
  label: string;
  value: number | string;
  format?: 'number' | 'percentage';
  trend?: number;
  loading?: boolean;
}

function KPICard({ label, value, format = 'number', trend, loading }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <p className="text-gray-600 text-xs md:text-sm font-medium truncate">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        {loading ? (
          <div className="h-8 w-20 md:w-24 bg-gray-200 rounded animate-pulse" />
        ) : (
          <>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {format === 'percentage'
                ? `${(Number(value) || 0).toFixed(1)}%`
                : value}
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);

        // Get last 7 days of data
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        // Fetch metrics and trends
        const [metricsData, trendsData] = await Promise.all([
          getAllMetrics(startDate, endDate),
          getTrendData(7),
        ]);

        setMetrics(metricsData);
        setTrendData(trendsData);
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <KPICard
          label="Total Scans"
          value={metrics?.totalScans || 0}
          loading={loading}
          trend={5}
        />
        <KPICard
          label="Total Leads"
          value={metrics?.totalLeads || 0}
          loading={loading}
          trend={12}
        />
        <KPICard
          label="Conversion Rate"
          value={metrics?.conversionRate || 0}
          format="percentage"
          loading={loading}
          trend={-2}
        />
        <KPICard
          label="Page Views"
          value={metrics?.totalPageViews || 0}
          loading={loading}
          trend={8}
        />
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 overflow-x-auto">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">7-Day Trends</h2>
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
                <Line
                  type="monotone"
                  dataKey="scans"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Scans"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Leads"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Page Views"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-blue-50 rounded-lg p-4 md:p-6">
          <p className="text-blue-900 font-semibold text-sm md:text-base">QR Scans</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            Customers scanning your QR codes to verify products.
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 md:p-6">
          <p className="text-green-900 font-semibold text-sm md:text-base">Lead Submissions</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            Customer contact info collected from verification page.
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 md:p-6">
          <p className="text-amber-900 font-semibold text-sm md:text-base">Page Traffic</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            All traffic across website pages tracked automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
