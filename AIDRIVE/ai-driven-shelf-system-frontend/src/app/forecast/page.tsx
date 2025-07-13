'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  RefreshCw,
  BarChart3,
  TrendingDown,
  Package,
  Filter,
  Sparkles,
  Target,
  ArrowUp,
  ArrowDown,
  Activity,
  Eye
} from 'lucide-react';
import { useForecast } from '@/hooks/useForecast';
import { useProducts } from '@/hooks/useProducts';
import ForecastChart from '@/components/ForecastChart';
import { formatNumber } from '@/utils/helper';

export default function ForecastPage() {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'forecast' | 'name'>('forecast');

  const { forecasts, loading, error, refreshForecasts, lastUpdated } = useForecast();
  const { products } = useProducts();

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter and sort forecasts
  const filteredForecasts = forecasts
    .filter(forecast => {
      const product = products.find(p => p.id === forecast.product_id);
      return !selectedCategory || product?.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'forecast') {
        return b.forecast - a.forecast;
      } else {
        const productA = products.find(p => p.id === a.product_id);
        const productB = products.find(p => p.id === b.product_id);
        return (productA?.name || '').localeCompare(productB?.name || '');
      }
    });

  const forecastStats = {
    total: forecasts.length,
    average: forecasts.length > 0 ? forecasts.reduce((sum, f) => sum + f.forecast, 0) / forecasts.length : 0,
    highest: forecasts.length > 0 ? Math.max(...forecasts.map(f => f.forecast)) : 0,
    lowest: forecasts.length > 0 ? Math.min(...forecasts.map(f => f.forecast)) : 0,
  };

  const topForecasts = filteredForecasts.slice(0, 10);
  const lowForecasts = [...filteredForecasts].reverse().slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl shadow-xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    AI Demand Forecast
                  </h1>
                  <p className="text-blue-100 text-lg max-w-2xl">
                    Advanced predictive analytics for intelligent inventory planning
                  </p>
                  {lastUpdated && (
                    <div className="flex items-center mt-3 text-blue-200">
                      <Activity className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Last updated: {lastUpdated.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={refreshForecasts}
                disabled={loading}
                className="group relative overflow-hidden bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                  <span>Refresh Data</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{forecastStats.total}</div>
                  <div className="text-sm text-gray-500">Active Forecasts</div>
                </div>
              </div>
              <div className="flex items-center text-blue-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">All products tracked</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-xl shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatNumber(forecastStats.average, 1)}
                  </div>
                  <div className="text-sm text-gray-500">Average Demand</div>
                </div>
              </div>
              <div className="flex items-center text-green-600">
                <Activity className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Units per product</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatNumber(forecastStats.highest)}
                  </div>
                  <div className="text-sm text-gray-500">Peak Demand</div>
                </div>
              </div>
              <div className="flex items-center text-purple-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Highest forecast</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {formatNumber(forecastStats.lowest)}
                  </div>
                  <div className="text-sm text-gray-500">Minimum Demand</div>
                </div>
              </div>
              <div className="flex items-center text-orange-600">
                <ArrowDown className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Lowest forecast</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Filter & Customize</h2>
            <div className="flex items-center text-blue-600">
              <Filter className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Advanced Filters</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all duration-200 hover:border-blue-300"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <div className="relative">
                <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'forecast' | 'name')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all duration-200 hover:border-blue-300"
                >
                  <option value="forecast">Sort by Forecast</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white transition-all duration-200 hover:border-blue-300"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-red-800 font-medium">Forecast Error</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Demand Visualization</h2>
            <div className="flex items-center space-x-2 text-blue-600">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium">Interactive Chart</span>
            </div>
          </div>
          <ForecastChart 
            forecasts={filteredForecasts}
            products={products}
            chartType={chartType}
            height={400}
            showTop={15}
          />
        </div>

        {/* Top and Low Forecasts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Forecasts */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">High Performers</h2>
                    <p className="text-green-100 text-sm">Top demand forecasts</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{topForecasts.length}</div>
                  <div className="text-green-100 text-sm">Products</div>
                </div>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {topForecasts.map((forecast, index) => {
                  const product = products.find(p => p.id === forecast.product_id);
                  return (
                    <div key={forecast.product_id} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-green-50 rounded-xl transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-sm font-bold text-white">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-green-700">
                            {product?.name || `Product ${forecast.product_id}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {product?.category || 'No category'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <div className="text-lg font-bold text-green-600">
                            {formatNumber(forecast.forecast)}
                          </div>
                          <ArrowUp className="w-4 h-4 text-green-500" />
                        </div>
                        <p className="text-xs text-gray-500">units</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Low Forecasts */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Watch List</h2>
                    <p className="text-orange-100 text-sm">Low demand products</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{lowForecasts.length}</div>
                  <div className="text-orange-100 text-sm">Products</div>
                </div>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {lowForecasts.map((forecast, index) => {
                  const product = products.find(p => p.id === forecast.product_id);
                  return (
                    <div key={forecast.product_id} className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-orange-50 rounded-xl transition-all duration-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-sm font-bold text-white">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-orange-700">
                            {product?.name || `Product ${forecast.product_id}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {product?.category || 'No category'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <div className="text-lg font-bold text-orange-600">
                            {formatNumber(forecast.forecast)}
                          </div>
                          <ArrowDown className="w-4 h-4 text-orange-500" />
                        </div>
                        <p className="text-xs text-gray-500">units</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Insights */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Insights</h2>
            <p className="text-gray-600">Smart analytics to drive your inventory decisions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-900">{topForecasts.length}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">High Demand Products</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Products with forecast above average showing strong market demand
              </p>
              <div className="mt-4 inline-flex items-center text-blue-600 font-medium">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span>Strong Performance</span>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-green-900">AVG</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Demand</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Overall demand average of {formatNumber(forecastStats.average, 1)} units per product
              </p>
              <div className="mt-4 inline-flex items-center text-green-600 font-medium">
                <Activity className="w-4 h-4 mr-1" />
                <span>Baseline Metric</span>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <TrendingDown className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-orange-900">{lowForecasts.length}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Demand Products</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Products requiring attention for inventory optimization strategies
              </p>
              <div className="mt-4 inline-flex items-center text-orange-600 font-medium">
                <ArrowDown className="w-4 h-4 mr-1" />
                <span>Needs Attention</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}