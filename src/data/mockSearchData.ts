import {
  SearchFilters,
  SearchResult,
  SearchAnalytics,
  FilterOption,
  PriceRangeOption,
  SearchSuggestion,
  SearchHistory,
  AdvancedSearchConfig,
  Product
} from '../types';
import { products as mockProducts } from './mockData';

// Mock Search Suggestions
export const mockSearchSuggestions: SearchSuggestion[] = [
  { text: 'iPhone', type: 'product', count: 45, image: '/images/products/iphone.jpg' },
  { text: 'Samsung', type: 'brand', count: 120 },
  { text: 'Laptop', type: 'category', count: 89 },
  { text: 'Tai nghe', type: 'product', count: 67 },
  { text: 'Điện thoại', type: 'category', count: 156 },
  { text: 'Apple', type: 'brand', count: 98 },
  { text: 'Gaming', type: 'tag', count: 34 },
  { text: 'Wireless', type: 'tag', count: 78 }
];

// Mock Filter Options
export const mockCategoryFilters: FilterOption[] = [
  {
    id: 'smartphones',
    label: 'Điện thoại',
    count: 45,
    selected: false,
    children: [
      { id: 'android', label: 'Android', count: 25, selected: false },
      { id: 'ios', label: 'iOS', count: 20, selected: false }
    ]
  },
  {
    id: 'laptops',
    label: 'Laptop',
    count: 32,
    selected: false,
    children: [
      { id: 'gaming', label: 'Gaming', count: 15, selected: false },
      { id: 'business', label: 'Doanh nhân', count: 17, selected: false }
    ]
  },
  {
    id: 'tablets',
    label: 'Máy tính bảng',
    count: 18,
    selected: false
  },
  {
    id: 'headphones',
    label: 'Tai nghe',
    count: 67,
    selected: false
  },
  {
    id: 'accessories',
    label: 'Phụ kiện',
    count: 89,
    selected: false
  }
];

export const mockBrandFilters: FilterOption[] = [
  { id: 'apple', label: 'Apple', count: 45, selected: false },
  { id: 'samsung', label: 'Samsung', count: 38, selected: false },
  { id: 'google', label: 'Google', count: 12, selected: false },
  { id: 'sony', label: 'Sony', count: 23, selected: false },
  { id: 'dell', label: 'Dell', count: 16, selected: false },
  { id: 'hp', label: 'HP', count: 14, selected: false },
  { id: 'asus', label: 'Asus', count: 19, selected: false }
];

export const mockPriceRangeFilters: PriceRangeOption[] = [
  { label: 'Dưới 5 triệu', min: 0, max: 5000000, count: 45 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000, count: 38 },
  { label: '10 - 20 triệu', min: 10000000, max: 20000000, count: 29 },
  { label: '20 - 50 triệu', min: 20000000, max: 50000000, count: 15 },
  { label: 'Trên 50 triệu', min: 50000000, max: 999999999, count: 8 }
];

// Mock Search Analytics
export const mockSearchAnalytics: SearchAnalytics = {
  popularSearches: [
    { term: 'iPhone', count: 1250, trend: 'up' },
    { term: 'Samsung', count: 890, trend: 'stable' },
    { term: 'Laptop', count: 675, trend: 'up' },
    { term: 'Tai nghe', count: 543, trend: 'down' },
    { term: 'MacBook', count: 432, trend: 'up' }
  ],
  noResultsQueries: [
    { query: 'xyz product', count: 15 },
    { query: 'nonexistent item', count: 8 },
    { query: 'rare gadget', count: 12 }
  ],
  conversionRates: [
    {
      searchTerm: 'iPhone',
      conversionRate: 3.2,
      totalSearches: 1250,
      totalConversions: 40
    },
    {
      searchTerm: 'Samsung',
      conversionRate: 2.8,
      totalSearches: 890,
      totalConversions: 25
    },
    {
      searchTerm: 'Laptop',
      conversionRate: 4.1,
      totalSearches: 675,
      totalConversions: 28
    }
  ],
  averageSearchTime: 245,
  searchSuccessRate: 87.5
};

// Mock Search History
export const mockSearchHistory: SearchHistory[] = [
  {
    id: 'search_1',
    userId: 'user1',
    query: 'iPhone 15',
    filters: { category: 'smartphones', brand: ['apple'] },
    timestamp: '2024-12-20T14:30:00Z',
    resultsCount: 3,
    clickedProductId: '1'
  },
  {
    id: 'search_2',
    userId: 'user1',
    query: 'Samsung Galaxy',
    filters: { category: 'smartphones', priceRange: { min: 10000000, max: 30000000 } },
    timestamp: '2024-12-20T13:15:00Z',
    resultsCount: 8,
    clickedProductId: '2'
  },
  {
    id: 'search_3',
    query: 'Laptop gaming',
    filters: { category: 'laptops', tags: ['gaming'] },
    timestamp: '2024-12-20T12:45:00Z',
    resultsCount: 12
  }
];

// Mock Advanced Search Config
export const mockSearchConfig: AdvancedSearchConfig = {
  enableFuzzySearch: true,
  enableAutoComplete: true,
  enableSearchSuggestions: true,
  enableSearchHistory: true,
  maxSuggestions: 8,
  searchTimeout: 300,
  cacheResults: true,
  cacheTimeout: 300000 // 5 minutes
};

// Search Functions
export function performSearch(filters: SearchFilters): SearchResult {
  const startTime = Date.now();

  let filteredProducts = [...mockProducts];

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Category filter
  if (filters.category) {
    filteredProducts = filteredProducts.filter(product =>
      product.category === filters.category
    );
  }

  // Brand filter
  if (filters.brand && filters.brand.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      filters.brand!.includes(product.brand.toLowerCase())
    );
  }

  // Price range filter
  if (filters.priceRange) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= filters.priceRange!.min &&
      product.price <= filters.priceRange!.max
    );
  }

  // Rating filter
  if (filters.rating) {
    filteredProducts = filteredProducts.filter(product =>
      product.rating >= filters.rating!
    );
  }

  // In stock filter
  if (filters.inStock) {
    filteredProducts = filteredProducts.filter(product =>
      product.stock > 0
    );
  }

  // On sale filter
  if (filters.onSale) {
    filteredProducts = filteredProducts.filter(product =>
      product.originalPrice && product.originalPrice > product.price
    );
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      filters.tags!.some(tag => product.tags.includes(tag))
    );
  }

  // Sorting
  switch (filters.sortBy) {
    case 'price_asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case 'popular':
      filteredProducts.sort((a, b) => b.sold - a.sold);
      break;
    default:
      // relevance - keep original order
      break;
  }

  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const searchTime = Date.now() - startTime;

  return {
    products: paginatedProducts,
    totalCount,
    totalPages,
    currentPage: page,
    filters,
    suggestions: filters.query ? getSearchSuggestions(filters.query) : [],
    searchTime
  };
}

export function getSearchSuggestions(query: string): string[] {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  return mockSearchSuggestions
    .filter(suggestion =>
      suggestion.text.toLowerCase().includes(lowerQuery)
    )
    .slice(0, mockSearchConfig.maxSuggestions)
    .map(suggestion => suggestion.text);
}

export function getFilterOptions(): {
  categories: FilterOption[];
  brands: FilterOption[];
  priceRanges: PriceRangeOption[];
} {
  return {
    categories: mockCategoryFilters,
    brands: mockBrandFilters,
    priceRanges: mockPriceRangeFilters
  };
}

export function getSearchAnalytics(): SearchAnalytics {
  return mockSearchAnalytics;
}

export function getSearchHistory(userId?: string): SearchHistory[] {
  if (userId) {
    return mockSearchHistory.filter(history => history.userId === userId);
  }
  return mockSearchHistory;
}

export function saveSearchHistory(history: Omit<SearchHistory, 'id'>): SearchHistory {
  const newHistory: SearchHistory = {
    ...history,
    id: `search_${Date.now()}`
  };

  // In a real app, this would save to database
  console.log('Search history saved:', newHistory);
  return newHistory;
}

export function getSearchConfig(): AdvancedSearchConfig {
  return mockSearchConfig;
}

// Fuzzy search implementation
export function fuzzySearch(query: string, products: Product[]): Product[] {
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(' ');

  return products
    .map(product => {
      const name = product.name.toLowerCase();
      const brand = product.brand.toLowerCase();
      const description = product.description.toLowerCase();

      let score = 0;

      // Exact matches get highest score
      if (name.includes(lowerQuery)) score += 100;
      if (brand.includes(lowerQuery)) score += 50;
      if (description.includes(lowerQuery)) score += 25;

      // Partial word matches
      queryWords.forEach(word => {
        if (name.includes(word)) score += 20;
        if (brand.includes(word)) score += 10;
        if (description.includes(word)) score += 5;
      });

      // Tag matches
      product.tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowerQuery)) score += 15;
      });

      return { product, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
}
