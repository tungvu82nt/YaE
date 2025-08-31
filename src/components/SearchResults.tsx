import React, { useState } from 'react';
import {
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  Package,
  Clock
} from 'lucide-react';
import { SearchResult, SearchFilters } from '../types';
import ProductCard from './ProductCard';

interface SearchResultsProps {
  searchResult: SearchResult | null;
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  loading?: boolean;
}

export default function SearchResults({
  searchResult,
  filters,
  onFiltersChange,
  loading = false
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    onFiltersChange({ sortBy });
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({ page });
  };

  const handleLimitChange = (limit: number) => {
    onFiltersChange({ limit, page: 1 });
  };

  const getSortLabel = (sortBy: SearchFilters['sortBy']) => {
    switch (sortBy) {
      case 'relevance':
        return 'Liên quan nhất';
      case 'price_asc':
        return 'Giá thấp đến cao';
      case 'price_desc':
        return 'Giá cao đến thấp';
      case 'rating':
        return 'Đánh giá cao nhất';
      case 'newest':
        return 'Mới nhất';
      case 'popular':
        return 'Phổ biến nhất';
      default:
        return 'Liên quan nhất';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tìm kiếm...</p>
        </div>
      </div>
    );
  }

  if (!searchResult || searchResult.totalCount === 0) {
    return (
      <div className="text-center py-12">
        <Package size={64} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {filters.query ? `Không tìm thấy kết quả cho "${filters.query}"` : 'Chưa có kết quả tìm kiếm'}
        </h3>
        <p className="text-gray-600 mb-4">
          {filters.query
            ? 'Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc'
            : 'Nhập từ khóa để bắt đầu tìm kiếm'
          }
        </p>
        {filters.query && (
          <div className="text-sm text-gray-500">
            <p>Gợi ý:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Kiểm tra chính tả</li>
              <li>Sử dụng từ khóa đơn giản hơn</li>
              <li>Điều chỉnh bộ lọc để mở rộng phạm vi tìm kiếm</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Kết quả tìm kiếm
            {filters.query && (
              <span className="text-gray-600"> cho "{filters.query}"</span>
            )}
          </h2>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <span>{searchResult.totalCount.toLocaleString()} sản phẩm</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{searchResult.searchTime}ms</span>
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-4">
          {/* Sort */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sắp xếp:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as SearchFilters['sortBy'])}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Liên quan nhất</option>
              <option value="price_asc">Giá thấp đến cao</option>
              <option value="price_desc">Giá cao đến thấp</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="newest">Mới nhất</option>
              <option value="popular">Phổ biến nhất</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid/List */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }>
        {searchResult.products.map((product) => (
          <div
            key={product.id}
            className={viewMode === 'list' ? 'border border-gray-200 rounded-lg p-4' : ''}
          >
            {viewMode === 'list' ? (
              // List View
              <div className="flex space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= Math.floor(product.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-red-600">
                        {formatPrice(product.price)}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Đã bán: {product.sold}
                    </div>
                  </div>

                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Thêm vào giỏ
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Grid View - using ProductCard
              <ProductCard
                product={product}
                onClick={() => console.log('Product clicked:', product.id)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {searchResult.totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Hiển thị:</span>
            <select
              value={filters.limit || 12}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
              <option value={48}>48</option>
            </select>
            <span className="text-gray-600">sản phẩm/trang</span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(searchResult.currentPage - 1)}
              disabled={searchResult.currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center space-x-1">
              {/* First page */}
              {searchResult.currentPage > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    1
                  </button>
                  {searchResult.currentPage > 4 && <span className="px-2">...</span>}
                </>
              )}

              {/* Pages around current page */}
              {Array.from(
                { length: Math.min(5, searchResult.totalPages) },
                (_, i) => {
                  const pageNum = Math.max(1, searchResult.currentPage - 2) + i;
                  if (pageNum > searchResult.totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 border rounded-lg transition-colors ${
                        pageNum === searchResult.currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              ).filter(Boolean)}

              {/* Last page */}
              {searchResult.currentPage < searchResult.totalPages - 2 && (
                <>
                  {searchResult.currentPage < searchResult.totalPages - 3 && (
                    <span className="px-2">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(searchResult.totalPages)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {searchResult.totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(searchResult.currentPage + 1)}
              disabled={searchResult.currentPage === searchResult.totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Trang {searchResult.currentPage} / {searchResult.totalPages}
          </div>
        </div>
      )}

      {/* Search Stats */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>
            Hiển thị {((searchResult.currentPage - 1) * (filters.limit || 12)) + 1} - {
              Math.min(searchResult.currentPage * (filters.limit || 12), searchResult.totalCount)
            } trong tổng số {searchResult.totalCount.toLocaleString()} sản phẩm
          </span>
          <span>Sắp xếp: {getSortLabel(filters.sortBy)}</span>
        </div>
      </div>
    </div>
  );
}
