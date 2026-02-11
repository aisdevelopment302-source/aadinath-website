'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-admin';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/admin/analytics', icon: HomeIcon },
  { name: 'Journey Analysis', href: '/admin/analytics/pages/journey', icon: ArrowTrendingUpIcon },
  { name: 'Page Traffic', href: '/admin/analytics/pages/traffic', icon: ChartBarIcon },
  { name: 'Geographic', href: '/admin/analytics/pages/geographic', icon: GlobeAltIcon },
  { name: 'Verify Analytics', href: '/admin/analytics/pages/verify', icon: CheckCircleIcon },
  { name: 'Leads', href: '/admin/analytics/pages/leads', icon: UserGroupIcon },
  { name: 'Trends', href: '/admin/analytics/pages/trends', icon: ArrowTrendingUpIcon },
];

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 md:hidden bg-white shadow">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-blue-600">Analytics</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {sidebarOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-30 md:relative md:z-auto w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:h-auto md:w-64 md:flex md:flex-col`}
      >
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold text-blue-600">Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Aadinath Industries</p>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Spacer */}
        <div className="h-16 md:h-0 flex-shrink-0" />

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
