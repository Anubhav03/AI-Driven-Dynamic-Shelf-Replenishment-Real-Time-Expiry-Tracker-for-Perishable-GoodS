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
  Bell,
  Search,
  User,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { useAlerts } from '@/hooks/useAlerts';
import BackendStatus from './BackendStatus';

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
    if (href === '/') {
      return pathname === '/' || pathname === '/';
    }
    return pathname === href;
  };

  return (
    <>
      {/* Top Header Bar - Walmart Style */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-yellow-300">✨ AI-Powered Smart Inventory</span>
              <span className="hidden md:inline text-blue-100">|</span>
              <span className="hidden md:inline text-blue-100">Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-4">
              <BackendStatus />
              <Link href="/help" className="text-blue-100 hover:text-yellow-300 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Walmart Style */}
      <nav className="bg-white shadow-md border-b-2 border-blue-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Package className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-blue-600">ShelfAI</span>
                  <div className="text-xs text-gray-500 -mt-1">Smart Inventory</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-yellow-400 text-blue-600 shadow-md'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                    {item.name === 'Alerts' && criticalAlertsCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {criticalAlertsCount > 9 ? '9+' : criticalAlertsCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              
              {/* Search Bar - Desktop */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-64 pl-10 pr-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-blue-400" />
                </div>
              </div>

              {/* Notification Bell */}
              <Link href="/alerts" className="relative p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <Bell className="h-6 w-6 text-blue-600" />
                {criticalAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                    {criticalAlertsCount > 9 ? '9+' : criticalAlertsCount}
                  </span>
                )}
              </Link>

              {/* User Profile - Desktop */}
              <div className="hidden md:block relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                      Settings
                    </Link>
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-blue-400" />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
            
            {/* Mobile Menu Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold">Admin User</div>
                  <div className="text-sm text-blue-100">Administrator</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-6 py-3 text-base font-medium transition-colors ${
                      active
                        ? 'bg-yellow-400 text-blue-600 border-r-4 border-blue-600'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {item.name === 'Alerts' && criticalAlertsCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {criticalAlertsCount > 9 ? '9+' : criticalAlertsCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">System Status</span>
                <BackendStatus />
              </div>
              <div className="flex space-x-2">
                <Link href="/settings" className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Settings
                </Link>
                <button className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close profile menu when clicking outside */}
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;