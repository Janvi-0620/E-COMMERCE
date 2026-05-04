import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, isLoading, error, refetch: fetchProduct };
};
