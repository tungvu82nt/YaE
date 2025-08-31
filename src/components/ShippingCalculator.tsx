import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Package, Calculator, CheckCircle } from 'lucide-react';
import { shippingService, ShippingRate, ShippingCalculationRequest } from '../services/shippingService';
import { Address } from '../types';

interface ShippingCalculatorProps {
  cartItems: Array<{ product: any; quantity: number }>;
  orderValue: number;
  shippingAddress: Address;
  selectedProvider?: string;
  onProviderSelect: (providerId: string, cost: number) => void;
}

export default function ShippingCalculator({
  cartItems,
  orderValue,
  shippingAddress,
  selectedProvider,
  onProviderSelect
}: ShippingCalculatorProps) {
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculateShippingRates();
  }, [cartItems, orderValue, shippingAddress]);

  const calculateShippingRates = async () => {
    if (!cartItems.length || !shippingAddress.city) return;

    setLoading(true);
    setError(null);

    try {
      // Tính tổng trọng lượng
      const totalWeight = shippingService.calculateOrderWeight(cartItems);

      // Tạo request tính phí
      const request: ShippingCalculationRequest = {
        fromDistrict: 'Quận 1, Hồ Chí Minh', // Giả lập kho xuất phát
        toDistrict: `${shippingAddress.district}, ${shippingAddress.city}`,
        weight: totalWeight,
        value: orderValue
      };

      // Tính phí vận chuyển
      const rates = shippingService.calculateShippingRates(request);
      setShippingRates(rates);

      // Auto-select cheapest if none selected
      if (!selectedProvider && rates.length > 0) {
        onProviderSelect(rates[0].provider.id, rates[0].cost);
      }

    } catch (err) {
      console.error('Error calculating shipping:', err);
      setError('Không thể tính phí vận chuyển');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatWeight = (weight: number) => {
    return `${(weight / 1000).toFixed(1)} kg`;
  };

  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calculator size={24} className="text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Tính phí vận chuyển</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Đang tính phí...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calculator size={24} className="text-red-500" />
          <h3 className="text-lg font-semibold text-red-900">Lỗi tính phí vận chuyển</h3>
        </div>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (shippingRates.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calculator size={24} className="text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Tính phí vận chuyển</h3>
        </div>
        <div className="text-center py-8">
          <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Vui lòng nhập địa chỉ giao hàng để tính phí vận chuyển</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Truck size={24} className="text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Chọn đơn vị vận chuyển</h3>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tổng trọng lượng:</span>
          <span className="font-medium">
            {formatWeight(shippingService.calculateOrderWeight(cartItems))}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Giá trị đơn hàng:</span>
          <span className="font-medium">{formatPrice(orderValue)}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Địa chỉ giao:</span>
          <span className="font-medium text-right max-w-xs truncate">
            {shippingAddress.district}, {shippingAddress.city}
          </span>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="space-y-3">
        {shippingRates.map((rate) => (
          <label
            key={rate.provider.id}
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedProvider === rate.provider.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-4 flex-1">
              <input
                type="radio"
                name="shipping"
                value={rate.provider.id}
                checked={selectedProvider === rate.provider.id}
                onChange={() => onProviderSelect(rate.provider.id, rate.cost)}
                className="text-blue-600 focus:ring-blue-500"
              />

              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Truck size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{rate.provider.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Package size={14} />
                        <span>{rate.estimatedDays} ngày</span>
                      </span>
                      {rate.trackingAvailable && (
                        <span className="flex items-center space-x-1">
                          <CheckCircle size={14} />
                          <span>Theo dõi</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {formatPrice(rate.cost)}
                </div>
                <div className="text-sm text-gray-500">
                  {rate.cost === Math.min(...shippingRates.map(r => r.cost)) && (
                    <span className="text-green-600 font-medium">Rẻ nhất</span>
                  )}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Selected Provider Info */}
      {selectedProvider && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <CheckCircle size={20} className="text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">
                Đã chọn: {shippingRates.find(r => r.provider.id === selectedProvider)?.provider.name}
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Phí vận chuyển: {formatPrice(shippingRates.find(r => r.provider.id === selectedProvider)?.cost || 0)}</p>
                <p>• Thời gian dự kiến: {shippingRates.find(r => r.provider.id === selectedProvider)?.estimatedDays} ngày làm việc</p>
                <p>• Theo dõi đơn hàng: Có</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Free Shipping Notice */}
      {orderValue >= 500000 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-sm text-green-800">
              🎉 Đơn hàng của bạn đủ điều kiện miễn phí vận chuyển!
            </span>
          </div>
        </div>
      )}

      {/* Shipping Policy */}
      <div className="mt-6 text-xs text-gray-500 border-t border-gray-200 pt-4">
        <p className="mb-2"><strong>Chính sách vận chuyển:</strong></p>
        <ul className="space-y-1">
          <li>• Miễn phí vận chuyển cho đơn hàng từ 500,000đ</li>
          <li>• Thời gian giao hàng tính theo ngày làm việc</li>
          <li>• Có thể theo dõi đơn hàng qua mã vận đơn</li>
          <li>• Phí bảo hiểm áp dụng cho đơn hàng giá trị cao</li>
        </ul>
      </div>
    </div>
  );
}
