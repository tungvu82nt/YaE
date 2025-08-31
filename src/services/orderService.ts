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

      // Create order object
      const order: Order = {
        id: `order_${Date.now()}`,
        userId: userId,
        items: items,
        total: totalAmount + shippingFee,
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress: shippingAddress
      };

      // Save to localStorage
      const savedOrders = localStorage.getItem(`orders_${userId}`);
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.unshift(order); // Add to beginning
      localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));

      // Clear cart
      localStorage.removeItem('yapee_cart');

      return { data: order, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Failed to create order' };
    }
  }

  static async getUserOrders(userId: string) {
    try {
      // Get orders from localStorage
      const savedOrders = localStorage.getItem(`orders_${userId}`);
      const orders = savedOrders ? JSON.parse(savedOrders) : [];

      return { data: orders, error: null };
    } catch (error) {
      return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch orders' };
    }
  }

  static async updateOrderStatus(orderId: string, status: string) {
    try {
      // This would need userId in real implementation
      // For demo, we'll search through all users' orders
      const keys = Object.keys(localStorage).filter(key => key.startsWith('orders_'));

      for (const key of keys) {
        const orders = JSON.parse(localStorage.getItem(key) || '[]');
        const updatedOrders = orders.map((order: Order) =>
          order.id === orderId ? { ...order, status } : order
        );

        if (JSON.stringify(updatedOrders) !== localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify(updatedOrders));
          return { data: updatedOrders.find((o: Order) => o.id === orderId), error: null };
        }
      }

      return { data: null, error: 'Order not found' };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Failed to update order status' };
    }
  }

  static async getOrderStatistics() {
    try {
      // This would need to aggregate from all orders
      // For demo, return basic stats
      return {
        data: {
          total_orders: 0,
          total_revenue: 0,
          pending_orders: 0,
          completed_orders: 0
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Failed to get statistics' };
    }
  }
}