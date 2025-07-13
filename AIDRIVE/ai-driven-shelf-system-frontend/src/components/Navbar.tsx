'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Camera, 
  Calendar,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useState } from 'react';
import { useAlerts } from '@/hooks/useAlerts';

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { alerts } = useAlerts();

  // Count critical alerts
  const criticalAlertsCount = alerts.filter(alert => {
    if (alert.type === 'expiry') {
      return alert.days_left !== undefined && alert.days_left <= 3;
    }
    if (alert.type === 'low_stock') {
      return alert.current_stock === 0;
    }
    return false;
  }).length;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
    { name: 'Forecast', href: '/forecast', icon: TrendingUp },
    { name: 'Scan Expiry', href: '/scan-expiry', icon: Camera },
    { name: 'Manual Expiry', href: '/manual-expiry', icon: Calendar },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname === href;
  };

  return (
    <nav className="bg-blue-600 shadow-lg border-b-2 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-white tracking-wide">ShelfAI</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-4 py-2 mx-1 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-yellow-400 text-blue-600 shadow-md transform scale-105'
                        : 'text-white hover:bg-blue-500 hover:text-yellow-100 hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Notification Bell */}
          <div className="hidden sm:flex items-center">
            <Link href="/alerts" className="relative p-2 rounded-lg text-white hover:text-yellow-400 hover:bg-blue-500 transition-colors duration-200">
              <Bell className="h-6 w-6" />
              {criticalAlertsCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {criticalAlertsCount > 9 ? '9+' : criticalAlertsCount}
                  </span>
                  <span className="absolute inset-0 bg-red-500 rounded-full animate-pulse-ring opacity-75"></span>
                </>
              )}
            </Link>
          </div>

          {/* Notification Bell and Mobile menu button */}
          <div className="sm:hidden flex items-center space-x-2">
            {/* Notification Bell */}
            <Link href="/alerts" className="relative p-2 rounded-lg text-white hover:text-yellow-400 hover:bg-blue-500 transition-colors duration-200">
              <Bell className="h-6 w-6" />
              {criticalAlertsCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {criticalAlertsCount > 9 ? '9+' : criticalAlertsCount}
                  </span>
                  <span className="absolute inset-0 bg-red-500 rounded-full animate-pulse-ring opacity-75"></span>
                </>
              )}
            </Link>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-yellow-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="py-2 space-y-1 bg-blue-600 border-t-2 border-yellow-400">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 mx-2 rounded-lg text-base font-semibold transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-yellow-400 text-blue-600 shadow-md'
                      : 'text-white hover:bg-blue-500 hover:text-yellow-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;