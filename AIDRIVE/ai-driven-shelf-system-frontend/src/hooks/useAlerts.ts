import { useState, useEffect, useCallback } from 'react';
import { alertsAPI } from '@/services/api';
import { Alert } from '@/types';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await alertsAPI.getAll();
      setAlerts(response.data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  const getExpiryAlerts = useCallback(() => {
    return alerts.filter(alert => alert.type === 'expiry');
  }, [alerts]);

  const getLowStockAlerts = useCallback(() => {
    return alerts.filter(alert => alert.type === 'low_stock');
  }, [alerts]);

  const getCriticalAlerts = useCallback(() => {
    return alerts.filter(alert => {
      if (alert.type === 'expiry') {
        return alert.days_left && alert.days_left <= 3;
      }
      if (alert.type === 'low_stock') {
        return alert.current_stock === 0;
      }
      return false;
    });
  }, [alerts]);

  const getAlertsByProductId = useCallback((productId: number) => {
    return alerts.filter(alert => alert.product_id === productId);
  }, [alerts]);

  const refreshAlerts = useCallback(async () => {
    await fetchAlerts();
  }, [fetchAlerts]);

  // Auto-refresh alerts every 30 seconds
  useEffect(() => {
    fetchAlerts();
    
    const interval = setInterval(() => {
      fetchAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return {
    alerts,
    loading,
    error,
    lastUpdated,
    fetchAlerts,
    getExpiryAlerts,
    getLowStockAlerts,
    getCriticalAlerts,
    getAlertsByProductId,
    refreshAlerts,
  };
}; 