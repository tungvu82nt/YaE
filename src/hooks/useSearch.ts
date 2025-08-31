import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SearchFilters,
  SearchResult,
  SearchAnalytics,
  FilterOption,
  PriceRangeOption,
  SearchSuggestion,
  SearchHistory,
  AdvancedSearchConfig
} from '../types';
import {
  performSearch,
  getSearchSuggestions,
  getFilterOptions,
  getSearchAnalytics,
  getSearchHistory,
  saveSearchHistory,
  getSearchConfig,
  fuzzySearch
} from '../data/mockSearchData';
import { products as mockProducts } from '../data/mockData';

// Using Vite's import.meta.env instead of process.env for browser compatibility
const USE_MOCK_DATA = (import.meta.env?.DEV || true) && (import.meta.env?.VITE_USE_MOCK_DATA === 'true' || true);

export function useSearch(initialFilters?: Partial<SearchFilters>) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'relevance',
    page: 1,
    limit: 12,
    ...initialFilters
  });

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [searchConfig, setSearchConfig] = useState<AdvancedSearchConfig | null>(null);

  // Load search configuration
  useEffect(() => {
    if (USE_MOCK_DATA) {
      setSearchConfig(getSearchConfig());
    }
  }, []);

  // Load search history
  useEffect(() => {
    if (USE_MOCK_DATA) {
      const history = getSearchHistory();
      setSearchHistory(history);
    }
  }, []);

  // Perform search
  const executeSearch = useCallback(async (searchFilters?: Partial<SearchFilters>) => {
    const currentFilters = searchFilters ? { ...filters, ...searchFilters } : filters;

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay

      let result: SearchResult;

      if (USE_MOCK_DATA) {
        result = performSearch(currentFilters);
      } else {
        // TODO: Implement real API call
        result = {
          products: mockProducts.slice(0, currentFilters.limit || 12),
          totalCount: mockProducts.length,
          totalPages: Math.ceil(mockProducts.length / (currentFilters.limit || 12)),
          currentPage: currentFilters.page || 1,
          filters: currentFilters,
          searchTime: 150
        };
      }

      setSearchResult(result);

      // Save search history
      if (currentFilters.query && searchConfig?.enableSearchHistory) {
        const historyEntry = saveSearchHistory({
          userId: 'current_user', // In real app, get from auth context
          query: currentFilters.query,
          filters: currentFilters,
          timestamp: new Date().toISOString(),
          resultsCount: result.totalCount
        });

        setSearchHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
      }

      console.log(`✅ Search completed: ${result.totalCount} results in ${result.searchTime}ms`);
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Không thể thực hiện tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [filters, searchConfig]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };

    // Reset to page 1 when filters change (except page)
    if (Object.keys(newFilters).some(key => key !== 'page')) {
      updatedFilters.page = 1;
    }

    setFilters(updatedFilters);
    executeSearch(updatedFilters);
  }, [filters, executeSearch]);

  // Quick search (without changing filters permanently)
  const quickSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    const searchFilters = { ...filters, query: query.trim(), page: 1 };
    await executeSearch(searchFilters);
  }, [filters, executeSearch]);

  // Get search suggestions
  const getSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 2 || !searchConfig?.enableAutoComplete) {
      setSuggestions([]);
      return;
    }

    try {
      if (USE_MOCK_DATA) {
        const suggestionTexts = getSearchSuggestions(query);
        const suggestionObjects = suggestionTexts.map(text => ({
          text,
          type: 'product' as const,
          count: Math.floor(Math.random() * 50) + 1
        }));
        setSuggestions(suggestionObjects);
      }
    } catch (err) {
      console.error('Error getting suggestions:', err);
    }
  }, [searchConfig]);

  // Clear search
  const clearSearch = useCallback(() => {
    const clearedFilters = {
      query: '',
      category: undefined,
      brand: undefined,
      priceRange: undefined,
      rating: undefined,
      inStock: undefined,
      onSale: undefined,
      tags: undefined,
      sortBy: 'relevance' as const,
      page: 1,
      limit: 12
    };

    setFilters(clearedFilters);
    setSearchResult(null);
    setSuggestions([]);
  }, []);

  // Get filter options
  const filterOptions = useMemo(() => {
    if (USE_MOCK_DATA) {
      return getFilterOptions();
    }
    return {
      categories: [],
      brands: [],
      priceRanges: []
    };
  }, []);

  // Get search analytics
  const analytics = useMemo(() => {
    if (USE_MOCK_DATA) {
      return getSearchAnalytics();
    }
    return null;
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (!filters.query || filters.query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      getSuggestions(filters.query);
    }, searchConfig?.searchTimeout || 300);

    return () => clearTimeout(timeoutId);
  }, [filters.query, getSuggestions, searchConfig]);

  // Auto-search when filters change
  useEffect(() => {
    if (filters.query || Object.keys(filters).some(key =>
      key !== 'query' && key !== 'page' && filters[key as keyof SearchFilters]
    )) {
      executeSearch();
    }
  }, [filters, executeSearch]);

  return {
    // State
    filters,
    searchResult,
    suggestions,
    searchHistory,
    filterOptions,
    analytics,
    searchConfig,
    loading,
    error,

    // Actions
    updateFilters,
    quickSearch,
    clearSearch,
    executeSearch,
    getSuggestions,

    // Computed values
    hasResults: searchResult && searchResult.totalCount > 0,
    hasFilters: Object.keys(filters).some(key =>
      key !== 'sortBy' && key !== 'page' && key !== 'limit' && filters[key as keyof SearchFilters]
    ),
    totalResults: searchResult?.totalCount || 0,
    currentPage: searchResult?.currentPage || 1,
    totalPages: searchResult?.totalPages || 0
  };
}

// Advanced search hook with fuzzy search
export function useAdvancedSearch(initialFilters?: Partial<SearchFilters>) {
  const searchHook = useSearch(initialFilters);
  const [enableFuzzy, setEnableFuzzy] = useState(false);

  const fuzzySearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    searchHook.updateFilters({ query });

    if (enableFuzzy) {
      // In a real app, this would call a fuzzy search API
      console.log('🔍 Performing fuzzy search for:', query);
    }
  }, [searchHook, enableFuzzy]);

  return {
    ...searchHook,
    enableFuzzy,
    setEnableFuzzy,
    fuzzySearch
  };
}
