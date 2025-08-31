import React, { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Share2, Bell, BellOff, Search, Filter } from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useApp } from '../context/AppContext';
import { WishlistItem } from '../types';

export default function Wishlist() {
  const { state } = useApp();
  const { wishlistItems, removeFromWishlist, checkWishlistStatus, addToWishlist } = useUserProfile(state.user?.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
  const [showPriceAlerts, setShowPriceAlerts] = useState<WishlistItem[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?')) {
      await removeFromWishlist(productId);
    }
  };

  const handleAddToCart = (product: any) => {
    // In a real app, this would dispatch to cart
    console.log('Adding to cart:', product);
    alert('Đã thêm vào giỏ hàng!');
  };

  const handleShareWishlist = () => {
    const shareUrl = `${window.location.origin}/shared-wishlist/${state.user?.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Đã sao chép liên kết chia sẻ!');
    });
  };

  const filteredItems = wishlistItems
    .filter(item =>
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
        case 'price':
          return b.price - a.price;
        case 'name':
          return a.product.name.localeCompare(b.product.name);
        default:
          return 0;
      }
    });

  const totalValue = filteredItems.reduce((sum, item) => sum + item.price, 0);
  const priceAlertItems = filteredItems.filter(item => item.priceAlert?.enabled);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Heart size={28} className="text-red-500" />
                <span>Danh sách yêu thích</span>
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredItems.length} sản phẩm • Tổng giá trị: {formatPrice(totalValue)}
              </p>
            </div>

            {filteredItems.length > 0 && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleShareWishlist}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 size={16} />
                  <span>Chia sẻ</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {filteredItems.length === 0 && wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Danh sách yêu thích trống
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có sản phẩm nào trong danh sách yêu thích.
              Hãy khám phá các sản phẩm và thêm vào danh sách yêu thích của bạn!
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng sản phẩm</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredItems.length}</p>
                  </div>
                  <Heart size={24} className="text-red-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tổng giá trị</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(totalValue)}</p>
                  </div>
                  <ShoppingCart size={24} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cảnh báo giá</p>
                    <p className="text-2xl font-bold text-orange-600">{priceAlertItems.length}</p>
                  </div>
                  <Bell size={24} className="text-orange-500" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm yêu thích..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Filter size={20} className="text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Mới nhất</option>
                    <option value="price">Giá cao nhất</option>
                    <option value="name">Tên A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-48 object-cover"
                    />

                    {/* Price Alert Badge */}
                    {item.priceAlert?.enabled && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                        <Bell size={12} />
                        <span>Cảnh báo giá</span>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.product.name}
                    </h3>

                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold text-red-600">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {item.product.originalPrice && formatPrice(item.product.originalPrice)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{item.product.brand}</span>
                      <div className="flex items-center space-x-1">
                        <span>★</span>
                        <span>{item.product.rating}</span>
                      </div>
                    </div>

                    {/* Price Alert */}
                    {item.priceAlert?.enabled && (
                      <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-orange-800">Cảnh báo khi giá dưới:</span>
                          <span className="font-medium text-orange-900">
                            {formatPrice(item.priceAlert.targetPrice)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mb-3">
                      Thêm vào: {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                    </div>

                    <button
                      onClick={() => handleAddToCart(item.product)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart size={16} />
                      <span>Thêm vào giỏ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty Filtered Results */}
            {filteredItems.length === 0 && wishlistItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Search size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
