'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  getVerifyPageMetrics,
  getEngagementMetrics,
  getAllScanEvents,
  VerifyPageMetricsData,
  EngagementMetrics,
  ScanEventData,
} from '@/lib/analytics-queries';
import { CheckCircleIcon, XCircleIcon, ChatBubbleLeftRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface KPICardProps {
  label: string;
  value: number | string;
  format?: 'number' | 'percentage' | 'duration';
  loading?: boolean;
  color?: string;
}

function KPICard({ label, value, format = 'number', loading, color }: KPICardProps) {
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
          <p className={`text-2xl md:text-3xl font-bold ${color || 'text-gray-900'}`}>{formattedValue}</p>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const [metrics, setMetrics] = useState<VerifyPageMetricsData | null>(null);
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [scanEvents, setScanEvents] = useState<ScanEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'converted'>('recent');
  const [filterStatus, setFilterStatus] = useState<'all' | 'converted' | 'not_converted'>('all');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [metricsData, engagementData, scansData] = await Promise.all([
          getVerifyPageMetrics(),
          getEngagementMetrics(),
          getAllScanEvents(100),
        ]);

        setMetrics(metricsData);
        setEngagement(engagementData);
        setScanEvents(scansData);
      } catch (error) {
        console.error('Error loading verify page data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort scans
  let filteredScans = scanEvents.filter((s) => {
    if (filterStatus === 'converted' && !s.converted) return false;
    if (filterStatus === 'not_converted' && s.converted) return false;
    return true;
  });

  if (sortBy === 'recent') {
    filteredScans = filteredScans.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } else if (sortBy === 'converted') {
    filteredScans = filteredScans.sort((a, b) => {
      if (a.converted === b.converted) return b.timestamp.getTime() - a.timestamp.getTime();
      return a.converted ? -1 : 1;
    });
  }

  // Funnel data with engagement
  const funnelData = [
    { stage: 'QR Scans', count: metrics?.totalScans || 0, color: '#3b82f6' },
    { stage: 'Form Opened', count: engagement?.formOpens || 0, color: '#f59e0b' },
    { stage: 'Form Submitted', count: metrics?.totalSubmissions || 0, color: '#10b981' },
    { stage: 'WhatsApp Clicked', count: engagement?.whatsappClicks || 0, color: '#22c55e' },
  ];

  // Pie chart for scan outcomes
  const outcomeData = [
    { name: 'Converted', value: scanEvents.filter(s => s.converted).length, color: '#10b981' },
    { name: 'Form Opened (not submitted)', value: scanEvents.filter(s => s.formOpened && !s.converted).length, color: '#f59e0b' },
    { name: 'WhatsApp Only', value: scanEvents.filter(s => s.whatsappClicked && !s.converted && !s.formOpened).length, color: '#22c55e' },
    { name: 'No Engagement', value: scanEvents.filter(s => !s.converted && !s.formOpened && !s.whatsappClicked).length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Verify Page Analytics</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          QR verification, engagement tracking, and lead conversion metrics.
        </p>
      </div>

      {/* KPI Cards - Row 1: Core Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6">
        <KPICard label="Total Scans" value={metrics?.totalScans || 0} loading={loading} color="text-blue-600" />
        <KPICard label="Form Submissions" value={metrics?.totalSubmissions || 0} loading={loading} color="text-green-600" />
        <KPICard label="Conversion Rate" value={metrics?.conversionRate || 0} format="percentage" loading={loading} />
        <KPICard label="Avg Time to Submit" value={metrics?.avgTimeToSubmit || 0} format="duration" loading={loading} />
      </div>

      {/* KPI Cards - Row 2: Engagement Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6">
        <KPICard label="Form Opens" value={engagement?.formOpens || 0} loading={loading} color="text-orange-600" />
        <KPICard label="Form Skips" value={engagement?.formSkips || 0} loading={loading} color="text-red-500" />
        <KPICard label="WhatsApp Clicks" value={engagement?.whatsappClicks || 0} loading={loading} color="text-green-500" />
        <KPICard 
          label="Form Open Rate" 
          value={metrics?.totalScans ? ((engagement?.formOpens || 0) / metrics.totalScans) * 100 : 0} 
          format="percentage" 
          loading={loading} 
        />
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-base md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Engagement Funnel</h2>
        {loading ? (
          <div className="h-48 md:h-64 bg-gray-100 rounded animate-pulse" />
        ) : (
          <div className="space-y-4">
            {funnelData.map((item, idx) => {
              const maxCount = Math.max(...funnelData.map((d) => d.count), 1);
              const percentage = (item.count / maxCount) * 100;
              const conversionFromScans = metrics?.totalScans 
                ? ((item.count / metrics.totalScans) * 100).toFixed(1) 
                : '0';

              return (
                <div key={item.stage}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                      {idx > 0 && (
                        <span className="text-xs text-gray-600">({conversionFromScans}% of scans)</span>
                      )}
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
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
        {/* Scan Outcomes Pie Chart */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">Scan Outcomes</h2>
          {loading ? (
            <div className="h-64 bg-gray-100 rounded animate-pulse" />
          ) : outcomeData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total QR Scans</span>
              <span className="text-lg font-bold text-blue-600">{metrics?.totalScans || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Form Interactions</span>
              <span className="text-lg font-bold text-orange-600">
                {(engagement?.formOpens || 0) + (engagement?.formSkips || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Leads Generated</span>
              <span className="text-lg font-bold text-green-600">{metrics?.totalSubmissions || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">WhatsApp Contacts</span>
              <span className="text-lg font-bold text-emerald-600">{engagement?.whatsappClicks || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* All Scan Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-base md:text-lg font-bold text-gray-900">All QR Scan Events</h2>
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="converted">Conversion Status</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Scans</option>
                <option value="converted">Converted Only</option>
                <option value="not_converted">Not Converted</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">Time</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">Source</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">City</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">Device</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">Form</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">WhatsApp</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredScans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No scan events found.
                  </td>
                </tr>
              ) : (
                filteredScans.slice(0, 50).map((scan, index) => (
                  <tr key={`${scan.sessionId}-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-700 whitespace-nowrap">
                      {scan.timestamp.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' })}
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-700 whitespace-nowrap">
                      {scan.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {scan.source}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-700">{scan.city}</td>
                    <td className="px-4 py-4 text-xs md:text-sm text-gray-700 capitalize">{scan.deviceType}</td>
                    <td className="px-4 py-4 text-xs md:text-sm">
                      {scan.formOpened ? (
                        <DocumentTextIcon className="w-5 h-5 text-orange-500" title="Form Opened" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm">
                      {scan.whatsappClicked ? (
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-500" title="WhatsApp Clicked" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs md:text-sm">
                      {scan.converted ? (
                        <div className="flex items-center gap-1">
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          <span className="text-green-600 font-medium">Converted</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <XCircleIcon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-500">Pending</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredScans.length > 50 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
            Showing 50 of {filteredScans.length} scan events
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <div className="bg-blue-50 rounded-lg p-4 md:p-6 border border-blue-200">
          <p className="text-blue-900 font-semibold text-sm md:text-base">Engagement Tracking</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            We track when users open the form, submit it, skip it, or click WhatsApp. 
            This helps understand user behavior beyond just conversions.
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 md:p-6 border border-green-200">
          <p className="text-green-900 font-semibold text-sm md:text-base">Conversion Funnel</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            The funnel shows: Scans → Form Opens → Submissions → WhatsApp. 
            Each step shows what percentage of original scans reached that stage.
          </p>
        </div>
      </div>
    </div>
  );
}
