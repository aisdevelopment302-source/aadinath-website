'use client';

import { useEffect, useState } from 'react';
import {
  getAllSessions,
  SessionMetrics,
} from '@/lib/analytics-queries';
import {
  CheckCircleIcon,
  XCircleIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import SessionDetailModal from '@/components/SessionDetailModal';
import { getSimplifiedUserAgent } from '@/lib/useragent-parser';

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
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      formattedValue = `${minutes}m ${seconds}s`;
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <p className="text-gray-600 text-xs md:text-sm font-medium truncate">
        {label}
      </p>
      <div className="mt-2">
        {loading ? (
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
        ) : (
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {formattedValue}
          </p>
        )}
      </div>
    </div>
  );
}

// Column visibility state interface
interface ColumnVisibility {
  sessionId: boolean;
  source: boolean;
  userAgent: boolean;
  device: boolean;
  country: boolean;
  duration: boolean;
  pages: boolean;
  status: boolean;
}

const DEFAULT_COLUMNS: ColumnVisibility = {
  sessionId: true,
  source: true,
  userAgent: false,
  device: true,
  country: true,
  duration: true,
  pages: true,
  status: true,
};

export default function JourneyPage() {
  const [sessions, setSessions] = useState<SessionMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'duration' | 'converted'>('recent');
  const [filterCity, setFilterCity] = useState<string>('');
  const [filterConverted, setFilterConverted] = useState<'all' | 'converted' | 'bounced'>('all');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionMetrics | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(DEFAULT_COLUMNS);

  // Load sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoading(true);
        const data = await getAllSessions(100);
        setSessions(data);

        // Extract unique cities
        const uniqueCities = Array.from(new Set(data.map((s) => s.city))).filter(
          (c) => c !== 'Unknown'
        );
        setCities(uniqueCities);
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Load column visibility from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('journey-column-visibility');
      if (saved) {
        setColumnVisibility(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading column visibility:', error);
    }
  }, []);

  // Save column visibility to localStorage
  const updateColumnVisibility = (column: keyof ColumnVisibility) => {
    const updated = {
      ...columnVisibility,
      [column]: !columnVisibility[column],
    };
    setColumnVisibility(updated);
    localStorage.setItem('journey-column-visibility', JSON.stringify(updated));
  };

  // Filter and sort sessions
  let filtered = sessions.filter((s) => {
    if (filterCity && s.city !== filterCity) return false;
    if (filterConverted === 'converted' && !s.converted) return false;
    if (filterConverted === 'bounced' && s.converted) return false;
    return true;
  });

  if (sortBy === 'recent') {
    filtered = filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } else if (sortBy === 'duration') {
    filtered = filtered.sort((a, b) => b.duration - a.duration);
  } else if (sortBy === 'converted') {
    filtered = filtered.sort((a, b) => {
      if (a.converted === b.converted) return b.timestamp.getTime() - a.timestamp.getTime();
      return a.converted ? -1 : 1;
    });
  }

  // Calculate stats
  const totalSessions = sessions.length;
  const convertedCount = sessions.filter((s) => s.converted).length;
  const conversionRate = totalSessions > 0 ? (convertedCount / totalSessions) * 100 : 0;
  const avgDuration =
    totalSessions > 0
      ? sessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions
      : 0;

  const handleRowClick = (session: SessionMetrics) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Journey Analysis</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          View all user sessions and conversion journeys. Click on a session to see detailed information.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        <KPICard
          label="Total Sessions"
          value={totalSessions}
          loading={loading}
        />
        <KPICard
          label="Conversion Rate"
          value={conversionRate}
          format="percentage"
          loading={loading}
        />
        <KPICard
          label="Avg Session Duration"
          value={avgDuration}
          format="duration"
          loading={loading}
        />
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">Filters & Sort</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="duration">Longest Duration</option>
              <option value="converted">Conversion Status</option>
            </select>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Conversion Status
            </label>
            <select
              value={filterConverted}
              onChange={(e) => setFilterConverted(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sessions</option>
              <option value="converted">Converted Only</option>
              <option value="bounced">Bounced Only</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                setFilterCity('');
                setFilterConverted('all');
                setSortBy('recent');
              }}
              className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Reset Filters
            </button>

            {/* Column Selector Button */}
            <details className="flex-1">
              <summary className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer">
                Columns
              </summary>
              <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-3 mt-2 z-10 min-w-max">
                <p className="text-xs font-semibold text-gray-600 mb-2">Show/Hide Columns:</p>
                {Object.entries(DEFAULT_COLUMNS).map(([key, _]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 p-2 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={columnVisibility[key as keyof ColumnVisibility]}
                      onChange={() => updateColumnVisibility(key as keyof ColumnVisibility)}
                      className="w-4 h-4"
                    />
                    <span className="capitalize">{key === 'userAgent' ? 'User Agent' : key === 'pages' ? 'Pages' : key}</span>
                  </label>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white border-b border-gray-300">
              <tr>
                {columnVisibility.sessionId && (
                  <th className="px-4 py-3 text-left font-semibold text-xs md:text-sm">
                    Session ID
                  </th>
                )}
                {columnVisibility.source && (
                  <th className="px-4 py-3 text-left font-semibold text-xs md:text-sm">
                    Source
                  </th>
                )}
                {columnVisibility.device && (
                  <th className="px-4 py-3 text-left font-semibold text-xs md:text-sm">
                    Device
                  </th>
                )}
                {columnVisibility.userAgent && (
                  <th className="px-4 py-3 text-left font-semibold text-xs md:text-sm">
                    Browser
                  </th>
                )}
                {columnVisibility.country && (
                  <th className="px-4 py-3 text-left font-semibold text-xs md:text-sm">
                    Country
                  </th>
                )}
                {columnVisibility.duration && (
                  <th className="px-4 py-3 text-left font-semibold text-xs md:text-sm">
                    Duration
                  </th>
                )}
                {columnVisibility.pages && (
                  <th className="px-4 py-3 text-left font-semibold text-xs md:text-sm">
                    Pages
                  </th>
                )}
                {columnVisibility.status && (
                  <th className="px-4 py-3 text-left font-semibold text-xs md:text-sm">
                    Status
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      Object.values(columnVisibility).filter(Boolean).length
                    }
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      Object.values(columnVisibility).filter(Boolean).length
                    }
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No sessions found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((session, index) => (
                  <tr
                    key={session.sessionId}
                    onClick={() => handleRowClick(session)}
                    className={`border-b border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    {columnVisibility.sessionId && (
                      <td className="px-4 py-4 text-xs md:text-sm font-mono text-gray-900 truncate max-w-xs">
                        <span title={session.sessionId} className="hover:text-blue-600">
                          {session.sessionId.substring(0, 12)}...
                        </span>
                      </td>
                    )}
                    {columnVisibility.source && (
                      <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {session.sourceType || 'direct'}
                        </span>
                      </td>
                    )}
                    {columnVisibility.device && (
                      <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          {session.deviceType === 'mobile' ? (
                            <DevicePhoneMobileIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                          ) : (
                            <ComputerDesktopIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                          )}
                          <span className="capitalize">
                            {session.deviceType || 'Unknown'}
                          </span>
                        </div>
                      </td>
                    )}
                    {columnVisibility.userAgent && (
                      <td className="px-4 py-4 text-xs md:text-sm text-gray-700 truncate max-w-xs">
                        {session.userAgent ? (
                          <span title={session.userAgent}>
                            {getSimplifiedUserAgent(session.userAgent)}
                          </span>
                        ) : (
                          'Unknown'
                        )}
                      </td>
                    )}
                    {columnVisibility.country && (
                      <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                        {session.country || 'Unknown'}
                      </td>
                    )}
                    {columnVisibility.duration && (
                      <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                        {Math.floor(session.duration / 60000)}m{' '}
                        {Math.floor((session.duration % 60000) / 1000)}s
                      </td>
                    )}
                    {columnVisibility.pages && (
                      <td className="px-4 py-4 text-xs md:text-sm text-gray-700 text-center">
                        {session.pagesVisited}
                      </td>
                    )}
                    {columnVisibility.status && (
                      <td className="px-4 py-4 text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                          {session.converted ? (
                            <>
                              <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                              <span className="text-green-600 font-medium">Converted</span>
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                              <span className="text-red-600 font-medium">Bounced</span>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-500">
            No sessions to display
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <div className="bg-blue-50 rounded-lg p-4 md:p-6 border border-blue-200">
          <p className="text-blue-900 font-semibold text-sm md:text-base">What is this page?</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            This page shows all user sessions with complete journey information. Click on any row to see detailed session analytics including the full journey path, user details, and engagement metrics.
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 md:p-6 border border-green-200">
          <p className="text-green-900 font-semibold text-sm md:text-base">How to use?</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            Filter by city or conversion status to find patterns. Sort by duration to identify highly engaged users. Use the Columns button to customize which information you see.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      <SessionDetailModal
        sessionData={selectedSession}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSession(null);
        }}
      />
    </div>
  );
}
