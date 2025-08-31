import { useState, useEffect } from 'react';
import { Category } from '../types';
import { categories as mockCategories } from '../data/mockData';
import ApiClient from '../services/apiClient';

// Check if we should use mock data
// Using Vite's import.meta.env instead of process.env for browser compatibility
const USE_MOCK_DATA = (import.meta.env?.DEV || true) && (import.meta.env?.VITE_USE_MOCK_DATA === 'true' || true);

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK_DATA) {
        // Use mock data for development
        console.log('📂 Using mock data for categories');
        setCategories(mockCategories);
      } else {
        // Try to fetch from database
        const result = await ApiClient.getCategories();

        if (result.error) {
          console.warn('Database fetch failed, falling back to mock data:', result.error);
          // Fallback to mock data
          setCategories(mockCategories);
        } else {
          setCategories(result.data);
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Final fallback to mock data
      setCategories(mockCategories);
      setError('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
}