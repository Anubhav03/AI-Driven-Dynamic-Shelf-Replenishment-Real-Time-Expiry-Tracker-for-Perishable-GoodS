'use client';

import Link from 'next/link';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Camera, 
  Calendar,
  ArrowRight,
  BarChart3,
  Sparkles,
  Shield,
  Zap,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useAlerts } from '@/hooks/useAlerts';
import { useForecast } from '@/hooks/useForecast';

export default function HomePage() {
  const { products, loading: productsLoading } = useProducts();
  const { alerts, loading: alertsLoading } = useAlerts();
  const { forecasts, loading: forecastsLoading } = useForecast();

  const criticalAlerts = alerts.filter(alert => {
    if (alert.type === 'expiry') {
      return alert.days_until_expiry && alert.days_until_expiry <= 3;
    }
    if (alert.type === 'low_stock') {
      return alert.current_stock === 0;
    }
    return false;
  });

  const quickActions = [
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive inventory insights and real-time metrics',
      icon: BarChart3,
      href: '/dashboard',
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      iconBg: 'bg-gradient-to-r from-blue-100 to-indigo-100',
      iconColor: 'text-blue-600',
      badge: 'Popular',
      badgeColor: 'bg-blue-500'
    },
    {
      title: 'Product Management',
      description: 'Effortlessly add, edit, and organize your inventory',
      icon: Package,
      href: '/products',
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      iconBg: 'bg-gradient-to-r from-emerald-100 to-teal-100',
      iconColor: 'text-emerald-600',
      badge: 'Essential',
      badgeColor: 'bg-emerald-500'
    },
    {
      title: 'Smart Alerts',
      description: 'AI-powered notifications for expiry and stock management',
      icon: AlertTriangle,
      href: '/alerts',
      gradient: 'from-red-500 via-pink-600 to-rose-600',
      iconBg: 'bg-gradient-to-r from-red-100 to-pink-100',
      iconColor: 'text-red-600',
      badge: 'Critical',
      badgeColor: 'bg-red-500'
    },
    {
      title: 'Demand Forecasting',
      description: 'Predict future inventory needs with advanced AI algorithms',
      icon: TrendingUp,
      href: '/forecast',
      gradient: 'from-purple-500 via-violet-600 to-purple-600',
      iconBg: 'bg-gradient-to-r from-purple-100 to-violet-100',
      iconColor: 'text-purple-600',
      badge: 'AI-Powered',
      badgeColor: 'bg-purple-500'
    },
    {
      title: 'OCR Expiry Scanner',
      description: 'Instant expiry detection through intelligent image processing',
      icon: Camera,
      href: '/scan-expiry',
      gradient: 'from-orange-500 via-amber-600 to-yellow-600',
      iconBg: 'bg-gradient-to-r from-orange-100 to-amber-100',
      iconColor: 'text-orange-600',
      badge: 'Smart',
      badgeColor: 'bg-orange-500'
    },
    {
      title: 'Manual Data Entry',
      description: 'Quick and intuitive manual expiry date registration',
      icon: Calendar,
      href: '/manual-expiry',
      gradient: 'from-indigo-500 via-blue-600 to-cyan-600',
      iconBg: 'bg-gradient-to-r from-indigo-100 to-cyan-100',
      iconColor: 'text-indigo-600',
      badge: 'Quick',
      badgeColor: 'bg-indigo-500'
    },
  ];

  const LoadingSpinner = () => (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse [animation-delay:2s]"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse [animation-delay:4s]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
        <div className="relative px-6 py-20 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Animated Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-yellow-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative p-6 bg-gradient-to-r from-blue-500 to-yellow-400 rounded-full shadow-2xl">
                  <Sparkles className="w-16 h-16 text-white animate-spin [animation-duration:8s]" />
                </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                ShelfAI
              </span>
            </h1>
            <div className="text-2xl md:text-3xl font-bold text-gray-700 mb-6">
              Next-Generation Inventory Intelligence
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
              Experience the future of inventory management with revolutionary AI-powered expiry detection, 
              predictive analytics, and automated stock optimization that transforms how you manage your business.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 hover:bg-white/90 transition-all duration-300">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800">Smart Protection</span>
              </div>
              <div className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 hover:bg-white/90 transition-all duration-300">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-800">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 hover:bg-white/90 transition-all duration-300">
                <Star className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-purple-800">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pb-16">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 -mt-12">
          <div className="group">
            <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Products</div>
                    <div className="text-5xl font-black text-gray-900 mt-2">
                      {productsLoading ? <LoadingSpinner /> : (
                        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                          {products.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
                         style={{width: '85%'}}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Inventory Health</span>
                    <span className="font-semibold">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/20 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Critical Alerts</div>
                    <div className="text-5xl font-black text-gray-900 mt-2">
                      {alertsLoading ? <LoadingSpinner /> : (
                        <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                          {criticalAlerts.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-1000 ease-out" 
                         style={{width: '25%'}}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Alert Status</span>
                    <span className="font-semibold">Low Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Forecasts</div>
                    <div className="text-5xl font-black text-gray-900 mt-2">
                      {forecastsLoading ? <LoadingSpinner /> : (
                        <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                          {forecasts.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-1000 ease-out" 
                         style={{width: '70%'}}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Forecast Accuracy</span>
                    <span className="font-semibold">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Powerful Tools
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock the full potential of your inventory with our comprehensive suite of AI-powered tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href} className="group block">
                  <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 h-full">
                    {/* Animated Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                    
                    {/* Badge */}
                    <div className="absolute top-6 right-6">
                      <span className={`${action.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                        {action.badge}
                      </span>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className={`p-5 rounded-2xl ${action.iconBg} shadow-lg group-hover:scale-110 transition-all duration-300`}>
                          <Icon className={`w-10 h-10 ${action.iconColor}`} />
                        </div>
                        <ArrowRight className="w-8 h-8 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-2 transition-all duration-300" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {action.description}
                        </p>
                      </div>
                      
                      <div className="mt-8">
                        <div className={`w-full h-1 bg-gradient-to-r ${action.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-x-0 group-hover:scale-x-100`}></div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Enhanced Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-3">Recent Activity</h2>
              <p className="text-xl text-gray-600">Stay informed with real-time inventory alerts and system notifications</p>
            </div>
            <Link
              href="/alerts"
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <span className="flex items-center space-x-2">
                <span>View All Alerts</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </div>
          
          <div className="space-y-6">
            {criticalAlerts.slice(0, 5).map((alert, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 rounded-2xl border border-red-200 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/10 to-transparent rounded-full -mr-12 -mt-12"></div>
                  <div className="relative z-10 flex items-center space-x-6">
                    <div className="p-4 bg-gradient-to-r from-red-100 to-red-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h4 className="text-xl font-bold text-gray-900">
                          {alert.type === 'expiry' ? 'Product Expiring Soon' : 'Low Stock Alert'}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold shadow-lg">
                            {alert.type === 'expiry' ? 'Urgent' : 'Critical'}
                          </span>
                          <Clock className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="text-gray-700 text-lg">
                        Product ID: <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{alert.product_id}</span>
                      </div>
                      {alert.days_until_expiry && (
                        <div className="text-red-600 font-semibold mt-2 flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Expires in {alert.days_until_expiry} days</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/alerts"
                        className="px-6 py-3 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 font-bold border-2 border-red-200 shadow-lg hover:shadow-xl"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {criticalAlerts.length === 0 && (
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur-2xl opacity-20"></div>
                  <div className="relative p-8 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full w-32 h-32 mx-auto">
                    <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">All Systems Optimal!</h3>
                <div className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
                  No critical alerts detected. Your inventory is perfectly balanced and optimized for maximum efficiency.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}