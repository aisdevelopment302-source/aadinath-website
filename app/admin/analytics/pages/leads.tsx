'use client';

import { useEffect, useState } from 'react';
import { getLeads, CustomerData } from '@/lib/analytics-queries';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

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
      new Date(lead.timestamp.toDate()).toLocaleDateString(),
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Leads</h1>
          <p className="text-gray-600 mt-1">All form submissions from verification page.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Use Case</label>
            <select
              value={filters.useCase}
              onChange={(e) => setFilters({ ...filters, useCase: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">City</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Use Case</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Qty</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.city}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.useCase}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{lead.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(lead.timestamp.toDate()).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredLeads.length}</span> of{' '}
          <span className="font-semibold">{leads.length}</span> total leads
        </p>
      </div>
    </div>
  );
}
