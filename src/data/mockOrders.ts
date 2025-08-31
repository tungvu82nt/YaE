import { Order, OrderItem, OrderStatusUpdate, ShippingProvider } from '../types';

export const mockShippingProviders: ShippingProvider[] = [
  {
    id: 'ghtk',
    name: 'Giao Hàng Tiết Kiệm',
    code: 'GHTK',
    logo: '/images/shipping/ghtk.png',
    trackingUrl: 'https://khachhang.ghtk.vn/tracking',
    estimatedDeliveryDays: 3
  },
  {
    id: 'ghn',
    name: 'Giao Hàng Nhanh',
    code: 'GHN',
    logo: '/images/shipping/ghn.png',
    trackingUrl: 'https://donhang.ghn.vn/',
    estimatedDeliveryDays: 2
  },
  {
    id: 'vnpost',
    name: 'Vietnam Post',
    code: 'VNPOST',
    logo: '/images/shipping/vnpost.png',
    trackingUrl: 'https://www.vnpost.vn/',
    estimatedDeliveryDays: 5
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD_1734567890123',
    userId: 'user1',
    userName: 'Nguyễn Văn A',
    items: [
      {
        product: {
          id: '1',
          name: 'iPhone 15 Pro Max',
          price: 32000000,
          image: '/images/products/iphone15.jpg',
          description: 'iPhone 15 Pro Max 256GB',
          category: 'smartphones',
          brand: 'Apple',
          rating: 4.8,
          reviewCount: 1250,
          sold: 500,
          stock: 50,
          tags: ['premium', 'flagship'],
          images: ['/images/products/iphone15.jpg'],
          specifications: { storage: '256GB', color: 'Titanium Blue' }
        },
        quantity: 1,
        price: 32000000
      }
    ],
    subtotal: 32000000,
    shippingFee: 25000,
    total: 32025000,
    paymentMethod: 'bank_transfer',
    status: 'delivered',
    shippingAddress: {
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      address: '123 Đường ABC',
      ward: 'Phường 1',
      district: 'Quận 1',
      city: 'TP.HCM'
    },
    trackingNumber: 'GHTK123456789',
    shippingProvider: 'Giao Hàng Tiết Kiệm',
    estimatedDelivery: '2024-12-25',
    notes: 'Giao hàng cẩn thận',
    createdAt: '2024-12-19T10:30:00Z',
    updatedAt: '2024-12-25T14:20:00Z',
    deliveredAt: '2024-12-25T14:20:00Z'
  },
  {
    id: 'ORD_1734557890123',
    userId: 'user1',
    userName: 'Nguyễn Văn A',
    items: [
      {
        product: {
          id: '2',
          name: 'Samsung Galaxy S24 Ultra',
          price: 28000000,
          image: '/images/products/s24ultra.jpg',
          description: 'Samsung Galaxy S24 Ultra 512GB',
          category: 'smartphones',
          brand: 'Samsung',
          rating: 4.7,
          reviewCount: 890,
          sold: 320,
          stock: 30,
          tags: ['premium', 'android'],
          images: ['/images/products/s24ultra.jpg'],
          specifications: { storage: '512GB', color: 'Titanium Black' }
        },
        quantity: 1,
        price: 28000000
      },
      {
        product: {
          id: '3',
          name: 'AirPods Pro 2',
          price: 5500000,
          image: '/images/products/airpods.jpg',
          description: 'AirPods Pro 2nd Generation',
          category: 'audio',
          brand: 'Apple',
          rating: 4.6,
          reviewCount: 650,
          sold: 180,
          stock: 25,
          tags: ['wireless', 'premium'],
          images: ['/images/products/airpods.jpg'],
          specifications: { battery: '6 hours', noise_cancelling: 'Active' }
        },
        quantity: 1,
        price: 5500000
      }
    ],
    subtotal: 33500000,
    shippingFee: 0, // Free shipping
    total: 33500000,
    paymentMethod: 'cod',
    status: 'shipping',
    shippingAddress: {
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      address: '123 Đường ABC',
      ward: 'Phường 1',
      district: 'Quận 1',
      city: 'TP.HCM'
    },
    trackingNumber: 'GHN987654321',
    shippingProvider: 'Giao Hàng Nhanh',
    estimatedDelivery: '2024-12-23',
    createdAt: '2024-12-18T15:45:00Z',
    updatedAt: '2024-12-20T09:15:00Z'
  },
  {
    id: 'ORD_1734547890123',
    userId: 'user1',
    userName: 'Nguyễn Văn A',
    items: [
      {
        product: {
          id: '4',
          name: 'MacBook Pro M3',
          price: 45000000,
          image: '/images/products/macbook.jpg',
          description: 'MacBook Pro 14-inch M3 Chip',
          category: 'laptops',
          brand: 'Apple',
          rating: 4.9,
          reviewCount: 420,
          sold: 95,
          stock: 15,
          tags: ['premium', 'productivity'],
          images: ['/images/products/macbook.jpg'],
          specifications: { cpu: 'M3', ram: '16GB', storage: '512GB' }
        },
        quantity: 1,
        price: 45000000
      }
    ],
    subtotal: 45000000,
    shippingFee: 0, // Free shipping
    total: 45000000,
    paymentMethod: 'bank_transfer',
    status: 'processing',
    shippingAddress: {
      name: 'Nguyễn Văn A',
      phone: '0987654321',
      address: '123 Đường ABC',
      ward: 'Phường 1',
      district: 'Quận 1',
      city: 'TP.HCM'
    },
    notes: 'Giao hàng trong giờ hành chính',
    createdAt: '2024-12-17T11:20:00Z',
    updatedAt: '2024-12-19T16:30:00Z'
  },
  {
    id: 'ORD_1734537890123',
    userId: 'user2',
    userName: 'Trần Thị B',
    items: [
      {
        product: {
          id: '5',
          name: 'iPad Air 5',
          price: 18000000,
          image: '/images/products/ipad.jpg',
          description: 'iPad Air 5th Generation 64GB',
          category: 'tablets',
          brand: 'Apple',
          rating: 4.5,
          reviewCount: 380,
          sold: 120,
          stock: 20,
          tags: ['tablet', 'student'],
          images: ['/images/products/ipad.jpg'],
          specifications: { storage: '64GB', color: 'Space Gray' }
        },
        quantity: 1,
        price: 18000000
      }
    ],
    subtotal: 18000000,
    shippingFee: 25000,
    total: 18025000,
    paymentMethod: 'cash',
    status: 'confirmed',
    shippingAddress: {
      name: 'Trần Thị B',
      phone: '0978123456',
      address: '456 Đường XYZ',
      ward: 'Phường 2',
      district: 'Quận 3',
      city: 'TP.HCM'
    },
    createdAt: '2024-12-16T13:10:00Z',
    updatedAt: '2024-12-18T10:45:00Z'
  },
  {
    id: 'ORD_1734527890123',
    userId: 'user3',
    userName: 'Lê Văn C',
    items: [
      {
        product: {
          id: '6',
          name: 'Dell XPS 13',
          price: 35000000,
          image: '/images/products/dellxps.jpg',
          description: 'Dell XPS 13 9340',
          category: 'laptops',
          brand: 'Dell',
          rating: 4.4,
          reviewCount: 290,
          sold: 75,
          stock: 12,
          tags: ['ultrabook', 'business'],
          images: ['/images/products/dellxps.jpg'],
          specifications: { cpu: 'Intel i7', ram: '16GB', storage: '512GB SSD' }
        },
        quantity: 1,
        price: 35000000
      }
    ],
    subtotal: 35000000,
    shippingFee: 0, // Free shipping
    total: 35000000,
    paymentMethod: 'bank_transfer',
    status: 'cancelled',
    shippingAddress: {
      name: 'Lê Văn C',
      phone: '0967234567',
      address: '789 Đường DEF',
      ward: 'Phường 3',
      district: 'Quận 7',
      city: 'TP.HCM'
    },
    notes: 'Khách hàng hủy đơn',
    createdAt: '2024-12-15T09:30:00Z',
    updatedAt: '2024-12-16T14:20:00Z'
  }
];

export const mockOrderStatusUpdates: OrderStatusUpdate[] = [
  {
    orderId: 'ORD_1734567890123',
    oldStatus: 'shipping',
    newStatus: 'delivered',
    updatedBy: 'admin',
    notes: 'Đơn hàng đã được giao thành công',
    timestamp: '2024-12-25T14:20:00Z'
  },
  {
    orderId: 'ORD_1734557890123',
    oldStatus: 'processing',
    newStatus: 'shipping',
    updatedBy: 'admin',
    notes: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển',
    timestamp: '2024-12-20T09:15:00Z'
  },
  {
    orderId: 'ORD_1734547890123',
    oldStatus: 'confirmed',
    newStatus: 'processing',
    updatedBy: 'admin',
    notes: 'Đơn hàng đang được xử lý',
    timestamp: '2024-12-19T16:30:00Z'
  },
  {
    orderId: 'ORD_1734537890123',
    oldStatus: 'pending',
    newStatus: 'confirmed',
    updatedBy: 'admin',
    notes: 'Đơn hàng đã được xác nhận',
    timestamp: '2024-12-18T10:45:00Z'
  }
];

// Helper functions
export function getOrdersByUserId(userId: string): Order[] {
  return mockOrders.filter(order => order.userId === userId);
}

export function getOrderById(orderId: string): Order | undefined {
  return mockOrders.find(order => order.id === orderId);
}

export function getOrdersByStatus(status: Order['status']): Order[] {
  return mockOrders.filter(order => order.status === status);
}

export function getOrderStatusUpdates(orderId: string): OrderStatusUpdate[] {
  return mockOrderStatusUpdates.filter(update => update.orderId === orderId);
}
