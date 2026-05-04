import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/products`, { params });
      if (response.data.success) {
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      // Fallback to demo data if API fails (for development)
      if (import.meta.env.DEV) {
        console.warn('Backend API not reachable, using demo data fallback');
      }
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, pagination, isLoading, error, refetch: fetchProducts };
};
