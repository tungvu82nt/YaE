import React, { useState, useEffect } from 'react';
import {
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  Check,
  SlidersHorizontal
} from 'lucide-react';
import { FilterOption, PriceRangeOption, SearchFilters } from '../types';

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  categoryOptions: FilterOption[];
  brandOptions: FilterOption[];
  priceRangeOptions: PriceRangeOption[];
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdvancedFilters({
  filters,
  onFiltersChange,
  categoryOptions,
  brandOptions,
  priceRangeOptions,
  isOpen,
  onToggle
}: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['category']));
  const [tempFilters, setTempFilters] = useState<Partial<SearchFilters>>(filters);

  // Update temp filters when filters prop changes
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = tempFilters.category === categoryId ? undefined : categoryId;
    setTempFilters(prev => ({ ...prev, category: newCategories }));
  };

  const handleBrandChange = (brandId: string) => {
    const currentBrands = tempFilters.brand || [];
    const newBrands = currentBrands.includes(brandId)
      ? currentBrands.filter(b => b !== brandId)
      : [...currentBrands, brandId];

    setTempFilters(prev => ({
      ...prev,
      brand: newBrands.length > 0 ? newBrands : undefined
    }));
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    const newPriceRange = tempFilters.priceRange?.min === min && tempFilters.priceRange?.max === max
      ? undefined
      : { min, max };

    setTempFilters(prev => ({ ...prev, priceRange: newPriceRange }));
  };

  const handleRatingChange = (rating: number) => {
    const newRating = tempFilters.rating === rating ? undefined : rating;
    setTempFilters(prev => ({ ...prev, rating: newRating }));
  };

  const handleStockChange = (inStock: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      inStock: inStock ? true : undefined
    }));
  };

  const handleSaleChange = (onSale: boolean) => {
    setTempFilters(prev => ({
      ...prev,
      onSale: onSale ? true : undefined
    }));
  };

  const applyFilters = () => {
    onFiltersChange(tempFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: undefined,
      brand: undefined,
      priceRange: undefined,
      rating: undefined,
      inStock: undefined,
      onSale: undefined,
      tags: undefined
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.keys(tempFilters).some(key =>
    key !== 'query' && key !== 'sortBy' && key !== 'page' && key !== 'limit' &&
    tempFilters[key as keyof SearchFilters] !== undefined
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (tempFilters.category) count++;
    if (tempFilters.brand && tempFilters.brand.length > 0) count++;
    if (tempFilters.priceRange) count++;
    if (tempFilters.rating) count++;
    if (tempFilters.inStock) count++;
    if (tempFilters.onSale) count++;
    return count;
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
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
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 w-full max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc nâng cao</h3>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            <span>Danh mục</span>
            {expandedSections.has('category') ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {expandedSections.has('category') && (
            <div className="space-y-2 ml-4">
              {categoryOptions.map((category) => (
                <div key={category.id}>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={tempFilters.category === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {category.label} ({category.count})
                    </span>
                  </label>

                  {/* Subcategories */}
                  {category.children && expandedSections.has('category') && (
                    <div className="ml-6 mt-2 space-y-1">
                      {category.children.map((subcategory) => (
                        <label key={subcategory.id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="subcategory"
                            checked={tempFilters.category === subcategory.id}
                            onChange={() => handleCategoryChange(subcategory.id)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-600">
                            {subcategory.label} ({subcategory.count})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div>
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            <span>Thương hiệu</span>
            {expandedSections.has('brand') ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {expandedSections.has('brand') && (
            <div className="space-y-2 ml-4 max-h-40 overflow-y-auto">
              {brandOptions.map((brand) => (
                <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempFilters.brand?.includes(brand.id) || false}
                    onChange={() => handleBrandChange(brand.id)}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {brand.label} ({brand.count})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            <span>Khoảng giá</span>
            {expandedSections.has('price') ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {expandedSections.has('price') && (
            <div className="space-y-2 ml-4">
              {priceRangeOptions.map((range, index) => (
                <label key={index} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={
                      tempFilters.priceRange?.min === range.min &&
                      tempFilters.priceRange?.max === range.max
                    }
                    onChange={() => handlePriceRangeChange(range.min, range.max)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {range.label} ({range.count})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <button
            onClick={() => toggleSection('rating')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            <span>Đánh giá</span>
            {expandedSections.has('rating') ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {expandedSections.has('rating') && (
            <div className="space-y-2 ml-4">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={tempFilters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={`${
                          star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-700 ml-2">
                      {rating}+ sao
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Additional Filters */}
        <div>
          <button
            onClick={() => toggleSection('additional')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
          >
            <span>Lọc bổ sung</span>
            {expandedSections.has('additional') ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {expandedSections.has('additional') && (
            <div className="space-y-3 ml-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempFilters.inStock || false}
                  onChange={(e) => handleStockChange(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700">Chỉ hiển thị sản phẩm còn hàng</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempFilters.onSale || false}
                  onChange={(e) => handleSaleChange(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700">Chỉ hiển thị sản phẩm đang giảm giá</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Xóa tất cả
        </button>

        <div className="flex space-x-3">
          <button
            onClick={onToggle}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
