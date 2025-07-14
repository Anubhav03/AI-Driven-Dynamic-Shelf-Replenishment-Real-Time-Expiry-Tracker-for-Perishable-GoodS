// Product types
export interface Product {
  id: number;
  name: string;
  barcode: string;
  category?: string;
  min_stock?: number;
  max_stock?: number;
}

export interface ProductCreate {
  name: string;
  barcode: string;
  category?: string;
  min_stock?: number;
  max_stock?: number;
}

export interface ProductUpdate {
  name?: string;
  barcode?: string;
  category?: string;
  min_stock?: number;
  max_stock?: number;
}

// Expiry types
export interface Expiry {
  id: number;
  product_id: number;
  expiry_date: string;
  image_path?: string;
  detected_text?: string;
  product?: Product;
}

export interface ExpiryCreate {
  product_id: number;
  expiry_date: string;
}

// Manual Expiry types
export interface ManualExpiry {
  id: number;
  product_id: number;
  expiry_date: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface ManualExpiryCreate {
  product_id: number;
  expiry_date: string;
  quantity?: number;
}

// Alert types
export interface Alert {
  type: 'expiry' | 'low_stock';
  product_id: number;
  current_stock?: number;
  min_stock?: number;
  expiry_date?: string;
  days_left?: number; // Changed from days_until_expiry to match backend
  product?: Product;
}

// Forecast types
export interface Forecast {
  product_id: number;
  forecast: number;
  product?: Product;
}

// Stock types
export interface Stock {
  id: number;
  product_id: number;
  current_stock: number;
  timestamp: string;
  product?: Product;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
} 