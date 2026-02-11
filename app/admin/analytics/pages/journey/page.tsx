'use client';

import { useEffect, useState } from 'react';
import {
  getAllSessions,
  getUserJourney,
  SessionMetrics,
  JourneyData,
} from '@/lib/analytics-queries';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

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

interface ExpandedSession {
  sessionId: string;
  journey: JourneyData | null;
}

export default function JourneyPage() {
  const [sessions, setSessions] = useState<SessionMetrics[]>([]);
  const [expandedSessions, setExpandedSessions] = useState<ExpandedSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'duration' | 'converted'>('recent');
  const [filterCity, setFilterCity] = useState<string>('');
  const [filterConverted, setFilterConverted] = useState<'all' | 'converted' | 'bounced'>('all');
  const [cities, setCities] = useState<string[]>([]);

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

  // Handle session expansion
  const toggleExpand = async (sessionId: string) => {
    const isExpanded = expandedSessions.some((s) => s.sessionId === sessionId);

    if (isExpanded) {
      setExpandedSessions(
        expandedSessions.filter((s) => s.sessionId !== sessionId)
      );
    } else {
      try {
        const journey = await getUserJourney(sessionId);
        setExpandedSessions([...expandedSessions, { sessionId, journey }]);
      } catch (error) {
        console.error('Error loading journey:', error);
      }
    }
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

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Journey Analysis</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          View all user sessions and conversion journeys.
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

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterCity('');
                setFilterConverted('all');
                setSortBy('recent');
              }}
              className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Pages Visited
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Location
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 text-xs md:text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No sessions found matching your filters.
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map((session) => {
                    const isExpanded = expandedSessions.some(
                      (s) => s.sessionId === session.sessionId
                    );
                    const expandedData = expandedSessions.find(
                      (s) => s.sessionId === session.sessionId
                    );

                    return (
                      <div key={session.sessionId}>
                        <tr
                          className={`border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                            session.converted ? 'bg-green-50' : 'bg-gray-50'
                          }`}
                        >
                          <td className="px-4 py-4 text-xs md:text-sm font-mono text-gray-900 truncate">
                            {session.sessionId.substring(0, 12)}...
                          </td>
                          <td className="px-4 py-4 text-xs md:text-sm text-gray-700">
                            {Math.floor(session.duration / 60000)}m{' '}
                            {Math.floor((session.duration % 60000) / 1000)}s
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
                          <td className="px-4 py-4 text-xs md:text-sm">
                            <button
                              onClick={() => toggleExpand(session.sessionId)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {isExpanded ? (
                                <ChevronUpIcon className="w-4 h-4" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                              )}
                              <span className="hidden sm:inline">
                                {isExpanded ? 'Hide' : 'View'}
                              </span>
                            </button>
                          </td>
                        </tr>

                        {isExpanded && expandedData && (
                          <tr className="bg-blue-50 border-b border-gray-200">
                            <td colSpan={6} className="px-4 py-4">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                                  Journey Details
                                </h4>

                                {expandedData.journey ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs font-medium text-gray-600 mb-1">
                                        Path
                                      </p>
                                      <p className="text-sm text-gray-900 break-words">
                                        {expandedData.journey.pages.join(' → ')}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-gray-600 mb-1">
                                        Total Duration
                                      </p>
                                      <p className="text-sm text-gray-900">
                                        {Math.floor(expandedData.journey.duration / 60000)}m{' '}
                                        {Math.floor(
                                          (expandedData.journey.duration % 60000) / 1000
                                        )}
                                        s
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-gray-600 mb-1">
                                        Pages Visited
                                      </p>
                                      <p className="text-sm text-gray-900">
                                        {expandedData.journey.pages.length} unique pages
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-medium text-gray-600 mb-1">
                                        Conversion
                                      </p>
                                      <p className="text-sm font-medium">
                                        {expandedData.journey.converted ? (
                                          <span className="text-green-600">✓ Converted</span>
                                        ) : (
                                          <span className="text-gray-500">✗ Did Not Convert</span>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-600">
                                    No journey data available
                                  </p>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </div>
                    );
                  })}
                </>
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
        <div className="bg-blue-50 rounded-lg p-4 md:p-6">
          <p className="text-blue-900 font-semibold text-sm md:text-base">What is this page?</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            This page shows all user sessions with complete journey information. Click expand to
            see detailed page paths and conversion status.
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 md:p-6">
          <p className="text-green-900 font-semibold text-sm md:text-base">How to use?</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            Filter by city or conversion status to find patterns. Sort by duration to identify
            highly engaged users.
          </p>
        </div>
      </div>
    </div>
  );
}
