import axios from 'axios';
import { API_CONFIG } from '@/config/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const productsAPI = {
  getAll: () => api.get('/products/'),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products/', data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

export const expiryAPI = {
  getAll: () => api.get('/expiry/'),
  addManual: (data: any) => api.post('/expiry/manual', data),
  scanImage: (productId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/expiry/scan?product_id=${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const alertsAPI = {
  getAll: () => api.get('/alerts/'),
};

export const forecastAPI = {
  getAll: () => api.get('/forecast/'),
};

export default api;
