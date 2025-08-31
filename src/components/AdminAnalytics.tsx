import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Star,
  Package,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { AdminAnalytics as AdminAnalyticsType, AdminReport } from '../types';
import { useAdmin } from '../hooks/useAdmin';

interface AdminAnalyticsProps {
  analytics: AdminAnalyticsType | null;
  onGenerateReport: (type: AdminReport['type']) => void;
  onExportData: (format: 'csv' | 'excel' | 'pdf', data: any) => void;
}

export default function AdminAnalytics({ analytics, onGenerateReport, onExportData }: AdminAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu phân tích...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const handleGenerateReport = async (type: AdminReport['type']) => {
    setGeneratingReport(type);
    await onGenerateReport(type);
    setGeneratingReport(null);
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    onExportData(format, analytics);
  };

  const getPeriodData = () => {
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    return {
      revenue: analytics.sales.revenueByPeriod.slice(-days),
      orders: analytics.sales.ordersByPeriod.slice(-days),
      users: analytics.users.userActivityByPeriod.slice(-days),
      registrations: analytics.users.userRegistrationsByPeriod.slice(-days)
    };
  };

  const periodData = getPeriodData();

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Analytics</h2>
          <p className="text-gray-600">Tổng quan về hoạt động của hệ thống</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">7 ngày</option>
            <option value="30d">30 ngày</option>
            <option value="90d">90 ngày</option>
          </select>

          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(analytics.sales.totalRevenue)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
                <span className="text-sm text-gray-500 ml-2">vs tháng trước</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(analytics.sales.totalOrders)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">+8.2%</span>
                <span className="text-sm text-gray-500 ml-2">vs tháng trước</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingCart size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Users */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatNumber(analytics.users.totalUsers)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-purple-500 mr-1" />
                <span className="text-sm text-purple-600">+15.3%</span>
                <span className="text-sm text-gray-500 ml-2">vs tháng trước</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tỷ lệ chuyển đổi</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatPercentage(analytics.sales.conversionRate)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={16} className="text-orange-500 mr-1" />
                <span className="text-sm text-orange-600">+2.1%</span>
                <span className="text-sm text-gray-500 ml-2">vs tháng trước</span>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Activity size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo thời gian</h3>
            <button
              onClick={() => handleGenerateReport('sales')}
              disabled={generatingReport === 'sales'}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              {generatingReport === 'sales' ? (
                <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <BarChart3 size={16} />
              )}
              <span className="text-sm">Báo cáo</span>
            </button>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {periodData.revenue.map((item, index) => {
              const maxRevenue = Math.max(...periodData.revenue.map(d => d.revenue));
              const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${height}%`, minHeight: '20px' }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top">
                    {new Date(item.date).getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hoạt động người dùng</h3>
            <button
              onClick={() => handleGenerateReport('users')}
              disabled={generatingReport === 'users'}
              className="flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
            >
              {generatingReport === 'users' ? (
                <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <BarChart3 size={16} />
              )}
              <span className="text-sm">Báo cáo</span>
            </button>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {periodData.users.map((item, index) => {
              const maxActivity = Math.max(...periodData.users.map(d => d.activeUsers));
              const height = maxActivity > 0 ? (item.activeUsers / maxActivity) * 100 : 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-purple-500 rounded-t transition-all duration-300 hover:bg-purple-600"
                    style={{ height: `${height}%`, minHeight: '20px' }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top">
                    {new Date(item.date).getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Average Order Value */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <DollarSign size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Giá trị đơn TB</p>
              <p className="font-semibold text-gray-900">
                {formatCurrency(analytics.sales.averageOrderValue)}
              </p>
            </div>
          </div>
        </div>

        {/* New Users Today */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Người dùng mới hôm nay</p>
              <p className="font-semibold text-gray-900">
                {analytics.users.newUsersToday}
              </p>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng sản phẩm</p>
              <p className="font-semibold text-gray-900">
                {formatNumber(analytics.products.totalProducts)}
              </p>
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Star size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đánh giá TB</p>
              <p className="font-semibold text-gray-900">
                {analytics.products.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm bán chạy nhất</h3>
        <div className="space-y-4">
          {analytics.products.topSellingProducts.map((item, index) => (
            <div key={item.product.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">{index + 1}</span>
              </div>
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                <p className="text-sm text-gray-600">{item.product.brand}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatNumber(item.sales)} đã bán
                </p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(item.product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tình trạng hệ thống</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity size={24} className="text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Server Uptime</p>
            <p className="text-lg font-semibold text-gray-900">
              {analytics.system.serverUptime}%
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye size={24} className="text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Tổng đánh giá</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatNumber(analytics.system.totalReviews)}
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package size={24} className="text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Items trong Wishlist</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatNumber(analytics.system.wishlistItems)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
