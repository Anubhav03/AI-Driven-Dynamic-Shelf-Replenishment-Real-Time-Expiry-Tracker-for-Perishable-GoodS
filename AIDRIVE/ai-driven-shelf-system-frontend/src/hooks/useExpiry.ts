import { useState, useEffect, useCallback } from 'react';
import { expiryAPI } from '@/services/api';
import { Expiry, ExpiryCreate, ManualExpiry, ManualExpiryCreate } from '@/types';

export const useExpiry = () => {
  const [expiryData, setExpiryData] = useState<Expiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpiryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await expiryAPI.getAll();
      setExpiryData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch expiry data');
    } finally {
      setLoading(false);
    }
  }, []);

  const addManualExpiry = useCallback(async (expiryData: ManualExpiryCreate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expiryAPI.addManual(expiryData);
      // Note: The response will be a ManualExpiry object, but we'll add it to the expiry list
      // You might want to create a separate state for manual expiry data
      setExpiryData(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add expiry data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const scanExpiryImage = useCallback(async (productId: number, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const response = await expiryAPI.scanImage(productId, file);
      setExpiryData(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to scan expiry image');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getExpiryByProductId = useCallback((productId: number) => {
    return expiryData.filter(expiry => expiry.product_id === productId);
  }, [expiryData]);

  const getExpiringSoon = useCallback((days: number = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return expiryData.filter(expiry => {
      const expiryDate = new Date(expiry.expiry_date);
      return expiryDate >= today && expiryDate <= futureDate;
    });
  }, [expiryData]);

  useEffect(() => {
    fetchExpiryData();
  }, [fetchExpiryData]);

  return {
    expiryData,
    loading,
    error,
    fetchExpiryData,
    addManualExpiry,
    scanExpiryImage,
    getExpiryByProductId,
    getExpiringSoon,
  };
};
