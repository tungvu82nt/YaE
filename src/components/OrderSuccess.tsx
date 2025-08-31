import React from 'react';
import { CheckCircle, ArrowLeft, Package, Truck, Clock } from 'lucide-react';

interface OrderSuccessProps {
  orderId: string;
  total: number;
  paymentMethod: string;
  onBack: () => void;
}

export default function OrderSuccess({ orderId, total, paymentMethod, onBack }: OrderSuccessProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng (COD)';
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng';
      case 'cash':
        return 'Tiền mặt tại cửa hàng';
      default:
        return method;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} className="text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h1>

          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã mua hàng tại Yapee. Đơn hàng của bạn đã được ghi nhận.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Thông tin đơn hàng</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Mã đơn hàng:</span> <span className="font-medium">{orderId}</span></p>
                  <p><span className="text-gray-600">Tổng tiền:</span> <span className="font-medium text-red-600">{formatPrice(total)}</span></p>
                  <p><span className="text-gray-600">Phương thức:</span> <span className="font-medium">{getPaymentMethodName(paymentMethod)}</span></p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Trạng thái</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock size={16} className="text-yellow-500" />
                  <span className="text-yellow-600 font-medium">Đang xử lý</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Chúng tôi sẽ xử lý đơn hàng trong vòng 24 giờ
                </p>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          {paymentMethod === 'bank_transfer' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Thông tin chuyển khoản</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Ngân hàng:</strong> Vietcombank</p>
                <p><strong>Số tài khoản:</strong> 1234567890</p>
                <p><strong>Chủ tài khoản:</strong> Yapee Company</p>
                <p><strong>Nội dung:</strong> {orderId}</p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">Các bước tiếp theo</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-start space-x-2">
                <Package size={16} className="mt-0.5 flex-shrink-0" />
                <span>Chúng tôi sẽ xác nhận đơn hàng qua SMS/email</span>
              </div>
              <div className="flex items-start space-x-2">
                <Truck size={16} className="mt-0.5 flex-shrink-0" />
                <span>Sản phẩm sẽ được giao trong 3-5 ngày làm việc</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onBack}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Tiếp tục mua sắm</span>
            </button>

            <button
              onClick={() => window.print()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              In đơn hàng
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Cần hỗ trợ? Liên hệ hotline: 0333.938.014
          </p>
        </div>
      </div>
    </div>
  );
}
