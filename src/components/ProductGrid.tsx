import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Loader2 } from 'lucide-react';

export default function ProductGrid() {
  const { state } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Đang tải sản phẩm...</span>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {state.selectedCategory ? 'Sản phẩm theo danh mục' : 'Sản phẩm nổi bật'}
        </h2>
        <p className="text-gray-600">
          {state.products.length} sản phẩm
          {state.searchQuery && ` cho "${state.searchQuery}"`}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {state.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {state.products.length === 0 && !state.loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}