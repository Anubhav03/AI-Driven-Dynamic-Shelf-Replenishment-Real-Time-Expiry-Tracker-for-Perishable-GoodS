// API Configuration
export const API_CONFIG = {
  // Backend API URL - change this if your backend runs on a different port
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,
  
  // Headers for API requests
  HEADERS: {
    'Content-Type': 'application/json',
  },
  
  // Endpoints
  ENDPOINTS: {
    PRODUCTS: '/products/',
    ALERTS: '/alerts/',
    EXPIRY: '/expiry/',
    FORECAST: '/forecast/',
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to check if backend is available
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api/v1', '')}/docs`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}; 