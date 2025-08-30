import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Order, CartItem } from '../types';

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transform data to match our Order interface
      const transformedOrders: Order[] = (data || []).map(order => ({
        id: order.id,
        userId: order.user_id,
        items: order.order_items.map((item: any) => ({
          product: {
            id: item.products.id,
            name: item.products.name,
            price: item.unit_price,
            image: item.products.images[0] || '',
            images: item.products.images,
            description: item.products.description || '',
            category: '', // Will be populated if needed
            brand: item.products.brand || '',
            rating: item.products.rating,
            reviewCount: item.products.review_count,
            sold: item.products.sold_count,
            stock: item.products.stock_quantity,
            tags: item.products.tags,
            specifications: item.products.specifications
          },
          quantity: item.quantity
        })),
        total: order.total_amount,
        status: order.status,
        createdAt: order.created_at,
        shippingAddress: order.shipping_address
      }));

      setOrders(transformedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (items: CartItem[], shippingAddress: any, paymentMethod: string) => {
    try {
      if (!userId) {
        throw new Error('User must be logged in to create order');
      }

      const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const shippingFee = totalAmount >= 500000 ? 0 : 25000; // Free shipping for orders over 500k VND

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: totalAmount + shippingFee,
          shipping_fee: shippingFee,
          payment_method: paymentMethod,
          shipping_address: shippingAddress
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      // Update product sold count and stock
      for (const item of items) {
        await supabase.rpc('update_product_stock', {
          product_id: item.product.id,
          quantity_sold: item.quantity
        });
      }

      await fetchOrders();
      return { data: order, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Order creation failed' };
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    refetch: fetchOrders
  };
}