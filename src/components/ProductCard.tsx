import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { useUserProfile } from '../hooks/useUserProfile';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { dispatch, state } = useApp();
  const { addToWishlist, checkWishlistStatus } = useUserProfile(state.user?.id);

  const isInWishlist = checkWishlistStatus(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!state.user) {
      alert('Vui lòng đăng nhập để thêm vào danh sách yêu thích!');
      return;
    }

    if (isInWishlist) {
      // In a real app, this would call removeFromWishlist
      console.log('Remove from wishlist:', product.id);
    } else {
      await addToWishlist(product.id, product);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            -{product.discount}%
          </div>
        )}
        {product.tags.includes('hot') && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-sm font-semibold">
            HOT
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center mb-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.reviewCount})</span>
          <span className="text-sm text-gray-500 ml-4">Đã bán {product.sold}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1">
            <div className="text-lg font-bold text-red-600">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleToggleWishlist}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
              isInWishlist
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
            <span>{isInWishlist ? 'Đã thích' : 'Yêu thích'}</span>
          </button>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
          >
            <ShoppingCart size={16} />
            <span>Giỏ hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
}