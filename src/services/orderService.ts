import { supabase } from '../lib/supabase';
import { CartItem, Order } from '../types';

export class OrderService {
  static async createOrder(
    userId: string,
    items: CartItem[],
    shippingAddress: any,
    paymentMethod: string
  ) {
    try {
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
          shipping_address: shippingAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

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

      if (itemsError) throw itemsError;

      // Update product stock and sold count
      for (const item of items) {
        const { error: stockError } = await supabase
          .rpc('update_product_stock', {
            product_id: item.product.id,
            quantity_sold: item.quantity
          });

        if (stockError) {
          console.error('Error updating stock for product:', item.product.id, stockError);
        }
      }

      return { data: order, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Failed to create order' };
    }
  }

  static async getUserOrders(userId: string) {
    try {
      const { data, error } = await supabase
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

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch orders' };
    }
  }

  static async updateOrderStatus(orderId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Failed to update order status' };
    }
  }

  static async getOrderStatistics() {
    try {
      const { data, error } = await supabase
        .rpc('get_order_statistics');

      if (error) throw error;

      return { data: data?.[0] || null, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Failed to get statistics' };
    }
  }
}