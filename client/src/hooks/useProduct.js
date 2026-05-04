import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const demoProducts = [
  {
    id: '1',
    name: 'Classic Chronograph',
    category: 'Watches',
    price: 1250,
    ratings: { average: 4.8, count: 124 },
    stock: 15,
    description: 'A timeless classic chronograph watch featuring a premium leather strap and a scratch-resistant sapphire crystal face. Perfect for both formal and casual occasions.',
    isFeatured: true,
    brand: 'LuxeTime',
    images: [{ url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400&h=500' }]
  },
  {
    id: '2',
    name: 'Pro Wireless Headphones',
    category: 'Audio',
    price: 349,
    ratings: { average: 4.9, count: 312 },
    stock: 42,
    description: 'Industry-leading noise cancellation combined with high-fidelity audio. These wireless headphones deliver an immersive sound experience that lasts all day.',
    brand: 'Acoustics',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=500' }]
  },
  {
    id: '3',
    name: 'Minimalist Wallet',
    category: 'Accessories',
    price: 89,
    ratings: { average: 4.5, count: 89 },
    stock: 100,
    description: 'Ultra-slim leather wallet designed to hold your essential cards and cash without the bulk. RFID-blocking technology keeps your information secure.',
    brand: 'Essentials',
    images: [{ url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400&h=500' }]
  },
  {
    id: '4',
    name: 'Smart Desk Lamp',
    category: 'Gadgets',
    price: 199,
    ratings: { average: 4.7, count: 56 },
    stock: 28,
    description: 'Adjustable color temperature and brightness via app control. Features a built-in wireless charging pad for your devices.',
    brand: 'Lumina',
    images: [{ url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=400&h=500' }]
  }
];

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
      // Fallback to demo data
      const demoMatch = demoProducts.find(p => p.id === id);
      if (demoMatch) {
        setProduct(demoMatch);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch product');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, isLoading, error, refetch: fetchProduct };
};
