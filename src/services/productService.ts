import { Product } from '../types';
import { products as mockProducts } from '../data/mockData';

export class ProductService {
  static async getProducts(filters?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      let filteredProducts = [...mockProducts];

      // Apply category filter
      if (filters?.category) {
        filteredProducts = filteredProducts.filter(product => product.category === filters.category);
      }

      // Apply search filter
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        );
      }

      // Apply pagination
      if (filters?.offset) {
        filteredProducts = filteredProducts.slice(filters.offset);
      }

      if (filters?.limit) {
        filteredProducts = filteredProducts.slice(0, filters.limit);
      }

      return { data: filteredProducts, error: null };
    } catch (error) {
      return { data: [], error: error instanceof Error ? error.message : 'Failed to fetch products' };
    }
  }

  static async getProductById(id: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 150));

      const product = mockProducts.find(p => p.id === id);

      if (!product) {
        return { data: null, error: 'Product not found' };
      }

      return { data: product, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Product not found' };
    }
  }

  static async createProduct(product: Partial<Product>) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const newProduct: Product = {
        id: `product_${Date.now()}`,
        name: product.name || '',
        price: product.price || 0,
        originalPrice: product.originalPrice,
        image: product.image || '',
        images: product.images || [],
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        rating: 0,
        reviewCount: 0,
        sold: 0,
        stock: product.stock || 0,
        tags: product.tags || [],
        specifications: product.specifications || {}
      };

      // In real implementation, this would save to database
      console.log('Product created:', newProduct);

      return { data: newProduct, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Failed to create product' };
    }
  }

  static async updateProduct(id: string, updates: Partial<Product>) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 250));

      // In real implementation, this would update in database
      console.log('Product updated:', id, updates);

      return { data: { ...updates, id }, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Failed to update product' };
    }
  }

  static async deleteProduct(id: string) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));

      // In real implementation, this would delete from database
      console.log('Product deleted:', id);

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to delete product' };
    }
  }

  static async getRecommendations(productId: string, limit = 4) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Simple recommendation: return random products from same category
      const product = mockProducts.find(p => p.id === productId);
      if (!product) return { data: [], error: null };

      const recommendations = mockProducts
        .filter(p => p.id !== productId && p.category === product.category)
        .slice(0, limit);

      return { data: recommendations, error: null };
    } catch (error) {
      return { data: [], error: error instanceof Error ? error.message : 'Failed to get recommendations' };
    }
  }
}