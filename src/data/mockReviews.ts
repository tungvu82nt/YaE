import { Review, UserProfile, WishlistItem, Wishlist, ReviewStats } from '../types';

export const mockReviews: Review[] = [
  {
    id: 'review_1',
    productId: '1',
    userId: 'user1',
    userName: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Sản phẩm rất tốt, chất lượng vượt trội so với giá tiền. Giao hàng nhanh chóng và đóng gói cẩn thận.',
    images: ['/images/reviews/iphone1.jpg', '/images/reviews/iphone2.jpg'],
    verifiedPurchase: true,
    helpful: 15,
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T10:30:00Z'
  },
  {
    id: 'review_2',
    productId: '1',
    userId: 'user2',
    userName: 'Trần Thị B',
    rating: 4,
    comment: 'Máy đẹp, cấu hình mạnh. Tuy nhiên pin có thể cải thiện hơn. Chất lượng camera rất tốt.',
    verifiedPurchase: true,
    helpful: 8,
    createdAt: '2024-12-14T14:20:00Z',
    updatedAt: '2024-12-14T14:20:00Z'
  },
  {
    id: 'review_3',
    productId: '2',
    userId: 'user1',
    userName: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Samsung luôn là lựa chọn tốt. Màn hình AMOLED tuyệt đẹp, camera xuất sắc. Phù hợp với nhu cầu sử dụng hàng ngày.',
    images: ['/images/reviews/samsung1.jpg'],
    verifiedPurchase: true,
    helpful: 12,
    createdAt: '2024-12-13T09:15:00Z',
    updatedAt: '2024-12-13T09:15:00Z'
  },
  {
    id: 'review_4',
    productId: '3',
    userId: 'user3',
    userName: 'Lê Văn C',
    rating: 4,
    comment: 'Tai nghe rất tốt, âm thanh chất lượng cao. Thời lượng pin khá ổn. Giao hàng nhanh.',
    verifiedPurchase: true,
    helpful: 6,
    createdAt: '2024-12-12T16:45:00Z',
    updatedAt: '2024-12-12T16:45:00Z'
  },
  {
    id: 'review_5',
    productId: '4',
    userId: 'user2',
    userName: 'Trần Thị B',
    rating: 5,
    comment: 'iPad rất tiện lợi cho công việc và học tập. Màn hình đẹp, hiệu năng mạnh. Apple chất lượng như expected.',
    verifiedPurchase: true,
    helpful: 20,
    createdAt: '2024-12-11T11:30:00Z',
    updatedAt: '2024-12-11T11:30:00Z'
  }
];

export const mockUserProfiles: UserProfile[] = [
  {
    id: 'profile_1',
    userId: 'user1',
    firstName: 'Nguyễn',
    lastName: 'Văn A',
    phone: '0987654321',
    dateOfBirth: '1995-05-15',
    gender: 'male',
    avatar: '/images/avatars/user1.jpg',
    bio: 'Thích công nghệ và đồ điện tử. Luôn tìm kiếm sản phẩm chất lượng với giá hợp lý.',
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: true,
        sms: true,
        push: false
      }
    },
    addresses: [
      {
        name: 'Nguyễn Văn A',
        phone: '0987654321',
        address: '123 Đường ABC',
        ward: 'Phường 1',
        district: 'Quận 1',
        city: 'TP.HCM'
      }
    ],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-12-15T10:30:00Z'
  },
  {
    id: 'profile_2',
    userId: 'user2',
    firstName: 'Trần',
    lastName: 'Thị B',
    phone: '0978123456',
    dateOfBirth: '1992-08-20',
    gender: 'female',
    avatar: '/images/avatars/user2.jpg',
    bio: 'Đam mê shopping online và tìm kiếm deal tốt. Thường mua sắm đồ công nghệ và thời trang.',
    preferences: {
      language: 'vi',
      currency: 'VND',
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    },
    addresses: [
      {
        name: 'Trần Thị B',
        phone: '0978123456',
        address: '456 Đường XYZ',
        ward: 'Phường 2',
        district: 'Quận 3',
        city: 'TP.HCM'
      }
    ],
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-12-14T14:20:00Z'
  }
];

export const mockWishlistItems: WishlistItem[] = [
  {
    id: 'wishlist_1',
    userId: 'user1',
    productId: '5',
    product: {
      id: '5',
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
    category: 'laptops',
    price: 45000000,
    addedAt: '2024-12-10T14:30:00Z',
    priceAlert: {
      enabled: true,
      targetPrice: 40000000,
      notified: false
    }
  },
  {
    id: 'wishlist_2',
    userId: 'user1',
    productId: '6',
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
    category: 'laptops',
    price: 35000000,
    addedAt: '2024-12-09T11:15:00Z'
  },
  {
    id: 'wishlist_3',
    userId: 'user2',
    productId: '7',
    product: {
      id: '7',
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
    category: 'smartphones',
    price: 32000000,
    addedAt: '2024-12-08T16:45:00Z',
    priceAlert: {
      enabled: true,
      targetPrice: 28000000,
      notified: false
    }
  }
];

export const mockWishlists: Wishlist[] = [
  {
    id: 'wishlist_user1_main',
    userId: 'user1',
    name: 'Sản phẩm yêu thích',
    description: 'Những sản phẩm tôi quan tâm',
    items: mockWishlistItems.filter(item => item.userId === 'user1'),
    isPublic: false,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-10T14:30:00Z'
  },
  {
    id: 'wishlist_user2_main',
    userId: 'user2',
    name: 'Wish List',
    description: 'Các sản phẩm muốn mua',
    items: mockWishlistItems.filter(item => item.userId === 'user2'),
    isPublic: true,
    shareUrl: 'https://yapee.com/wishlist/user2',
    createdAt: '2024-12-05T09:30:00Z',
    updatedAt: '2024-12-08T16:45:00Z'
  }
];

export const mockReviewStats: ReviewStats[] = [
  {
    productId: '1',
    totalReviews: 2,
    averageRating: 4.5,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 1,
      5: 1
    },
    verifiedPurchaseCount: 2
  },
  {
    productId: '2',
    totalReviews: 1,
    averageRating: 5.0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 1
    },
    verifiedPurchaseCount: 1
  },
  {
    productId: '3',
    totalReviews: 1,
    averageRating: 4.0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 1,
      5: 0
    },
    verifiedPurchaseCount: 1
  },
  {
    productId: '4',
    totalReviews: 1,
    averageRating: 5.0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 1
    },
    verifiedPurchaseCount: 1
  }
];

// Helper functions
export function getReviewsByProductId(productId: string): Review[] {
  return mockReviews.filter(review => review.productId === productId);
}

export function getUserProfile(userId: string): UserProfile | undefined {
  return mockUserProfiles.find(profile => profile.userId === userId);
}

export function getWishlistItems(userId: string): WishlistItem[] {
  return mockWishlistItems.filter(item => item.userId === userId);
}

export function getUserWishlist(userId: string): Wishlist | undefined {
  return mockWishlists.find(wishlist => wishlist.userId === userId);
}

export function getReviewStats(productId: string): ReviewStats | undefined {
  return mockReviewStats.find(stats => stats.productId === productId);
}

export function isProductInWishlist(userId: string, productId: string): boolean {
  return mockWishlistItems.some(item => item.userId === userId && item.productId === productId);
}
