import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Verified, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Review, ReviewStats } from '../types';

interface ReviewListProps {
  productId: string;
  reviews: Review[];
  stats: ReviewStats;
  onHelpfulVote: (reviewId: string, isHelpful: boolean) => void;
  currentUserId?: string;
}

export default function ReviewList({ productId, reviews, stats, onHelpfulVote, currentUserId }: ReviewListProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful' | 'rating'>('newest');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [showImagesOnly, setShowImagesOnly] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const sortedReviews = [...reviews]
    .filter(review => filterRating === 'all' || review.rating === filterRating)
    .filter(review => !showImagesOnly || (review.images && review.images.length > 0))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'helpful':
          return b.helpful - a.helpful;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Đánh giá sản phẩm</h3>
          <div className="text-sm text-gray-600">
            {stats.totalReviews} đánh giá
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="mb-2">
              {renderStars(Math.round(stats.averageRating), 20)}
            </div>
            <div className="text-sm text-gray-600">
              {stats.verifiedPurchaseCount} người mua đã xác thực
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star size={12} className="text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="helpful">Hữu ích nhất</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Lọc:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả sao</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showImagesOnly}
              onChange={(e) => setShowImagesOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Chỉ hiển thị có ảnh</span>
          </label>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Star size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đánh giá</h3>
            <p className="text-gray-600">
              {reviews.length === 0
                ? 'Hãy là người đầu tiên đánh giá sản phẩm này!'
                : 'Không tìm thấy đánh giá phù hợp với bộ lọc.'
              }
            </p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{review.userName}</span>
                      {review.verifiedPurchase && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <Verified size={14} />
                          <span className="text-xs">Đã mua</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {expandedReviews.has(review.id) || review.comment.length <= 300
                    ? review.comment
                    : `${review.comment.substring(0, 300)}...`
                  }
                </p>

                {review.comment.length > 300 && (
                  <button
                    onClick={() => toggleExpanded(review.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm mt-2 flex items-center space-x-1"
                  >
                    {expandedReviews.has(review.id) ? (
                      <>
                        <ChevronUp size={14} />
                        <span>Thu gọn</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} />
                        <span>Xem thêm</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <ImageIcon size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600">Hình ảnh từ người dùng</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        onClick={() => {
                          // In a real app, this would open a modal with the full image
                          window.open(image, '_blank');
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {review.helpful} người thấy hữu ích
                  </div>

                  {currentUserId && currentUserId !== review.userId && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onHelpfulVote(review.id, true)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
                      >
                        <ThumbsUp size={14} />
                        <span className="text-sm">Hữu ích</span>
                      </button>
                      <button
                        onClick={() => onHelpfulVote(review.id, false)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
                      >
                        <ThumbsDown size={14} />
                        <span className="text-sm">Không hữu ích</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  Đánh giá vào {formatDate(review.createdAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {sortedReviews.length > 0 && sortedReviews.length < reviews.length && (
        <div className="text-center">
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Xem thêm đánh giá
          </button>
        </div>
      )}
    </div>
  );
}
