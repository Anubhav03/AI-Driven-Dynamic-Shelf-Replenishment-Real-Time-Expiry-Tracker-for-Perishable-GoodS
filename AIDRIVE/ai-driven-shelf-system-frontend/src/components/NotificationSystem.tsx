'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X, Bell, Clock, TrendingDown } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';
import { useProducts } from '@/hooks/useProducts';
import { Alert } from '@/types';

interface Notification {
  id: string;
  alert: Alert;
  timestamp: Date;
  type: 'critical' | 'warning';
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { alerts } = useAlerts();
  const { products } = useProducts();

  // Check for new critical alerts
  useEffect(() => {
    const criticalAlerts = alerts.filter(alert => {
      if (alert.type === 'expiry') {
        return alert.days_until_expiry !== undefined && alert.days_until_expiry <= 3;
      }
      if (alert.type === 'low_stock') {
        return alert.current_stock === 0;
      }
      return false;
    });

    // Add new critical alerts as notifications
    criticalAlerts.forEach(alert => {
      const existingNotification = notifications.find(n => n.alert.product_id === alert.product_id && n.alert.type === alert.type);
      
      if (!existingNotification) {
        const newNotification: Notification = {
          id: `${alert.product_id}-${alert.type}-${Date.now()}`,
          alert,
          timestamp: new Date(),
          type: 'critical'
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        // Auto-remove notification after 10 seconds
        setTimeout(() => {
          removeNotification(newNotification.id);
        }, 10000);
      }
    });
  }, [alerts, notifications]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getAlertIcon = (alert: Alert) => {
    if (alert.type === 'expiry') {
      return alert.days_until_expiry !== undefined && alert.days_until_expiry <= 3 
        ? Clock 
        : AlertTriangle;
    }
    return TrendingDown;
  };

  const getAlertTitle = (alert: Alert) => {
    const product = products.find(p => p.id === alert.product_id);
    if (alert.type === 'expiry') {
      const days = alert.days_until_expiry;
      if (days !== undefined && days <= 0) {
        return `${product?.name || `Product ${alert.product_id}`} - EXPIRED`;
      } else if (days !== undefined && days <= 3) {
        return `${product?.name || `Product ${alert.product_id}`} - Expiring in ${days} days`;
      } else {
        return `${product?.name || `Product ${alert.product_id}`} - Expiring soon`;
      }
    } else {
      return `${product?.name || `Product ${alert.product_id}`} - OUT OF STOCK`;
    }
  };

  const getAlertMessage = (alert: Alert) => {
    if (alert.type === 'expiry') {
      const days = alert.days_until_expiry;
      if (days !== undefined && days <= 0) {
        return 'This product has expired and needs immediate attention!';
      } else if (days !== undefined && days <= 3) {
        return `Critical: Product expires in ${days} days. Take action now!`;
      } else {
        return 'Product is expiring soon. Consider applying discounts.';
      }
    } else {
      return 'Product is completely out of stock. Restock immediately!';
    }
  };

  const getAlertColor = (alert: Alert) => {
    if (alert.type === 'expiry') {
      return alert.days_until_expiry !== undefined && alert.days_until_expiry <= 0
        ? 'bg-red-500 border-red-600'
        : 'bg-orange-500 border-orange-600';
    }
    return 'bg-red-500 border-red-600';
  };

  const getAlertIconColor = (alert: Alert) => {
    if (alert.type === 'expiry') {
      return alert.days_until_expiry !== undefined && alert.days_until_expiry <= 0
        ? 'text-red-100'
        : 'text-orange-100';
    }
    return 'text-red-100';
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => {
        const Icon = getAlertIcon(notification.alert);
        const product = products.find(p => p.id === notification.alert.product_id);
        
        return (
          <div
            key={notification.id}
            className={`${getAlertColor(notification.alert)} text-white rounded-lg shadow-2xl border-2 p-4 animate-slide-in-right`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Icon className={`w-6 h-6 ${getAlertIconColor(notification.alert)}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-white truncate">
                    {getAlertTitle(notification.alert)}
                  </h4>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="flex-shrink-0 ml-2 text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-xs text-white/90 mb-2">
                  {getAlertMessage(notification.alert)}
                </p>
                
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span>
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="font-semibold">
                    {notification.alert.type === 'expiry' ? 'EXPIRY ALERT' : 'STOCK ALERT'}
                  </span>
                </div>
                
                {product?.category && (
                  <div className="mt-2">
                    <span className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSystem; 