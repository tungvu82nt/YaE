import { useState, useEffect, useCallback } from 'react';
import {
  AdminUser,
  AdminPermission,
  AdminAnalytics,
  AdminReport,
  BulkOperation,
  ProductFormData,
  Product
} from '../types';
import {
  mockAdminUsers,
  getAdminUsers,
  getAdminUser,
  getPermissions,
  getAnalytics,
  getReports,
  getBulkOperations,
  hasPermission,
  generateAnalyticsReport
} from '../data/mockAdminData';
import { mockProducts } from './mockProducts';

// Using Vite's import.meta.env instead of process.env for browser compatibility
const USE_MOCK_DATA = (import.meta.env?.DEV || true) && (import.meta.env?.VITE_USE_MOCK_DATA === 'true' || true);

export function useAdmin() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load admin data
  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      if (USE_MOCK_DATA) {
        setAdminUsers(getAdminUsers());
        setPermissions(getPermissions());
        setAnalytics(getAnalytics());
        setReports(getReports());
        setBulkOperations(getBulkOperations());
      } else {
        // TODO: Implement real API calls
        console.log('🔄 Loading admin data from API');
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Không thể tải dữ liệu admin');
    } finally {
      setLoading(false);
    }
  }, []);

  // Product Management Functions
  const createProduct = useCallback(async (productData: ProductFormData): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        const newProduct: Product = {
          id: `product_${Date.now()}`,
          name: productData.name,
          price: productData.price,
          originalPrice: productData.originalPrice,
          image: productData.images[0] || '/images/products/default.jpg',
          description: productData.description,
          category: productData.category,
          brand: productData.brand,
          rating: 0,
          reviewCount: 0,
          sold: 0,
          stock: productData.stock,
          tags: productData.tags,
          images: productData.images,
          specifications: productData.specifications,
          isActive: productData.isActive
        };

        // In a real app, this would update the global state
        console.log('✅ Product created successfully:', newProduct);
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error creating product:', err);
      return false;
    }
  }, []);

  const updateProduct = useCallback(async (productId: string, updates: Partial<ProductFormData>): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        // Find and update product in mock data
        console.log('✅ Product updated successfully:', productId, updates);
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error updating product:', err);
      return false;
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        console.log('✅ Product deleted successfully:', productId);
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      return false;
    }
  }, []);

  const bulkUpdateProducts = useCallback(async (operation: BulkOperation): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        // Simulate bulk operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ Bulk operation completed:', operation.type, operation.items.length);
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error in bulk operation:', err);
      return false;
    }
  }, []);

  // User Management Functions
  const updateUserRole = useCallback(async (userId: string, role: AdminUser['role']): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        setAdminUsers(prev => prev.map(user =>
          user.id === userId ? { ...user, role } : user
        ));
        console.log('✅ User role updated successfully');
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      return false;
    }
  }, []);

  const toggleUserStatus = useCallback(async (userId: string): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        setAdminUsers(prev => prev.map(user =>
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        ));
        console.log('✅ User status updated successfully');
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error toggling user status:', err);
      return false;
    }
  }, []);

  const resetUserPassword = useCallback(async (userId: string): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        console.log('✅ Password reset email sent to user:', userId);
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      return false;
    }
  }, []);

  // Analytics Functions
  const generateReport = useCallback(async (type: AdminReport['type']): Promise<AdminReport | null> => {
    try {
      if (USE_MOCK_DATA) {
        const report = generateAnalyticsReport(type);
        setReports(prev => [report, ...prev]);
        console.log('✅ Report generated successfully');
        return report;
      } else {
        // TODO: Implement real API call
        return null;
      }
    } catch (err) {
      console.error('Error generating report:', err);
      return null;
    }
  }, []);

  const exportData = useCallback(async (format: 'csv' | 'excel' | 'pdf', data: any): Promise<boolean> => {
    try {
      if (USE_MOCK_DATA) {
        // Simulate export
        console.log(`✅ Data exported as ${format}:`, data);
        // In a real app, this would trigger a download
        return true;
      } else {
        // TODO: Implement real API call
        return false;
      }
    } catch (err) {
      console.error('Error exporting data:', err);
      return false;
    }
  }, []);

  // Permission Check
  const checkPermission = useCallback((userId: string, resource: string, action: string): boolean => {
    return hasPermission(userId, resource, action);
  }, []);

  // Auto-load data on mount
  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  return {
    // State
    adminUsers,
    permissions,
    analytics,
    reports,
    bulkOperations,
    loading,
    error,

    // Product Management
    createProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateProducts,

    // User Management
    updateUserRole,
    toggleUserStatus,
    resetUserPassword,

    // Analytics
    generateReport,
    exportData,

    // Permissions
    checkPermission,

    // Utils
    loadAdminData
  };
}
