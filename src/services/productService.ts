import { supabase } from '../lib/supabase';
import { Product } from '../types';

export class ProductService {
  static async getProducts(filters?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('is_active', true);

      if (filters?.category) {
        query = query.eq('categories.slug', filters.category);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch products' };
    }
  }

  static async getProductById(id: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          ),
          reviews (
            *,
            profiles (
              full_name
            )
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Product not found' };
    }
  }

  static async createProduct(product: Partial<Product>) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name!,
          slug: product.name!.toLowerCase().replace(/\s+/g, '-'),
          description: product.description,
          price: product.price!,
          original_price: product.originalPrice,
          brand: product.brand,
          stock_quantity: product.stock || 0,
          images: product.images || [],
          specifications: product.specifications || {},
          tags: product.tags || []
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Failed to create product' };
    }
  }

  static async updateProduct(id: string, updates: Partial<Product>) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          original_price: updates.originalPrice,
          brand: updates.brand,
          stock_quantity: updates.stock,
          images: updates.images,
          specifications: updates.specifications,
          tags: updates.tags
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Failed to update product' };
    }
  }

  static async deleteProduct(id: string) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to delete product' };
    }
  }

  static async getRecommendations(productId: string, limit = 4) {
    try {
      const { data, error } = await supabase
        .rpc('get_product_recommendations', {
          current_product_id: productId,
          limit_count: limit
        });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error instanceof Error ? error.message : 'Failed to get recommendations' };
    }
  }
}