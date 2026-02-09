'use client';

import { useEffect, useState } from 'react';
import { getLeads, CustomerData } from '@/lib/analytics-queries';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

// Helper function to safely format timestamp
const formatDate = (timestamp: any) => {
  if (!timestamp) return 'N/A';
  try {
    if (typeof timestamp.toDate === 'function') {
      return new Date(timestamp.toDate()).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  } catch (error) {
    return 'N/A';
  }
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredLeads, setFilteredLeads] = useState<CustomerData[]>([]);
  const [filters, setFilters] = useState({
    city: '',
    useCase: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getLeads();
        setLeads(data);
        setFilteredLeads(data);
      } catch (error) {
        console.error('Error loading leads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = leads;

    if (filters.city) {
      filtered = filtered.filter((lead) =>
        lead.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.useCase) {
      filtered = filtered.filter((lead) =>
        lead.useCase.toLowerCase().includes(filters.useCase.toLowerCase())
      );
    }

    setFilteredLeads(filtered);
  }, [filters, leads]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      alert('No leads to export');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'City', 'State', 'Use Case', 'Quantity', 'Date'];
    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.city,
      lead.state || 'N/A',
      lead.useCase,
      lead.quantity,
      formatDate(lead.timestamp),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueCities = [...new Set(leads.map((l) => l.city))];
  const uniqueUseCases = [...new Set(leads.map((l) => l.useCase))];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Leads</h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">All form submissions from verification page.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
        >
          <DocumentArrowDownIcon className="w-4 h-4 md:w-5 md:h-5" />
          <span>Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">City</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Use Case</label>
            <select
              value={filters.useCase}
              onChange={(e) => setFilters({ ...filters, useCase: e.target.value })}
              className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Use Cases</option>
              {uniqueUseCases.map((useCase) => (
                <option key={useCase} value={useCase}>
                  {useCase}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Name</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Email</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">City</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Use Case</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Qty</th>
                <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-3 md:px-6 py-6 md:py-8 text-center">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 md:px-6 py-6 md:py-8 text-center text-xs md:text-sm text-gray-600">
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-900 truncate">{lead.name}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 truncate">{lead.email}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{lead.phone}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{lead.city}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 truncate">{lead.useCase}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{lead.quantity}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                      {formatDate(lead.timestamp)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <p className="text-xs md:text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredLeads.length}</span> of{' '}
          <span className="font-semibold">{leads.length}</span> total leads
        </p>
      </div>
    </div>
  );
}
