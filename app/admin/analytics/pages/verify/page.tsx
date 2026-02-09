'use client';

import { useEffect, useState } from 'react';
import { getAllMetrics, getTotalScans, getTotalLeads } from '@/lib/analytics-queries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VerifyMetrics {
  totalScans: number;
  totalLeads: number;
  conversionRate: number;
}

export default function VerifyPage() {
  const [metrics, setMetrics] = useState<VerifyMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const metricsData = await getAllMetrics(startDate, endDate);
        
        setMetrics({
          totalScans: metricsData.totalScans,
          totalLeads: metricsData.totalLeads,
          conversionRate: metricsData.conversionRate,
        });
      } catch (error) {
        console.error('Error loading verify analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const funnelData = [
    { stage: 'QR Scans', count: metrics?.totalScans || 0 },
    { stage: 'Form Submissions', count: metrics?.totalLeads || 0 },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Verify Page Analytics</h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">QR verification and lead conversion metrics.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Total QR Scans (30d)</p>
          {loading ? (
            <div className="h-8 w-20 md:w-24 bg-gray-200 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{metrics?.totalScans || 0}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Form Submissions (30d)</p>
          {loading ? (
            <div className="h-8 w-20 md:w-24 bg-gray-200 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{metrics?.totalLeads || 0}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <p className="text-gray-600 text-xs md:text-sm font-medium">Conversion Rate</p>
          {loading ? (
            <div className="h-8 w-20 md:w-24 bg-gray-200 rounded animate-pulse mt-2" />
          ) : (
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
              {(metrics?.conversionRate || 0).toFixed(1)}%
            </p>
          )}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-base md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Conversion Funnel</h2>
        {loading ? (
          <div className="h-48 md:h-64 bg-gray-100 rounded animate-pulse" />
        ) : (
          <div className="space-y-4">
            {funnelData.map((item, idx) => {
              const maxCount = Math.max(...funnelData.map((d) => d.count));
              const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              return (
                <div key={item.stage}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{item.stage}</span>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                  <div className="h-8 bg-gray-200 rounded overflow-hidden">
                    <div
                      className={`h-full ${idx === 0 ? 'bg-blue-500' : 'bg-green-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <div className="bg-blue-50 rounded-lg p-4 md:p-6">
          <p className="text-blue-900 font-semibold text-sm md:text-base">What is this page?</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            This page tracks customers scanning your QR code and submitting their contact information through the verification form.
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 md:p-6">
          <p className="text-green-900 font-semibold text-sm md:text-base">How to improve?</p>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            Higher conversion rates mean more customers are entering their contact info. Check the Leads page to see submissions.
          </p>
        </div>
      </div>
    </div>
  );
}
