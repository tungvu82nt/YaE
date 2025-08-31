import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatusUpdate } from '../types';
import {
  mockOrders,
  getOrdersByUserId,
  getOrderById,
  getOrdersByStatus,
  getOrderStatusUpdates
} from '../data/mockOrders';

// Using Vite's import.meta.env instead of process.env for browser compatibility
const USE_MOCK_DATA = (import.meta.env?.DEV || true) && (import.meta.env?.VITE_USE_MOCK_DATA === 'true' || true);

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders
  const fetchOrders = useCallback(async (status?: Order['status']) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      if (USE_MOCK_DATA) {
        console.log('📦 Using mock data for orders');
        let userOrders = getOrdersByUserId(userId);

        if (status) {
          userOrders = userOrders.filter(order => order.status === status);
        }

        // Sort by created date (newest first)
        userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setOrders(userOrders);
      } else {
        // TODO: Implement real API call
        console.log('🔄 Fetching orders from API');
        // const result = await ApiClient.getUserOrders(userId, status);
        // setOrders(result);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Get single order
  const getOrder = useCallback(async (orderId: string): Promise<Order | null> => {
    try {
      if (USE_MOCK_DATA) {
        const order = getOrderById(orderId);
        return order || null;
      } else {
        // TODO: Implement real API call
        // return await ApiClient.getOrder(orderId);
        return null;
      }
    } catch (err) {
      console.error('Error getting order:', err);
      return null;
    }
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (
    orderId: string,
    newStatus: Order['status'],
    notes?: string
  ): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        // Update local mock data
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                  ...(newStatus === 'delivered' && { deliveredAt: new Date().toISOString() })
                }
              : order
          )
        );

        console.log(`✅ Order ${orderId} status updated to ${newStatus}`);
        return true;
      } else {
        // TODO: Implement real API call
        // return await ApiClient.updateOrderStatus(orderId, newStatus, notes);
        return false;
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      return false;
    }
  }, []);

  // Cancel order
  const cancelOrder = useCallback(async (orderId: string, reason?: string): Promise<boolean> => {
    return await updateOrderStatus(orderId, 'cancelled', reason);
  }, [updateOrderStatus]);

  // Get order status updates
  const getOrderUpdates = useCallback(async (orderId: string): Promise<OrderStatusUpdate[]> => {
    try {
      if (USE_MOCK_DATA) {
        return getOrderStatusUpdates(orderId);
      } else {
        // TODO: Implement real API call
        // return await ApiClient.getOrderStatusUpdates(orderId);
        return [];
      }
    } catch (err) {
      console.error('Error getting order updates:', err);
      return [];
    }
  }, []);

  // Get orders by status
  const getOrdersByStatusFilter = useCallback(async (status: Order['status']): Promise<Order[]> => {
    if (!userId) return [];

    try {
      if (USE_MOCK_DATA) {
        return getOrdersByUserId(userId).filter(order => order.status === status);
      } else {
        // TODO: Implement real API call
        return [];
      }
    } catch (err) {
      console.error('Error filtering orders by status:', err);
      return [];
    }
  }, [userId]);

  // Refresh orders
  const refreshOrders = useCallback(async () => {
    await fetchOrders();
  }, [fetchOrders]);

  // Auto-fetch orders when userId changes
  useEffect(() => {
    if (userId) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [userId, fetchOrders]);

  // Statistics
  const getOrderStats = useCallback(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
    const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'confirmed' || order.status === 'processing').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

    return {
      totalOrders,
      totalSpent,
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
      deliveryRate: totalOrders > 0 ? (deliveredOrders / totalOrders * 100).toFixed(1) : '0'
    };
  }, [orders]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderUpdates,
    getOrdersByStatusFilter,
    refreshOrders,
    getOrderStats
  };
}

// Hook for admin order management
export function useAdminOrders() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all orders for admin
  const fetchAllOrders = useCallback(async (status?: Order['status']) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      if (USE_MOCK_DATA) {
        console.log('📦 Admin: Using mock data for all orders');
        let orders = [...mockOrders];

        if (status) {
          orders = orders.filter(order => order.status === status);
        }

        // Sort by created date (newest first)
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setAllOrders(orders);
      } else {
        // TODO: Implement real API call
        console.log('🔄 Admin: Fetching all orders from API');
        // const result = await ApiClient.getAllOrders(status);
        // setAllOrders(result);
      }
    } catch (err) {
      console.error('Error fetching all orders:', err);
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update order status (admin)
  const updateOrderStatus = useCallback(async (
    orderId: string,
    newStatus: Order['status'],
    notes?: string
  ): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        // Update local mock data
        setAllOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                  ...(newStatus === 'delivered' && { deliveredAt: new Date().toISOString() })
                }
              : order
          )
        );

        console.log(`✅ Admin: Order ${orderId} status updated to ${newStatus}`);
        return true;
      } else {
        // TODO: Implement real API call
        // return await ApiClient.adminUpdateOrderStatus(orderId, newStatus, notes);
        return false;
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      return false;
    }
  }, []);

  // Bulk update orders
  const bulkUpdateOrders = useCallback(async (
    orderIds: string[],
    newStatus: Order['status'],
    notes?: string
  ): Promise<boolean> => {
    try {
      const promises = orderIds.map(orderId =>
        updateOrderStatus(orderId, newStatus, notes)
      );

      const results = await Promise.all(promises);
      return results.every(result => result);
    } catch (err) {
      console.error('Error bulk updating orders:', err);
      return false;
    }
  }, [updateOrderStatus]);

  // Get admin statistics
  const getAdminStats = useCallback(() => {
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = allOrders.filter(order => order.status === 'pending').length;
    const processingOrders = allOrders.filter(order => order.status === 'processing').length;
    const shippingOrders = allOrders.filter(order => order.status === 'shipping').length;
    const deliveredOrders = allOrders.filter(order => order.status === 'delivered').length;
    const cancelledOrders = allOrders.filter(order => order.status === 'cancelled').length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippingOrders,
      deliveredOrders,
      cancelledOrders,
      activeOrders: pendingOrders + processingOrders + shippingOrders
    };
  }, [allOrders]);

  // Auto-fetch all orders on mount
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  return {
    allOrders,
    loading,
    error,
    fetchAllOrders,
    updateOrderStatus,
    bulkUpdateOrders,
    getAdminStats
  };
}