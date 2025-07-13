'use client';

import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  BarChart3,
  RefreshCw
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
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Alerts',
      value: alerts.length,
      loading: alertsLoading,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts.length,
      loading: alertsLoading,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      title: 'Expiring Soon',
      value: expiringSoon.length,
      loading: expiryLoading,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
  ];

  const handleRefresh = () => {
    refreshAlerts();
    refreshForecasts();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your inventory and alerts</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={alertsLoading || forecastsLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
        >
          <RefreshCw className={`w-4 h-4 ${alertsLoading || forecastsLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.loading ? '...' : stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Forecast Chart */}
        <div>
          <ForecastChart 
            forecasts={forecasts} 
            products={products}
            height={300}
            showTop={5}
          />
        </div>

        {/* Critical Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Critical Alerts</h2>
            <span className="text-sm text-gray-500">
              {criticalAlerts.length} alerts
            </span>
          </div>
          
          <div className="space-y-4">
            {criticalAlerts.slice(0, 5).map((alert, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {alert.type === 'expiry' ? 'Product Expiring Soon' : 'Low Stock Alert'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Product ID: {alert.product_id}
                    {alert.days_until_expiry && ` • ${alert.days_until_expiry} days left`}
                    {alert.current_stock !== undefined && ` • Stock: ${alert.current_stock}`}
                  </p>
                </div>
              </div>
            ))}
            
            {criticalAlerts.length === 0 && (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No critical alerts at the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expiring Soon Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Products Expiring Soon</h2>
        {expiringSoon.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expiringSoon.slice(0, 6).map((expiry) => {
              const product = products.find(p => p.id === expiry.product_id);
              return (
                <ExpiryCard
                  key={expiry.id}
                  expiry={expiry}
                  product={product}
                  showActions={false}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Expiring Products</h3>
              <p className="text-gray-500">All products are within safe expiry ranges</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {alerts.slice(0, 10).map((alert, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${
                alert.type === 'expiry' ? 'bg-red-100' : 'bg-orange-100'
              }`}>
                <AlertTriangle className={`w-4 h-4 ${
                  alert.type === 'expiry' ? 'text-red-500' : 'text-orange-500'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {alert.type === 'expiry' ? 'Expiry Alert' : 'Low Stock Alert'}
                </p>
                <p className="text-xs text-gray-500">
                  Product ID: {alert.product_id}
                  {alert.days_until_expiry && ` • ${alert.days_until_expiry} days until expiry`}
                  {alert.current_stock !== undefined && ` • Current stock: ${alert.current_stock}`}
                </p>
              </div>
            </div>
          ))}
          
          {alerts.length === 0 && (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
