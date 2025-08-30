import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          parent_id: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          price: number;
          original_price: number | null;
          category_id: string | null;
          brand: string | null;
          sku: string | null;
          stock_quantity: number;
          sold_count: number;
          rating: number;
          review_count: number;
          images: string[];
          specifications: Record<string, string>;
          tags: string[];
          is_active: boolean;
          seller_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          price: number;
          original_price?: number | null;
          category_id?: string | null;
          brand?: string | null;
          sku?: string | null;
          stock_quantity?: number;
          sold_count?: number;
          rating?: number;
          review_count?: number;
          images?: string[];
          specifications?: Record<string, string>;
          tags?: string[];
          is_active?: boolean;
          seller_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          price?: number;
          original_price?: number | null;
          category_id?: string | null;
          brand?: string | null;
          sku?: string | null;
          stock_quantity?: number;
          sold_count?: number;
          rating?: number;
          review_count?: number;
          images?: string[];
          specifications?: Record<string, string>;
          tags?: string[];
          is_active?: boolean;
          seller_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';
          total_amount: number;
          shipping_fee: number;
          discount_amount: number;
          payment_method: string | null;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          shipping_address: Record<string, any>;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';
          total_amount: number;
          shipping_fee?: number;
          discount_amount?: number;
          payment_method?: string | null;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          shipping_address: Record<string, any>;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';
          total_amount?: number;
          shipping_fee?: number;
          discount_amount?: number;
          payment_method?: string | null;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          shipping_address?: Record<string, any>;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          order_id: string | null;
          rating: number;
          title: string | null;
          comment: string | null;
          images: string[];
          is_verified_purchase: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          order_id?: string | null;
          rating: number;
          title?: string | null;
          comment?: string | null;
          images?: string[];
          is_verified_purchase?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          order_id?: string | null;
          rating?: number;
          title?: string | null;
          comment?: string | null;
          images?: string[];
          is_verified_purchase?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}