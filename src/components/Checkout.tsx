import React, { useState } from 'react';
import { ArrowLeft, Truck, CreditCard, Banknote, Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Address } from '../types';
import OrderSuccess from './OrderSuccess';
import ShippingCalculator from './ShippingCalculator';
import { shippingService } from '../services/shippingService';

interface CheckoutProps {
  onBack: () => void;
}

type PaymentMethod = 'cod' | 'bank_transfer' | 'cash';

export default function Checkout({ onBack }: CheckoutProps) {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    total: number;
    paymentMethod: string;
  } | null>(null);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: state.user?.name || '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: ''
  });

  const [errors, setErrors] = useState<Partial<Address>>({});
  const [selectedShippingProvider, setSelectedShippingProvider] = useState<string>('ghtk');
  const [shippingCost, setShippingCost] = useState<number>(25000);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Calculate totals
  const subtotal = state.cart.reduce((total, item) =>
    total + item.product.price * item.quantity, 0
  );

  const shippingFee = subtotal >= 500000 ? 0 : shippingCost; // Use calculated shipping cost
  const total = subtotal + shippingFee;

  // Handle shipping provider selection
  const handleShippingProviderSelect = (providerId: string, cost: number) => {
    setSelectedShippingProvider(providerId);
    setShippingCost(cost);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Address> = {};

    if (!shippingAddress.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }

    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(\+84|84|0)[3-9][0-9]{8}$/.test(shippingAddress.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!shippingAddress.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }

    if (!shippingAddress.ward.trim()) {
      newErrors.ward = 'Vui lòng nhập phường/xã';
    }

    if (!shippingAddress.district.trim()) {
      newErrors.district = 'Vui lòng nhập quận/huyện';
    }

    if (!shippingAddress.city.trim()) {
      newErrors.city = 'Vui lòng nhập tỉnh/thành phố';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (state.cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order object with shipping information
      const trackingNumber = shippingService.generateTrackingNumber(selectedShippingProvider);
      const estimatedDelivery = shippingService.calculateEstimatedDelivery(selectedShippingProvider);

      const order = {
        id: `ORD_${Date.now()}`,
        userId: state.user?.id || 'guest',
        userName: shippingAddress.name,
        items: state.cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal: subtotal,
        shippingFee: shippingFee,
        total: total,
        paymentMethod: paymentMethod,
        status: 'pending' as const,
        shippingAddress: shippingAddress,
        trackingNumber: trackingNumber,
        shippingProvider: shippingService.getProvider(selectedShippingProvider)?.name || selectedShippingProvider,
        estimatedDelivery: estimatedDelivery.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Order created:', order);

      // Clear cart after successful order
      dispatch({ type: 'CLEAR_CART' });

      // Show success page
      setOrderSuccess({
        orderId: order.id,
        total: total,
        paymentMethod: paymentMethod
      });

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const paymentMethods = [
    {
      id: 'cod' as PaymentMethod,
      name: 'Thanh toán khi nhận hàng (COD)',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: Banknote,
      fee: 0
    },
    {
      id: 'bank_transfer' as PaymentMethod,
      name: 'Chuyển khoản ngân hàng',
      description: 'Thanh toán qua chuyển khoản',
      icon: CreditCard,
      fee: 0
    },
    {
      id: 'cash' as PaymentMethod,
      name: 'Tiền mặt tại cửa hàng',
      description: 'Thanh toán tại cửa hàng',
      icon: Wallet,
      fee: 0
    }
  ];

  // Show success page if order is completed
  if (orderSuccess) {
    return (
      <OrderSuccess
        orderId={orderSuccess.orderId}
        total={orderSuccess.total}
        paymentMethod={orderSuccess.paymentMethod}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
              >
                <ArrowLeft size={20} />
                <span>Quay lại</span>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Thanh toán</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Truck size={20} />
                <span>Thông tin giao hàng</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) => handleAddressChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập họ và tên"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address}
                    onChange={(e) => handleAddressChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Số nhà, tên đường"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phường/Xã *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.ward}
                      onChange={(e) => handleAddressChange('ward', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.ward ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Phường/Xã"
                    />
                    {errors.ward && (
                      <p className="text-red-500 text-sm mt-1">{errors.ward}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quận/Huyện *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.district}
                      onChange={(e) => handleAddressChange('district', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Quận/Huyện"
                    />
                    {errors.district && (
                      <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tỉnh/Thành phố *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Tỉnh/Thành phố"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Shipping Calculator */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ShippingCalculator
                cartItems={state.cart}
                orderValue={subtotal}
                shippingAddress={shippingAddress}
                selectedProvider={selectedShippingProvider}
                onProviderSelect={handleShippingProviderSelect}
              />
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <CreditCard size={20} />
                <span>Phương thức thanh toán</span>
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="mr-3"
                      />
                      <Icon size={24} className="text-gray-600 mr-3" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                        {method.fee > 0 && (
                          <div className="text-sm text-red-600">Phí: {formatPrice(method.fee)}</div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

              {/* Order Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {state.cart.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-gray-900">
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>

                {shippingFee > 0 && (
                  <p className="text-xs text-gray-500">
                    Miễn phí vận chuyển cho đơn hàng từ 500,000đ
                  </p>
                )}

                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Tổng cộng:</span>
                    <span className="text-red-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || state.cart.length === 0}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Đặt hàng ({state.cart.length} sản phẩm)</span>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Thông tin thanh toán được bảo mật và mã hóa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
