'use client';

import { AlertTriangle, Calendar, Package, Clock } from 'lucide-react';
import { formatDate, getDaysUntilExpiry, isExpired, isExpiringSoon, getStatusColor } from '@/utils/helper';
import { Expiry, Product } from '@/types';

interface ExpiryCardProps {
  expiry: Expiry;
  product?: Product;
  showActions?: boolean;
  onAction?: (action: string, expiryId: number) => void;
}

const ExpiryCard = ({ expiry, product, showActions = true, onAction }: ExpiryCardProps) => {
  const daysUntilExpiry = getDaysUntilExpiry(expiry.expiry_date);
  const expired = isExpired(expiry.expiry_date);
  const expiringSoon = isExpiringSoon(expiry.expiry_date);

  const getStatusInfo = () => {
    if (expired) {
      return {
        status: 'Expired',
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: AlertTriangle,
        iconColor: 'text-red-500',
      };
    }
    if (expiringSoon) {
      return {
        status: 'Expiring Soon',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: Clock,
        iconColor: 'text-yellow-500',
      };
    }
    return {
      status: 'Good',
      color: 'text-green-600 bg-green-50 border-green-200',
      icon: Calendar,
      iconColor: 'text-green-500',
    };
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${statusInfo.color}`}>
            <Icon className={`w-5 h-5 ${statusInfo.iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {product?.name || `Product ${expiry.product_id}`}
            </h3>
            {product?.category && (
              <p className="text-sm text-gray-500">{product.category}</p>
            )}
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.status}
        </span>
      </div>

      {/* Expiry Information */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Expiry Date:</span>
          <span className="text-sm font-medium text-gray-900">
            {formatDate(expiry.expiry_date)}
          </span>
        </div>
        
        {daysUntilExpiry !== null && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Days Remaining:</span>
            <span className={`text-sm font-medium ${
              expired ? 'text-red-600' : expiringSoon ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {expired ? 'Expired' : `${daysUntilExpiry} days`}
            </span>
          </div>
        )}

        {expiry.detected_text && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Detected Text:</span>
            <span className="text-sm text-gray-900 max-w-xs truncate">
              {expiry.detected_text}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && onAction && (
        <div className="flex space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onAction('discount', expiry.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
          >
            Apply Discount
          </button>
          <button
            onClick={() => onAction('donate', expiry.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors duration-200"
          >
            Donate
          </button>
          <button
            onClick={() => onAction('remove', expiry.id)}
            className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
          >
            Remove
          </button>
        </div>
      )}

      {/* Image preview if available */}
      {expiry.image_path && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Scanned Image:</p>
          <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpiryCard;