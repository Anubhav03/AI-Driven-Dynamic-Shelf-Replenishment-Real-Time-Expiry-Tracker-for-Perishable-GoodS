import { useState, useEffect, useCallback } from 'react';
import { forecastAPI } from '@/services/api';
import { Forecast } from '@/types';

export const useForecast = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchForecasts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await forecastAPI.getAll();
      setForecasts(response.data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch forecasts');
    } finally {
      setLoading(false);
    }
  }, []);

  const getForecastByProductId = useCallback((productId: number) => {
    return forecasts.find(forecast => forecast.product_id === productId);
  }, [forecasts]);

  const getTopForecasts = useCallback((limit: number = 10) => {
    return forecasts
      .sort((a, b) => b.forecast - a.forecast)
      .slice(0, limit);
  }, [forecasts]);

  const getLowForecasts = useCallback((limit: number = 10) => {
    return forecasts
      .sort((a, b) => a.forecast - b.forecast)
      .slice(0, limit);
  }, [forecasts]);

  const refreshForecasts = useCallback(async () => {
    await fetchForecasts();
  }, [fetchForecasts]);

  useEffect(() => {
    fetchForecasts();
  }, [fetchForecasts]);

  return {
    forecasts,
    loading,
    error,
    lastUpdated,
    fetchForecasts,
    getForecastByProductId,
    getTopForecasts,
    getLowForecasts,
    refreshForecasts,
  };
};
