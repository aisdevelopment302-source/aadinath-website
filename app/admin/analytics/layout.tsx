'use client';

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
} from '@heroicons/react/24/outline';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-admin';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/admin/analytics', icon: HomeIcon },
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Aadinath Industries</p>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
