import { format, differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns';

// Date utilities
export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy') => {
  try {
    return format(new Date(date), formatStr);
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string | Date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const getDaysUntilExpiry = (expiryDate: string | Date) => {
  try {
    const today = startOfDay(new Date());
    const expiry = startOfDay(new Date(expiryDate));
    return differenceInDays(expiry, today);
  } catch {
    return null;
  }
};

export const isExpired = (expiryDate: string | Date) => {
  try {
    const today = startOfDay(new Date());
    const expiry = startOfDay(new Date(expiryDate));
    return isBefore(expiry, today);
  } catch {
    return false;
  }
};

export const isExpiringSoon = (expiryDate: string | Date, days: number = 7) => {
  try {
    const today = startOfDay(new Date());
    const expiry = startOfDay(new Date(expiryDate));
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return isAfter(expiry, today) && isBefore(expiry, futureDate);
  } catch {
    return false;
  }
};

// String utilities
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number = 50) => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

// Validation utilities
export const isValidBarcode = (barcode: string) => {
  // Basic barcode validation (can be enhanced based on specific requirements)
  return /^[0-9]{8,13}$/.test(barcode);
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// File utilities
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidImageFile = (file: File) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
};

// Color utilities for status indicators
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'critical':
    case 'expired':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'warning':
    case 'expiring_soon':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'good':
    case 'normal':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getAlertTypeColor = (type: string) => {
  switch (type) {
    case 'expiry':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'low_stock':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Number formatting
export const formatNumber = (num: number, decimals: number = 0) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};
