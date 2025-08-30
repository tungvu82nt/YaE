export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images: string[];
  description: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  sold: number;
  stock: number;
  tags: string[];
  specifications: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  parentId?: string;
  children?: Category[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string; // Keep for internal use
  username: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: Address;
}

export interface Address {
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}