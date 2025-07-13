'use client';

import { useState } from 'react';
import { 
  AlertTriangle, 
  Filter, 
  RefreshCw,
  Package,
  Clock,
  TrendingDown
} from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';
import { useProducts } from '@/hooks/useProducts';
import { Alert } from '@/types';
import { formatDate, getDaysUntilExpiry } from '@/utils/helper';

export default function AlertsPage() {
  const [selectedType, setSelectedType] = useState<'all' | 'expiry' | 'low_stock'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'critical' | 'warning'>('all');

  const { alerts, loading, error, refreshAlerts } = useAlerts();
  const { products } = useProducts();

  // Filter alerts based on type and severity
  const filteredAlerts = alerts.filter(alert => {
    const matchesType = selectedType === 'all' || alert.type === selectedType;
    
    let matchesSeverity = true;
    if (selectedSeverity === 'critical') {
      if (alert.type === 'expiry') {
        matchesSeverity = alert.days_left !== undefined && alert.days_left <= 3;
      } else if (alert.type === 'low_stock') {
        matchesSeverity = alert.current_stock === 0;
      }
    } else if (selectedSeverity === 'warning') {
      if (alert.type === 'expiry') {
        matchesSeverity = alert.days_left !== undefined && alert.days_left > 3;
      } else if (alert.type === 'low_stock') {
        matchesSeverity = alert.current_stock !== undefined && alert.current_stock > 0;
      }
    }
    
    return matchesType && matchesSeverity;
  });

  const getAlertIcon = (alert: Alert) => {
    if (alert.type === 'expiry') {
      return alert.days_left !== undefined && alert.days_left <= 3 
        ? Clock 
        : AlertTriangle;
    }
    return TrendingDown;
  };

  const getAlertColor = (alert: Alert) => {
    if (alert.type === 'expiry') {
      return alert.days_left !== undefined && alert.days_left <= 3
        ? 'text-red-600 bg-red-50 border-red-200'
        : 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getAlertTitle = (alert: Alert) => {
    const product = products.find(p => p.id === alert.product_id);
    if (alert.type === 'expiry') {
      const days = alert.days_left;
      if (days !== undefined && days <= 0) {
        return `${product?.name || `Product ${alert.product_id}`} - Expired`;
      } else if (days !== undefined && days <= 3) {
        return `${product?.name || `Product ${alert.product_id}`} - Expiring in ${days} days`;
      } else {
        return `${product?.name || `Product ${alert.product_id}`} - Expiring soon`;
      }
    } else {
      return `${product?.name || `Product ${alert.product_id}`} - Low stock`;
    }
  };

  const handleAction = (action: string, alert: Alert) => {
    console.log(`Action ${action} for alert:`, alert);
    // TODO: Implement alert actions (discount, donate, restock, etc.)
  };

  const alertStats = {
    total: alerts.length,
    expiry: alerts.filter(a => a.type === 'expiry').length,
    lowStock: alerts.filter(a => a.type === 'low_stock').length,
    critical: alerts.filter(alert => {
      if (alert.type === 'expiry') {
        return alert.days_left !== undefined && alert.days_left <= 3;
      }
      if (alert.type === 'low_stock') {
        return alert.current_stock === 0;
      }
      return false;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-600 mt-2">Monitor expiry and stock alerts</p>
        </div>
        <button
          onClick={refreshAlerts}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alertStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiry Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alertStats.expiry}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{alertStats.lowStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-gray-900">{alertStats.critical}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option value="all">All Types</option>
            <option value="expiry">Expiry Alerts</option>
            <option value="low_stock">Low Stock Alerts</option>
          </select>
        </div>

        <div className="relative">
          <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as any)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Alerts List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading alerts...</p>
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="space-y-4">
          {filteredAlerts.map((alert, index) => {
            const Icon = getAlertIcon(alert);
            const product = products.find(p => p.id === alert.product_id);
            
            return (
              <div key={index} className={`bg-white rounded-lg shadow-sm border p-6 ${getAlertColor(alert)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg bg-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getAlertTitle(alert)}
                      </h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">
                          Product ID: {alert.product_id}
                          {product?.category && ` • Category: ${product.category}`}
                        </p>
                        {alert.type === 'expiry' && alert.expiry_date && (
                          <p className="text-sm text-gray-600">
                            Expiry Date: {formatDate(alert.expiry_date)}
                          </p>
                        )}
                        {alert.type === 'low_stock' && (
                          <p className="text-sm text-gray-600">
                            Current Stock: {alert.current_stock}
                            {product?.min_stock && ` • Min Stock: ${product.min_stock}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {alert.type === 'expiry' && (
                      <>
                        <button
                          onClick={() => handleAction('discount', alert)}
                          className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors duration-200"
                        >
                          Apply Discount
                        </button>
                        <button
                          onClick={() => handleAction('donate', alert)}
                          className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors duration-200"
                        >
                          Donate
                        </button>
                      </>
                    )}
                    {alert.type === 'low_stock' && (
                      <button
                        onClick={() => handleAction('restock', alert)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors duration-200"
                      >
                        Restock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
          <p className="text-gray-500">No alerts match your current filters.</p>
        </div>
      )}
    </div>
  );
}