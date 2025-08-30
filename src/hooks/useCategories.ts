import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

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

      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      // Transform data to match our Category interface
      const transformedCategories: Category[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        icon: item.icon || 'Package',
        slug: item.slug,
        parentId: item.parent_id || undefined
      }));

      setCategories(transformedCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
}