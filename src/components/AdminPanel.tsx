import React, { useState } from 'react';
import { Package, Users, ShoppingBag, BarChart3, Plus, Edit, Trash2, Filter, Search, Eye, CheckCircle, Clock, Truck, XCircle, Settings, UserCheck, UserX, Mail, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdminOrders } from '../hooks/useOrders';
import { useAdmin } from '../hooks/useAdmin';
import { Order, Product } from '../types';
import ProductForm from './ProductForm';
import AdminAnalytics from './AdminAnalytics';
import UserManagement from './UserManagement';
// import { Product } from '../types'; // Will be used in future

export default function AdminPanel() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orderStatusFilter, setOrderStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');

  const { allOrders, loading: ordersLoading, updateOrderStatus, bulkUpdateOrders, getAdminStats } = useAdminOrders();
  const {
    adminUsers,
    analytics,
    createProduct,
    updateProduct,
    deleteProduct,
    updateUserRole,
    toggleUserStatus,
    resetUserPassword,
    generateReport,
    exportData
  } = useAdmin();

  // const [editingProduct, setEditingProduct] = useState<Product | null>(null); // For future use

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'products', name: 'Sản phẩm', icon: Package },
    { id: 'orders', name: 'Đơn hàng', icon: ShoppingBag },
    { id: 'users', name: 'Người dùng', icon: Users },
    { id: 'analytics', name: 'Phân tích', icon: BarChart3 },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'confirmed':
      case 'processing':
        return <Package size={16} className="text-blue-500" />;
      case 'shipping':
        return <Truck size={16} className="text-orange-500" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled':
      case 'returned':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      case 'returned':
        return 'Trả hàng';
      default:
        return status;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipping':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'returned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = allOrders.filter(order => {
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    const matchesSearch = orderSearchQuery === '' ||
      order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.userName?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.items.some(item =>
        item.product.name.toLowerCase().includes(orderSearchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      console.log(`✅ Order ${orderId} status updated to ${newStatus}`);
    } else {
      console.error(`❌ Failed to update order ${orderId}`);
    }
  };

  const adminStats = getAdminStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-gray-900">Yapee Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Xin chào, Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <AdminAnalytics
                analytics={analytics}
                onGenerateReport={generateReport}
                onExportData={exportData}
              />
            )}

            {activeTab === 'products' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Quản lý sản phẩm</h2>
                    <button
                      onClick={() => setShowProductForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <Plus size={20} />
                      <span>Thêm sản phẩm</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Danh mục
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tồn kho
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Đã bán
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {state.products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg mr-4"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.sold}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 p-1">
                                <Edit size={16} />
                              </button>
                              <button className="text-red-600 hover:text-red-900 p-1">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                {/* Order Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Tổng đơn</p>
                        <p className="text-2xl font-bold text-gray-900">{adminStats.totalOrders}</p>
                      </div>
                      <ShoppingBag size={24} className="text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Chờ xử lý</p>
                        <p className="text-2xl font-bold text-yellow-600">{adminStats.pendingOrders}</p>
                      </div>
                      <Clock size={24} className="text-yellow-500" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Đang giao</p>
                        <p className="text-2xl font-bold text-orange-600">{adminStats.shippingOrders}</p>
                      </div>
                      <Truck size={24} className="text-orange-500" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Hoàn thành</p>
                        <p className="text-2xl font-bold text-green-600">{adminStats.deliveredOrders}</p>
                      </div>
                      <CheckCircle size={24} className="text-green-500" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Doanh thu</p>
                        <p className="text-2xl font-bold text-purple-600">{formatPrice(adminStats.totalRevenue)}</p>
                      </div>
                      <BarChart3 size={24} className="text-purple-500" />
                    </div>
                  </div>
                </div>

                {/* Orders Management */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Filter size={20} className="text-gray-500" />
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value as Order['status'] | 'all')}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipping">Đang giao hàng</option>
                        <option value="delivered">Đã giao hàng</option>
                        <option value="cancelled">Đã hủy</option>
                        <option value="returned">Trả hàng</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders Table */}
                  {ordersLoading ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">
                        {allOrders.length === 0 ? 'Chưa có đơn hàng nào' : 'Không tìm thấy đơn hàng phù hợp'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mã đơn hàng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Khách hàng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sản phẩm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tổng tiền
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ngày đặt
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                <div className="text-sm text-gray-500">{order.paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản'}</div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                                <div className="text-sm text-gray-500">{order.shippingAddress.phone}</div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={order.items[0].product.image}
                                    alt={order.items[0].product.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {order.items[0].product.name}
                                    </div>
                                    {order.items.length > 1 && (
                                      <div className="text-sm text-gray-500">
                                        +{order.items.length - 1} sản phẩm khác
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {formatPrice(order.total)}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(order.status)}
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusLabel(order.status)}
                                  </span>
                                </div>
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                              </td>

                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    <Eye size={16} />
                                  </button>

                                  {order.status === 'pending' && (
                                    <button
                                      onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      <CheckCircle size={16} />
                                    </button>
                                  )}

                                  {(order.status === 'confirmed' || order.status === 'processing') && (
                                    <button
                                      onClick={() => handleStatusUpdate(order.id, 'shipping')}
                                      className="text-orange-600 hover:text-orange-900"
                                    >
                                      <Truck size={16} />
                                    </button>
                                  )}

                                  {order.status === 'shipping' && (
                                    <button
                                      onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      <CheckCircle size={16} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Product Form Modal */}
                {showProductForm && (
                  <ProductForm
                    product={editingProduct}
                    onSave={async (data) => {
                      if (editingProduct) {
                        return await updateProduct(editingProduct.id, data);
                      } else {
                        return await createProduct(data);
                      }
                    }}
                    onCancel={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                    }}
                  />
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Quản lý người dùng</h2>
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Danh sách người dùng sẽ hiển thị ở đây</p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Thống kê bán hàng</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Tổng doanh thu</h3>
                    <p className="text-3xl font-bold text-blue-600">₫2.4B</p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Đơn hàng</h3>
                    <p className="text-3xl font-bold text-green-600">1,247</p>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Sản phẩm</h3>
                    <p className="text-3xl font-bold text-purple-600">{state.products.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Chi tiết đơn hàng #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>

              {/* Order Status & Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Trạng thái</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedOrder.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Thời gian</h3>
                  <div className="text-sm text-gray-600">
                    <p>Đặt: {formatDate(selectedOrder.createdAt)}</p>
                    {selectedOrder.deliveredAt && (
                      <p>Giao: {formatDate(selectedOrder.deliveredAt)}</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Thanh toán</h3>
                  <div className="text-sm text-gray-600">
                    <p>{selectedOrder.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}</p>
                    <p className="font-medium text-gray-900">{formatPrice(selectedOrder.total)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Thông tin khách hàng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Tên:</span>
                    <p className="text-gray-900">{selectedOrder.shippingAddress.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Số điện thoại:</span>
                    <p className="text-gray-900">{selectedOrder.shippingAddress.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Địa chỉ:</span>
                    <p className="text-gray-900">
                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.ward},<br />
                      {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(item.price)}/cái
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(selectedOrder.shippingFee)}</span>
                  </div>
                  {selectedOrder.discount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatPrice(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Tổng cộng:</span>
                      <span className="text-red-600">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              {(selectedOrder.trackingNumber || selectedOrder.shippingProvider) && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Thông tin vận chuyển</h3>
                  <div className="space-y-2">
                    {selectedOrder.shippingProvider && (
                      <div className="flex items-center space-x-2">
                        <Truck size={16} className="text-blue-600" />
                        <span className="text-blue-800">Đơn vị: {selectedOrder.shippingProvider}</span>
                      </div>
                    )}
                    {selectedOrder.trackingNumber && (
                      <div className="flex items-center space-x-2">
                        <Package size={16} className="text-blue-600" />
                        <span className="text-blue-800">Mã vận đơn: {selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                    {selectedOrder.estimatedDelivery && (
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-blue-600" />
                        <span className="text-blue-800">Dự kiến giao: {formatDate(selectedOrder.estimatedDelivery)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Đóng
                </button>

                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <div className="flex space-x-2">
                    {selectedOrder.status === 'pending' && (
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedOrder.id, 'confirmed');
                          setSelectedOrder(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Xác nhận đơn hàng
                      </button>
                    )}

                    {(selectedOrder.status === 'confirmed' || selectedOrder.status === 'processing') && (
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedOrder.id, 'shipping');
                          setSelectedOrder(null);
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                      >
                        Bắt đầu giao hàng
                      </button>
                    )}

                    {selectedOrder.status === 'shipping' && (
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedOrder.id, 'delivered');
                          setSelectedOrder(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Đã giao thành công
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <UserManagement
          adminUsers={adminUsers}
          onUpdateUserRole={updateUserRole}
          onToggleUserStatus={toggleUserStatus}
          onResetUserPassword={resetUserPassword}
        />
      )}

      {activeTab === 'analytics' && (
        <AdminAnalytics
          analytics={analytics}
          onGenerateReport={generateReport}
          onExportData={exportData}
        />
      )}
    </div>
  );
}