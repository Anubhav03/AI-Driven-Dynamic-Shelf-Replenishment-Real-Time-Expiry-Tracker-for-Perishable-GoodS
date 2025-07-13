'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Package } from 'lucide-react';
import { Forecast, Product } from '@/types';

interface ForecastChartProps {
  forecasts: Forecast[];
  products: Product[];
  chartType?: 'bar' | 'line' | 'pie';
  height?: number;
  showTop?: number;
}

const ForecastChart = ({ 
  forecasts, 
  products, 
  chartType = 'bar', 
  height = 400,
  showTop = 10 
}: ForecastChartProps) => {
  // Combine forecast data with product information
  const chartData = forecasts
    .map(forecast => {
      const product = products.find(p => p.id === forecast.product_id);
      return {
        ...forecast,
        productName: product?.name || `Product ${forecast.product_id}`,
        category: product?.category || 'Unknown',
      };
    })
    .sort((a, b) => b.forecast - a.forecast)
    .slice(0, showTop);

  const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1'
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Forecast: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="productName" 
          angle={-45}
          textAnchor="end"
          height={100}
          fontSize={12}
        />
        <YAxis fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="forecast" 
          fill="#3B82F6" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="productName" 
          angle={-45}
          textAnchor="end"
          height={100}
          fontSize={12}
        />
        <YAxis fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="forecast" 
          stroke="#3B82F6" 
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ productName, percent }) => `${productName} ${((percent || 0) * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="forecast"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  if (!forecasts.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Forecast Data</h3>
          <p className="text-gray-500">Forecast data will appear here once available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Demand Forecast</h3>
          <p className="text-sm text-gray-500">
            Top {showTop} products by predicted demand
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-600">
            Total: {forecasts.reduce((sum, f) => sum + f.forecast, 0).toFixed(0)}
          </span>
        </div>
      </div>
      
      {renderChart()}
      
      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.max(...forecasts.map(f => f.forecast)).toFixed(0)}
          </div>
          <div className="text-sm text-gray-500">Highest Forecast</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {(forecasts.reduce((sum, f) => sum + f.forecast, 0) / forecasts.length).toFixed(0)}
          </div>
          <div className="text-sm text-gray-500">Average Forecast</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.min(...forecasts.map(f => f.forecast)).toFixed(0)}
          </div>
          <div className="text-sm text-gray-500">Lowest Forecast</div>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;