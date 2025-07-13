import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '@/services/api';
import { Product, ProductCreate, ProductUpdate } from '@/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData: ProductCreate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.create(productData);
      setProducts(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: number, productData: ProductUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.update(id, productData);
      setProducts(prev => prev.map(product => 
        product.id === id ? response.data : product
      ));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductById = useCallback((id: number) => {
    return products.find(product => product.id === id);
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  };
}; 