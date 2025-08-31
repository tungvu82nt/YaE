// Shipping Service - Tích hợp với các nhà cung cấp vận chuyển Việt Nam
import { ShippingProvider } from '../types';

export interface ShippingRate {
  provider: ShippingProvider;
  cost: number;
  estimatedDays: number;
  trackingAvailable: boolean;
}

export interface ShippingCalculationRequest {
  fromDistrict: string;
  toDistrict: string;
  weight: number; // grams
  value: number; // VND
}

class ShippingService {
  private providers: ShippingProvider[] = [
    {
      id: 'ghtk',
      name: 'Giao Hàng Tiết Kiệm',
      code: 'GHTK',
      logo: '/images/shipping/ghtk.png',
      trackingUrl: 'https://khachhang.ghtk.vn/tracking',
      estimatedDeliveryDays: 3
    },
    {
      id: 'ghn',
      name: 'Giao Hàng Nhanh',
      code: 'GHN',
      logo: '/images/shipping/ghn.png',
      trackingUrl: 'https://donhang.ghn.vn/',
      estimatedDeliveryDays: 2
    },
    {
      id: 'vnpost',
      name: 'Vietnam Post',
      code: 'VNPOST',
      logo: '/images/shipping/vnpost.png',
      trackingUrl: 'https://www.vnpost.vn/',
      estimatedDeliveryDays: 5
    }
  ];

  // Tính phí vận chuyển cơ bản
  calculateShippingCost(request: ShippingCalculationRequest): ShippingRate[] {
    const rates: ShippingRate[] = [];

    for (const provider of this.providers) {
      let baseCost = this.getBaseCost(provider.id, request.weight);
      let distanceMultiplier = this.getDistanceMultiplier(request.fromDistrict, request.toDistrict);
      let valueSurcharge = this.getValueSurcharge(request.value);

      const totalCost = Math.round((baseCost * distanceMultiplier) + valueSurcharge);

      rates.push({
        provider,
        cost: totalCost,
        estimatedDays: provider.estimatedDeliveryDays,
        trackingAvailable: true
      });
    }

    return rates.sort((a, b) => a.cost - b.cost); // Sort by cost (cheapest first)
  }

  // Lấy chi phí cơ bản theo trọng lượng
  private getBaseCost(providerId: string, weight: number): number {
    const weightKg = weight / 1000;

    switch (providerId) {
      case 'ghtk':
        if (weightKg <= 0.5) return 25000;
        if (weightKg <= 1) return 30000;
        if (weightKg <= 2) return 35000;
        return 35000 + Math.floor((weightKg - 2) / 0.5) * 5000;

      case 'ghn':
        if (weightKg <= 0.5) return 22000;
        if (weightKg <= 1) return 27000;
        if (weightKg <= 2) return 32000;
        return 32000 + Math.floor((weightKg - 2) / 0.5) * 4500;

      case 'vnpost':
        if (weightKg <= 0.5) return 30000;
        if (weightKg <= 1) return 35000;
        if (weightKg <= 2) return 40000;
        return 40000 + Math.floor((weightKg - 2) / 0.5) * 6000;

      default:
        return 25000;
    }
  }

  // Hệ số khoảng cách (giả lập)
  private getDistanceMultiplier(fromDistrict: string, toDistrict: string): number {
    // Trong thực tế, sẽ tính dựa trên API maps hoặc database khoảng cách
    if (fromDistrict.includes('Hồ Chí Minh') && toDistrict.includes('Hồ Chí Minh')) {
      return 1.0; // Nội thành
    } else if (fromDistrict.includes('Hồ Chí Minh') || toDistrict.includes('Hồ Chí Minh')) {
      return 1.2; // Từ/tới TP.HCM
    } else {
      return 1.5; // Các tỉnh khác
    }
  }

  // Phụ phí bảo hiểm theo giá trị
  private getValueSurcharge(value: number): number {
    if (value <= 1000000) return 0; // Miễn phí bảo hiểm dưới 1 triệu
    if (value <= 3000000) return Math.round(value * 0.005); // 0.5%
    if (value <= 10000000) return Math.round(value * 0.003); // 0.3%
    return Math.round(value * 0.002); // 0.2% cho đơn hàng giá trị cao
  }

  // Tạo tracking number
  generateTrackingNumber(providerId: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    switch (providerId) {
      case 'ghtk':
        return `GHTK${timestamp.toString().slice(-8)}${random}`;
      case 'ghn':
        return `GHN${timestamp.toString().slice(-8)}${random}`;
      case 'vnpost':
        return `VN${timestamp.toString().slice(-6)}${random}`;
      default:
        return `SHIP${timestamp.toString().slice(-8)}${random}`;
    }
  }

  // Tính ngày giao hàng dự kiến
  calculateEstimatedDelivery(providerId: string, orderDate: Date = new Date()): Date {
    const provider = this.providers.find(p => p.id === providerId);
    const estimatedDays = provider?.estimatedDeliveryDays || 3;

    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + estimatedDays);

    // Skip weekends for business days calculation
    while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    return deliveryDate;
  }

  // Validate địa chỉ giao hàng
  validateShippingAddress(address: {
    name: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    city: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.name || address.name.trim().length < 2) {
      errors.push('Tên người nhận phải có ít nhất 2 ký tự');
    }

    if (!address.phone || !/^(\+84|84|0)[3-9][0-9]{8}$/.test(address.phone.replace(/\s/g, ''))) {
      errors.push('Số điện thoại không hợp lệ');
    }

    if (!address.address || address.address.trim().length < 10) {
      errors.push('Địa chỉ phải có ít nhất 10 ký tự');
    }

    if (!address.ward || address.ward.trim().length < 2) {
      errors.push('Phường/xã không được để trống');
    }

    if (!address.district || address.district.trim().length < 2) {
      errors.push('Quận/huyện không được để trống');
    }

    if (!address.city || address.city.trim().length < 2) {
      errors.push('Tỉnh/thành phố không được để trống');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Lấy tất cả providers
  getProviders(): ShippingProvider[] {
    return this.providers;
  }

  // Lấy provider theo ID
  getProvider(providerId: string): ShippingProvider | undefined {
    return this.providers.find(p => p.id === providerId);
  }

  // Tính tổng trọng lượng đơn hàng (giả lập)
  calculateOrderWeight(items: Array<{ product: any; quantity: number }>): number {
    // Trong thực tế sẽ dựa trên database sản phẩm
    let totalWeight = 0;

    items.forEach(item => {
      // Giả lập trọng lượng sản phẩm (200g - 2000g)
      const productWeight = Math.floor(Math.random() * 1800) + 200;
      totalWeight += productWeight * item.quantity;
    });

    return totalWeight;
  }

  // Format tracking URL
  getTrackingUrl(providerId: string, trackingNumber: string): string {
    const provider = this.getProvider(providerId);
    if (provider?.trackingUrl) {
      return `${provider.trackingUrl}${trackingNumber}`;
    }
    return '';
  }
}

export const shippingService = new ShippingService();
