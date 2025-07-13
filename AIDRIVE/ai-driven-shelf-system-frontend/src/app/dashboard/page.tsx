'use client';

import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  BarChart3,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useAlerts } from '@/hooks/useAlerts';
import { useForecast } from '@/hooks/useForecast';
import { useExpiry } from '@/hooks/useExpiry';
import ForecastChart from '@/components/ForecastChart';
import ExpiryCard from '@/components/ExpiryCard';
import { formatDate, getDaysUntilExpiry } from '@/utils/helper';

export default function DashboardPage() {
  const { products, loading: productsLoading } = useProducts();
  const { alerts, loading: alertsLoading, refreshAlerts } = useAlerts();
  const { forecasts, loading: forecastsLoading, refreshForecasts } = useForecast();
  const { expiryData, loading: expiryLoading, getExpiringSoon } = useExpiry();

  const criticalAlerts = alerts.filter(alert => {
    if (alert.type === 'expiry') {
      return alert.days_until_expiry && alert.days_until_expiry <= 3;
    }
    if (alert.type === 'low_stock') {
      return alert.current_stock === 0;
    }
    return false;
  });

  const expiringSoon = getExpiringSoon(7);
  const topForecasts = forecasts.slice(0, 5);

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      loading: productsLoading,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive',
      description: 'Active inventory items'
    },
    {
      title: 'Active Alerts',
      value: alerts.length,
      loading: alertsLoading,
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      change: '-8%',
      changeType: 'positive',
      description: 'Total system alerts'
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts.length,
      loading: alertsLoading,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      change: '+3%',
      changeType: 'negative',
      description: 'Immediate attention needed'
    },
    {
      title: 'Expiring Soon',
      value: expiringSoon.length,
      loading: expiryLoading,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      change: '+15%',
      changeType: 'negative',
      description: 'Next 7 days'
    },
  ];

  const handleRefresh = () => {
    refreshAlerts();
    refreshForecasts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Inventory Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Real-time overview of your inventory and alerts
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Data</span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={alertsLoading || forecastsLoading}
                className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <RefreshCw className={`w-5 h-5 ${alertsLoading || forecastsLoading ? 'animate-spin' : ''}`} />
                <span className="font-medium">Refresh Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.loading ? (
                      <div className="h-9 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forecast Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Demand Forecast</h2>
                  <p className="text-sm text-gray-500">AI-powered predictions for next 30 days</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Predicted Demand</span>
                </div>
              </div>
              <ForecastChart 
                forecasts={forecasts} 
                products={products}
                height={350}
                showTop={5}
              />
            </div>
          </div>

          {/* Critical Alerts - Takes 1 column */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Critical Alerts</h2>
                <p className="text-sm text-gray-500">Immediate attention required</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">{criticalAlerts.length}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {criticalAlerts.slice(0, 8).map((alert, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 hover:from-red-100 hover:to-red-150 transition-colors duration-200">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {alert.type === 'expiry' ? 'Product Expiring Soon' : 'Low Stock Alert'}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      ID: {alert.product_id}
                      {alert.days_until_expiry && ` • ${alert.days_until_expiry}d left`}
                      {alert.current_stock !== undefined && ` • Stock: ${alert.current_stock}`}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
              
              {criticalAlerts.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear!</h3>
                  <p className="text-sm text-gray-500">No critical alerts at the moment</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expiring Soon Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Products Expiring Soon</h2>
              <p className="text-sm text-gray-500">Items expiring within the next 7 days</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">{expiringSoon.length} items</span>
            </div>
          </div>
          
          {expiringSoon.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiringSoon.slice(0, 6).map((expiry) => {
                const product = products.find(p => p.id === expiry.product_id);
                return (
                  <div key={expiry.id} className="transform hover:scale-105 transition-transform duration-200">
                    <ExpiryCard
                      expiry={expiry}
                      product={product}
                      showActions={false}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Expiring Products</h3>
              <p className="text-gray-500">All products are within safe expiry ranges</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-500">Latest system alerts and notifications</p>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">{alerts.length} total alerts</span>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.slice(0, 10).map((alert, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                <div className={`p-2 rounded-lg ${
                  alert.type === 'expiry' ? 'bg-red-100' : 'bg-orange-100'
                }`}>
                  <AlertTriangle className={`w-4 h-4 ${
                    alert.type === 'expiry' ? 'text-red-500' : 'text-orange-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.type === 'expiry' ? 'Expiry Alert' : 'Low Stock Alert'}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      alert.type === 'expiry' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {alert.type === 'expiry' ? 'EXPIRY' : 'STOCK'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Product ID: {alert.product_id}
                    {alert.days_until_expiry && ` • ${alert.days_until_expiry} days until expiry`}
                    {alert.current_stock !== undefined && ` • Current stock: ${alert.current_stock}`}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="text-xs text-gray-400">
                    {/* You can add timestamp here if available */}
                    Now
                  </div>
                </div>
              </div>
            ))}
            
            {alerts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                <p className="text-gray-500">System is running smoothly</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}