import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import SearchBar from './SearchBar';
import AdvancedFilters from './AdvancedFilters';
import SearchResults from './SearchResults';
import { SearchFilters } from '../types';

interface SearchPageProps {
  initialQuery?: string;
}

export default function SearchPage({ initialQuery = '' }: SearchPageProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const {
    filters,
    searchResult,
    suggestions,
    loading,
    updateFilters,
    quickSearch,
    clearSearch,
    filterOptions
  } = useSearch({
    query: initialQuery,
    sortBy: 'relevance',
    page: 1,
    limit: 12
  });

  // Update search query when initialQuery changes
  useEffect(() => {
    if (initialQuery && initialQuery !== searchQuery) {
      setSearchQuery(initialQuery);
      quickSearch(initialQuery);
    }
  }, [initialQuery, searchQuery, quickSearch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    quickSearch(query);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.text);
    quickSearch(suggestion.text);
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    quickSearch(query);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(key =>
    key !== 'query' && key !== 'sortBy' && key !== 'page' && key !== 'limit' &&
    filters[key as keyof SearchFilters] !== undefined
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand && filters.brand.length > 0) count++;
    if (filters.priceRange) count++;
    if (filters.rating) count++;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="mb-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                onHistoryClick={handleHistoryClick}
                loading={loading}
                placeholder="Tìm kiếm sản phẩm, danh mục, thương hiệu..."
              />
            </div>

            {/* Search Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                {/* Filter Toggle */}
                <button
                  onClick={toggleFilters}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    hasActiveFilters
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal size={20} />
                  <span>Bộ lọc nâng cao</span>
                  {hasActiveFilters && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      clearSearch();
                      setSearchQuery('');
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={16} />
                    <span>Xóa bộ lọc</span>
                  </button>
                )}
              </div>

              {/* Results Summary */}
              {searchResult && (
                <div className="text-sm text-gray-600">
                  Tìm thấy <span className="font-semibold text-gray-900">
                    {searchResult.totalCount.toLocaleString()}
                  </span> sản phẩm
                  {searchQuery && (
                    <span> cho "<span className="font-medium">{searchQuery}</span>"</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-6">
                <AdvancedFilters
                  filters={filters}
                  onFiltersChange={updateFilters}
                  categoryOptions={filterOptions.categories}
                  brandOptions={filterOptions.brands}
                  priceRangeOptions={filterOptions.priceRanges}
                  isOpen={showFilters}
                  onToggle={toggleFilters}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Bộ lọc đang áp dụng:</span>

                  {filters.category && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Danh mục: {filterOptions.categories.find(c => c.id === filters.category)?.label}
                      <button
                        onClick={() => updateFilters({ category: undefined })}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {filters.brand && filters.brand.length > 0 && (
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Thương hiệu: {filters.brand.length} đã chọn
                      <button
                        onClick={() => updateFilters({ brand: undefined })}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {filters.priceRange && (
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                      Giá: {filters.priceRange.min.toLocaleString()} - {filters.priceRange.max.toLocaleString()} VND
                      <button
                        onClick={() => updateFilters({ priceRange: undefined })}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {filters.rating && (
                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      Đánh giá: {filters.rating}+ sao
                      <button
                        onClick={() => updateFilters({ rating: undefined })}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {filters.inStock && (
                    <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                      Còn hàng
                      <button
                        onClick={() => updateFilters({ inStock: undefined })}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}

                  {filters.onSale && (
                    <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      Đang giảm giá
                      <button
                        onClick={() => updateFilters({ onSale: undefined })}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Search Results */}
            <SearchResults
              searchResult={searchResult}
              filters={filters}
              onFiltersChange={updateFilters}
              loading={loading}
            />

            {/* Search Tips */}
            {!searchResult || searchResult.totalCount === 0 ? (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  💡 Mẹo tìm kiếm hiệu quả
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <h4 className="font-medium mb-2">🔍 Cách tìm kiếm:</h4>
                    <ul className="space-y-1">
                      <li>• Sử dụng từ khóa chính xác</li>
                      <li>• Kết hợp nhiều từ: "iPhone 15 Pro"</li>
                      <li>• Tìm theo thương hiệu: "Samsung Galaxy"</li>
                      <li>• Tìm theo danh mục: "laptop gaming"</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">🎯 Bộ lọc thông minh:</h4>
                    <ul className="space-y-1">
                      <li>• Lọc theo khoảng giá</li>
                      <li>• Chọn mức đánh giá tối thiểu</li>
                      <li>• Chỉ hiển thị sản phẩm còn hàng</li>
                      <li>• Ưu tiên sản phẩm đang giảm giá</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
