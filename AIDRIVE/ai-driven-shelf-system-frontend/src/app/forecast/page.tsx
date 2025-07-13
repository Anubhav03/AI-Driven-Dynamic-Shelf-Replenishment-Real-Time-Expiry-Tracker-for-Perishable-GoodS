'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  RefreshCw,
  BarChart3,
  TrendingDown,
  Package,
  Filter
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Demand Forecast</h1>
          <p className="text-gray-600 mt-2">AI-powered demand predictions for inventory planning</p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <button
          onClick={refreshForecasts}
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
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Forecasts</p>
              <p className="text-2xl font-bold text-gray-900">{forecastStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Demand</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(forecastStats.average, 1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Highest Demand</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(forecastStats.highest)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Lowest Demand</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(forecastStats.lowest)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <BarChart3 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'forecast' | 'name')}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option value="forecast">Sort by Forecast</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        <div className="relative">
          <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Main Forecast Chart */}
      <div>
        <ForecastChart 
          forecasts={filteredForecasts}
          products={products}
          chartType={chartType}
          height={400}
          showTop={15}
        />
      </div>

      {/* Top and Low Forecasts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Forecasts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Demand Forecasts</h2>
          <div className="space-y-3">
            {topForecasts.map((forecast, index) => {
              const product = products.find(p => p.id === forecast.product_id);
              return (
                <div key={forecast.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product?.name || `Product ${forecast.product_id}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product?.category || 'No category'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      {formatNumber(forecast.forecast)}
                    </p>
                    <p className="text-xs text-gray-500">units</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Forecasts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Low Demand Forecasts</h2>
          <div className="space-y-3">
            {lowForecasts.map((forecast, index) => {
              const product = products.find(p => p.id === forecast.product_id);
              return (
                <div key={forecast.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-orange-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {product?.name || `Product ${forecast.product_id}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product?.category || 'No category'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">
                      {formatNumber(forecast.forecast)}
                    </p>
                    <p className="text-xs text-gray-500">units</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Forecast Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Forecast Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">High Demand Products</h3>
            <p className="text-sm text-gray-600">
              {topForecasts.length} products with forecast above average
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Average Demand</h3>
            <p className="text-sm text-gray-600">
              {formatNumber(forecastStats.average, 1)} units per product
            </p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <TrendingDown className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Low Demand Products</h3>
            <p className="text-sm text-gray-600">
              {lowForecasts.length} products may need attention
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}