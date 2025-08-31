import { AdminUser, AdminPermission, AdminAnalytics, AdminReport, BulkOperation, Product } from '../types';

// Admin Users
export const mockAdminUsers: AdminUser[] = [
  {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@yapee.com',
    role: 'admin',
    permissions: [
      {
        id: 'perm_products_manage',
        name: 'Quản lý sản phẩm',
        resource: 'products',
        action: 'manage',
        description: 'Quyền quản lý đầy đủ sản phẩm'
      },
      {
        id: 'perm_users_manage',
        name: 'Quản lý người dùng',
        resource: 'users',
        action: 'manage',
        description: 'Quyền quản lý người dùng'
      },
      {
        id: 'perm_orders_manage',
        name: 'Quản lý đơn hàng',
        resource: 'orders',
        action: 'manage',
        description: 'Quyền quản lý đơn hàng'
      },
      {
        id: 'perm_analytics_view',
        name: 'Xem báo cáo',
        resource: 'analytics',
        action: 'read',
        description: 'Quyền xem báo cáo phân tích'
      }
    ],
    lastLogin: '2024-12-20T10:30:00Z',
    createdBy: 'system',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'admin_2',
    name: 'Moderator User',
    email: 'moderator@yapee.com',
    role: 'moderator',
    permissions: [
      {
        id: 'perm_reviews_manage',
        name: 'Quản lý đánh giá',
        resource: 'reviews',
        action: 'manage',
        description: 'Quyền quản lý đánh giá sản phẩm'
      },
      {
        id: 'perm_users_read',
        name: 'Xem người dùng',
        resource: 'users',
        action: 'read',
        description: 'Quyền xem thông tin người dùng'
      }
    ],
    lastLogin: '2024-12-19T15:45:00Z',
    createdBy: 'admin_1',
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z'
  }
];

// Admin Permissions
export const mockPermissions: AdminPermission[] = [
  {
    id: 'perm_products_manage',
    name: 'Quản lý sản phẩm',
    resource: 'products',
    action: 'manage',
    description: 'Quyền quản lý đầy đủ sản phẩm (tạo, sửa, xóa)'
  },
  {
    id: 'perm_products_read',
    name: 'Xem sản phẩm',
    resource: 'products',
    action: 'read',
    description: 'Quyền xem danh sách sản phẩm'
  },
  {
    id: 'perm_users_manage',
    name: 'Quản lý người dùng',
    resource: 'users',
    action: 'manage',
    description: 'Quyền quản lý người dùng (kích hoạt, vô hiệu hóa)'
  },
  {
    id: 'perm_users_read',
    name: 'Xem người dùng',
    resource: 'users',
    action: 'read',
    description: 'Quyền xem thông tin người dùng'
  },
  {
    id: 'perm_orders_manage',
    name: 'Quản lý đơn hàng',
    resource: 'orders',
    action: 'manage',
    description: 'Quyền quản lý đơn hàng'
  },
  {
    id: 'perm_orders_read',
    name: 'Xem đơn hàng',
    resource: 'orders',
    action: 'read',
    description: 'Quyền xem đơn hàng'
  },
  {
    id: 'perm_analytics_view',
    name: 'Xem báo cáo',
    resource: 'analytics',
    action: 'read',
    description: 'Quyền xem báo cáo phân tích'
  },
  {
    id: 'perm_analytics_export',
    name: 'Xuất báo cáo',
    resource: 'analytics',
    action: 'read',
    description: 'Quyền xuất báo cáo'
  }
];

// Mock Analytics Data
export const mockAnalytics: AdminAnalytics = {
  sales: {
    totalRevenue: 125000000,
    totalOrders: 1250,
    averageOrderValue: 100000,
    conversionRate: 3.2,
    revenueByPeriod: [
      { date: '2024-12-01', revenue: 8500000 },
      { date: '2024-12-02', revenue: 9200000 },
      { date: '2024-12-03', revenue: 7800000 },
      { date: '2024-12-04', revenue: 10500000 },
      { date: '2024-12-05', revenue: 8900000 },
      { date: '2024-12-06', revenue: 11200000 },
      { date: '2024-12-07', revenue: 9800000 }
    ],
    ordersByPeriod: [
      { date: '2024-12-01', orders: 85 },
      { date: '2024-12-02', orders: 92 },
      { date: '2024-12-03', orders: 78 },
      { date: '2024-12-04', orders: 105 },
      { date: '2024-12-05', orders: 89 },
      { date: '2024-12-06', orders: 112 },
      { date: '2024-12-07', orders: 98 }
    ]
  },
  users: {
    totalUsers: 2500,
    newUsersToday: 15,
    activeUsersToday: 340,
    userGrowthRate: 8.5,
    userRegistrationsByPeriod: [
      { date: '2024-12-01', users: 8 },
      { date: '2024-12-02', users: 12 },
      { date: '2024-12-03', users: 6 },
      { date: '2024-12-04', users: 18 },
      { date: '2024-12-05', users: 9 },
      { date: '2024-12-06', users: 14 },
      { date: '2024-12-07', users: 15 }
    ],
    userActivityByPeriod: [
      { date: '2024-12-01', activeUsers: 280 },
      { date: '2024-12-02', activeUsers: 310 },
      { date: '2024-12-03', activeUsers: 290 },
      { date: '2024-12-04', activeUsers: 350 },
      { date: '2024-12-05', activeUsers: 320 },
      { date: '2024-12-06', activeUsers: 380 },
      { date: '2024-12-07', activeUsers: 340 }
    ]
  },
  products: {
    totalProducts: 150,
    topSellingProducts: [
      {
        product: {
          id: '1',
          name: 'iPhone 15 Pro Max',
          price: 32000000,
          image: '/images/products/iphone.jpg',
          description: 'iPhone 15 Pro Max 256GB',
          category: 'smartphones',
          brand: 'Apple',
          rating: 4.8,
          reviewCount: 1250,
          sold: 500,
          stock: 50,
          tags: ['premium', 'flagship'],
          images: ['/images/products/iphone.jpg'],
          specifications: { storage: '256GB', color: 'Titanium Blue' }
        },
        sales: 500
      },
      {
        product: {
          id: '2',
          name: 'Samsung Galaxy S24 Ultra',
          price: 28000000,
          image: '/images/products/samsung.jpg',
          description: 'Samsung Galaxy S24 Ultra',
          category: 'smartphones',
          brand: 'Samsung',
          rating: 4.6,
          reviewCount: 890,
          sold: 380,
          stock: 45,
          tags: ['android', 'premium'],
          images: ['/images/products/samsung.jpg'],
          specifications: { storage: '512GB', color: 'Titanium Black' }
        },
        sales: 380
      }
    ],
    lowStockProducts: [
      {
        id: '3',
        name: 'MacBook Pro M3',
        price: 45000000,
        image: '/images/products/macbook.jpg',
        description: 'MacBook Pro 14-inch M3 Chip',
        category: 'laptops',
        brand: 'Apple',
        rating: 4.9,
        reviewCount: 420,
        sold: 95,
        stock: 3,
        tags: ['premium', 'productivity'],
        images: ['/images/products/macbook.jpg'],
        specifications: { cpu: 'M3', ram: '16GB', storage: '512GB' }
      }
    ],
    averageRating: 4.4,
    productViewsByPeriod: [
      { date: '2024-12-01', views: 1500 },
      { date: '2024-12-02', views: 1800 },
      { date: '2024-12-03', views: 1650 },
      { date: '2024-12-04', views: 2100 },
      { date: '2024-12-05', views: 1900 },
      { date: '2024-12-06', views: 2300 },
      { date: '2024-12-07', views: 2000 }
    ]
  },
  system: {
    totalReviews: 2150,
    averageReviewRating: 4.3,
    wishlistItems: 850,
    serverUptime: 99.9
  }
};

// Mock Reports
export const mockReports: AdminReport[] = [
  {
    id: 'report_1',
    title: 'Báo cáo doanh thu tháng 12/2024',
    type: 'sales',
    dateRange: {
      start: '2024-12-01',
      end: '2024-12-31'
    },
    data: {
      totalRevenue: 125000000,
      totalOrders: 1250,
      averageOrderValue: 100000
    },
    generatedAt: '2024-12-20T08:00:00Z',
    generatedBy: 'admin_1'
  },
  {
    id: 'report_2',
    title: 'Phân tích hành vi người dùng',
    type: 'users',
    dateRange: {
      start: '2024-12-01',
      end: '2024-12-20'
    },
    data: {
      totalUsers: 2500,
      activeUsers: 340,
      conversionRate: 3.2
    },
    generatedAt: '2024-12-19T10:30:00Z',
    generatedBy: 'admin_1'
  }
];

// Mock Bulk Operations
export const mockBulkOperations: BulkOperation[] = [
  {
    type: 'update_price',
    target: 'products',
    items: ['1', '2', '3'],
    parameters: { discountPercentage: 10 },
    status: 'completed',
    progress: {
      completed: 3,
      total: 3,
      errors: []
    }
  },
  {
    type: 'activate',
    target: 'users',
    items: ['user1', 'user2', 'user3'],
    status: 'processing',
    progress: {
      completed: 2,
      total: 3,
      errors: []
    }
  }
];

// Helper functions
export function getAdminUsers(): AdminUser[] {
  return mockAdminUsers;
}

export function getAdminUser(id: string): AdminUser | undefined {
  return mockAdminUsers.find(user => user.id === id);
}

export function getPermissions(): AdminPermission[] {
  return mockPermissions;
}

export function getAnalytics(): AdminAnalytics {
  return mockAnalytics;
}

export function getReports(): AdminReport[] {
  return mockReports;
}

export function getBulkOperations(): BulkOperation[] {
  return mockBulkOperations;
}

export function hasPermission(userId: string, resource: string, action: string): boolean {
  const user = getAdminUser(userId);
  if (!user) return false;

  return user.permissions.some(perm =>
    perm.resource === resource && perm.action === action
  );
}

export function generateAnalyticsReport(type: 'sales' | 'users' | 'products'): AdminReport {
  const report: AdminReport = {
    id: `report_${Date.now()}`,
    title: `Báo cáo ${type === 'sales' ? 'doanh thu' : type === 'users' ? 'người dùng' : 'sản phẩm'} - ${new Date().toLocaleDateString('vi-VN')}`,
    type: type,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString()
    },
    data: type === 'sales' ? mockAnalytics.sales :
          type === 'users' ? mockAnalytics.users :
          mockAnalytics.products,
    generatedAt: new Date().toISOString(),
    generatedBy: 'admin_1'
  };

  return report;
}
