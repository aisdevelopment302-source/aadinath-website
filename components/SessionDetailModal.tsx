'use client';

import { useEffect, useState } from 'react';
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  SparklesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { SessionMetrics, JourneyData, getUserJourney } from '@/lib/analytics-queries';
import { parseUserAgent } from '@/lib/useragent-parser';

interface SessionDetailModalProps {
  sessionData: SessionMetrics | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionDetailModal({
  sessionData,
  isOpen,
  onClose,
}: SessionDetailModalProps) {
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load journey data when modal opens
  useEffect(() => {
    if (isOpen && sessionData) {
      const loadJourney = async () => {
        setLoading(true);
        try {
          const data = await getUserJourney(sessionData.sessionId);
          setJourneyData(data);
        } catch (error) {
          console.error('Error loading journey:', error);
        } finally {
          setLoading(false);
        }
      };

      loadJourney();
    }
  }, [isOpen, sessionData]);

  if (!isOpen || !sessionData) {
    return null;
  }

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionData.sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const parsedUA = sessionData.userAgent ? parseUserAgent(sessionData.userAgent) : null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Session Details</h2>
              <p className="text-blue-100 text-sm mt-1">
                {formatTime(sessionData.timestamp)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Session Overview */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-blue-600" />
                Session Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Session ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-gray-900 break-all flex-1">
                      {sessionData.sessionId}
                    </code>
                    <button
                      onClick={handleCopySessionId}
                      className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      {copied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Duration</p>
                  <p className="text-sm font-mono text-gray-900">
                    {formatDuration(sessionData.duration)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Start Time</p>
                  <p className="text-sm font-mono text-gray-900">
                    {formatTime(sessionData.timestamp)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {sessionData.converted ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">Converted</span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-semibold text-red-600">Bounced</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Journey Path */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-blue-600" />
                Journey Path
              </h3>
              {loading ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : journeyData ? (
                <div className="space-y-3">
                  {/* Simple path display */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 break-words">
                      {journeyData.pages.map((page, index) => (
                        <span key={index}>
                          {index > 0 && <span className="text-blue-600 mx-2">→</span>}
                          <span className="font-semibold text-blue-900">{page}</span>
                        </span>
                      ))}
                    </p>
                  </div>

                  {/* Pages visited count */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Pages Visited</p>
                    <p className="text-sm text-gray-900">{journeyData.pages.length} unique pages</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
                  No journey data available
                </div>
              )}
            </section>

            {/* User Details */}
            {parsedUA && (
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-blue-600" />
                  User Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Browser</p>
                    <p className="text-sm text-gray-900">{parsedUA.browser}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Operating System</p>
                    <p className="text-sm text-gray-900">{parsedUA.os}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Device Type</p>
                    <div className="flex items-center gap-2">
                      {parsedUA.deviceType === 'mobile' ? (
                        <DevicePhoneMobileIcon className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ComputerDesktopIcon className="w-5 h-5 text-gray-600" />
                      )}
                      <span className="text-sm text-gray-900 capitalize">
                        {parsedUA.deviceType}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-600 mb-1">User Agent</p>
                    <code className="text-xs text-gray-600 break-all block font-mono">
                      {parsedUA.rawUserAgent.substring(0, 60)}...
                    </code>
                  </div>
                </div>
              </section>
            )}

            {/* Location */}
            {(sessionData.city || sessionData.country) && (
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-blue-600" />
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessionData.city && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-gray-600 mb-1">City</p>
                      <p className="text-sm text-gray-900">{sessionData.city}</p>
                    </div>
                  )}

                  {sessionData.country && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Country</p>
                      <p className="text-sm text-gray-900">{sessionData.country}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Engagement Metrics */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-blue-600" />
                Engagement Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-600 mb-1">Pages Visited</p>
                  <p className="text-2xl font-bold text-blue-900">{sessionData.pagesVisited}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-xs font-semibold text-purple-600 mb-1">Duration</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatDuration(sessionData.duration)}
                  </p>
                </div>

                <div
                  className={`rounded-lg p-4 border ${
                    sessionData.converted
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <p
                    className={`text-xs font-semibold mb-1 ${
                      sessionData.converted ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    Conversion
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      sessionData.converted ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {sessionData.converted ? '✓ Yes' : '✗ No'}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
