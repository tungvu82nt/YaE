import { useState, useEffect } from 'react';
import { Product } from '../types';
import { products as mockProducts } from '../data/mockData';
import ApiClient from '../services/apiClient';

// Check if we should use mock data
// Using Vite's import.meta.env instead of process.env for browser compatibility
const USE_MOCK_DATA = (import.meta.env?.DEV || true) && (import.meta.env?.VITE_USE_MOCK_DATA === 'true' || true);

export function useProducts(categorySlug?: string, searchQuery?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [categorySlug, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data for development
        console.log('📊 Using mock data for products');
        let filteredProducts = [...mockProducts];

        // Apply category filter
        if (categorySlug) {
          filteredProducts = filteredProducts.filter(product => product.category === categorySlug);
        }

        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
          );
        }

        setProducts(filteredProducts);
      } else {
        // Try to fetch from database
        const filters = {};
        if (categorySlug) filters.category = categorySlug;
        if (searchQuery) filters.search = searchQuery;

        const result = await ApiClient.getProducts(filters);

        if (result.error) {
          console.warn('Database fetch failed, falling back to mock data:', result.error);
          // Fallback to mock data
          let filteredProducts = [...mockProducts];

          // Apply category filter
          if (categorySlug) {
            filteredProducts = filteredProducts.filter(product => product.category === categorySlug);
          }

          // Apply search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
              product.name.toLowerCase().includes(query) ||
              product.brand.toLowerCase().includes(query) ||
              product.description.toLowerCase().includes(query)
            );
          }

          setProducts(filteredProducts);
        } else {
          setProducts(result.data);
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      // Final fallback to mock data
      let filteredProducts = [...mockProducts];

      if (categorySlug) {
        filteredProducts = filteredProducts.filter(product => product.category === categorySlug);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }

      setProducts(filteredProducts);
      setError('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
}