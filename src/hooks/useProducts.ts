import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

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

      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Filter by category
      if (categorySlug) {
        query = query.eq('categories.slug', categorySlug);
      }

      // Filter by search query
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform data to match our Product interface
      const transformedProducts: Product[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.original_price || undefined,
        discount: item.original_price ? Math.round(((item.original_price - item.price) / item.original_price) * 100) : undefined,
        image: item.images[0] || '',
        images: item.images,
        description: item.description || '',
        category: item.categories?.slug || '',
        brand: item.brand || '',
        rating: item.rating,
        reviewCount: item.review_count,
        sold: item.sold_count,
        stock: item.stock_quantity,
        tags: item.tags,
        specifications: item.specifications
      }));

      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
}