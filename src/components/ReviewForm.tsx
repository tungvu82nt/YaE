import React, { useState } from 'react';
import { Star, Upload, X, Send } from 'lucide-react';
import { Review } from '../types';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSubmit: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  onCancel: () => void;
  userName?: string;
}

export default function ReviewForm({ productId, productName, onSubmit, onCancel, userName }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Chỉ chấp nhận file ảnh dưới 5MB');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!comment.trim()) {
      alert('Vui lòng viết nhận xét');
      return;
    }

    setSubmitting(true);

    try {
      // Convert images to base64 strings for mock data
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            reader.readAsDataURL(image);
          });
        })
      );

      const reviewData = {
        productId,
        rating,
        comment: comment.trim(),
        images: imageUrls,
        verifiedPurchase: true,
        helpful: 0
      };

      const success = await onSubmit(reviewData);
      if (success) {
        onCancel();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Đánh giá sản phẩm
        </h3>
        <p className="text-gray-600 text-sm">
          Chia sẻ trải nghiệm của bạn về sản phẩm <strong>{productName}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Đánh giá của bạn *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1"
              >
                <Star
                  size={32}
                  className={`${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-600">
              {rating > 0 && `${rating} sao`}
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Nhận xét của bạn *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
          />
          <div className="mt-1 text-sm text-gray-500">
            {comment.length}/500 ký tự
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Hình ảnh (tùy chọn)
          </label>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {imagePreviews.length < 5 && (
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
              >
                <div className="text-center">
                  <Upload size={24} className="text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">
                    Thêm hình ảnh ({imagePreviews.length}/5)
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF tối đa 5MB
                  </div>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting || rating === 0 || !comment.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Gửi đánh giá</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Guidelines */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Lưu ý khi đánh giá:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Đánh giá chân thực dựa trên trải nghiệm sử dụng</li>
          <li>• Không sử dụng ngôn từ không phù hợp</li>
          <li>• Hình ảnh nên rõ nét và liên quan đến sản phẩm</li>
          <li>• Đánh giá sẽ được kiểm duyệt trước khi hiển thị</li>
        </ul>
      </div>
    </div>
  );
}
