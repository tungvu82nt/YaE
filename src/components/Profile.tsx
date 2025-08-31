import React, { useState } from 'react';
import { User, MapPin, Settings, Camera, Edit, Plus, Trash2, Save, X } from 'lucide-react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useApp } from '../context/AppContext';
import { Address, UserProfile } from '../types';

export default function Profile() {
  const { state } = useApp();
  const {
    profile,
    loading,
    error,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress
  } = useUserProfile(state.user?.id);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: ''
  });

  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const handleSaveProfile = async () => {
    if (!formData || Object.keys(formData).length === 0) return;

    setSaving(true);
    const success = await updateProfile(formData);
    setSaving(false);

    if (success) {
      setEditingSection(null);
      setFormData({});
    }
  };

  const handleSaveAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) return;

    setSaving(true);
    const success = await addAddress(newAddress as Omit<Address, 'id'>);
    setSaving(false);

    if (success) {
      setNewAddress({
        name: '',
        phone: '',
        address: '',
        ward: '',
        district: '',
        city: ''
      });
      setEditingSection(null);
    }
  };

  const handleUpdateAddress = async (addressId: string, updates: Partial<Address>) => {
    setSaving(true);
    const success = await updateAddress(addressId, updates);
    setSaving(false);
    return success;
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;

    setSaving(true);
    const success = await deleteAddress(addressId);
    setSaving(false);
    return success;
  };

  const startEditing = (section: string, data?: any) => {
    setEditingSection(section);
    if (data) {
      setFormData(data);
    } else {
      setFormData(profile || {});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin cá nhân...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <User size={48} className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Có lỗi xảy ra</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chưa có thông tin cá nhân</h2>
          <p className="text-gray-600">Vui lòng đăng nhập để xem thông tin cá nhân</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
              <p className="text-gray-600 mt-1">Quản lý thông tin và cài đặt tài khoản</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={32} className="text-gray-500" />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                    <Camera size={16} />
                  </button>
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 mb-2">{state.user?.email}</p>
                <p className="text-sm text-gray-500">Thành viên từ {new Date(profile.createdAt).getFullYear()}</p>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số địa chỉ:</span>
                    <span className="font-medium">{profile.addresses.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ngôn ngữ:</span>
                    <span className="font-medium">
                      {profile.preferences.language === 'vi' ? 'Tiếng Việt' : 'English'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tiền tệ:</span>
                    <span className="font-medium">{profile.preferences.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>
                {editingSection !== 'personal' && (
                  <button
                    onClick={() => startEditing('personal')}
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <Edit size={16} />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>

              {editingSection === 'personal' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ
                      </label>
                      <input
                        type="text"
                        value={formData.lastName || ''}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên
                      </label>
                      <input
                        type="text"
                        value={formData.firstName || ''}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth || ''}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingSection(null)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      <span>Lưu</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Họ và tên:</span>
                    <span className="font-medium">{profile.lastName} {profile.firstName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{state.user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số điện thoại:</span>
                    <span className="font-medium">{profile.phone}</span>
                  </div>
                  {profile.dateOfBirth && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày sinh:</span>
                      <span className="font-medium">
                        {new Date(profile.dateOfBirth).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <MapPin size={20} />
                  <span>Địa chỉ giao hàng</span>
                </h3>
                <button
                  onClick={() => setEditingSection('addAddress')}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Plus size={16} />
                  <span>Thêm địa chỉ</span>
                </button>
              </div>

              {editingSection === 'addAddress' && (
                <div className="border border-blue-200 rounded-lg p-4 mb-4 bg-blue-50">
                  <h4 className="font-medium text-gray-900 mb-3">Thêm địa chỉ mới</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Họ tên người nhận"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="tel"
                        placeholder="Số điện thoại"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Địa chỉ cụ thể"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Phường/Xã"
                        value={newAddress.ward}
                        onChange={(e) => setNewAddress({...newAddress, ward: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Quận/Huyện"
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({...newAddress, district: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Tỉnh/Thành phố"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setEditingSection(null)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSaveAddress}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? 'Đang lưu...' : 'Lưu địa chỉ'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {profile.addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Chưa có địa chỉ giao hàng</p>
                  <p className="text-sm text-gray-500">Thêm địa chỉ để thuận tiện cho việc mua hàng</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.addresses.map((address, index) => (
                    <div key={address.id || index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">
                            {address.name}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {address.phone}
                          </div>
                          <div className="text-sm text-gray-700">
                            {address.address}, {address.ward}, {address.district}, {address.city}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteAddress(address.id!)}
                            disabled={saving}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Settings size={20} />
                  <span>Cài đặt</span>
                </h3>
                {editingSection !== 'preferences' && (
                  <button
                    onClick={() => startEditing('preferences')}
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <Edit size={16} />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </div>

              {editingSection === 'preferences' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thông báo
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.preferences?.notifications?.email}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences!,
                              notifications: {
                                ...formData.preferences!.notifications!,
                                email: e.target.checked
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm">Email thông báo đơn hàng</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.preferences?.notifications?.sms}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences!,
                              notifications: {
                                ...formData.preferences!.notifications!,
                                sms: e.target.checked
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm">SMS thông báo giao hàng</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.preferences?.notifications?.push}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences!,
                              notifications: {
                                ...formData.preferences!.notifications!,
                                push: e.target.checked
                              }
                            }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm">Push notification</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingSection(null)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      <span>Lưu</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Thông báo:</span>
                    <div className="mt-2 space-y-1">
                      {profile.preferences.notifications.email && (
                        <div className="text-sm text-green-600">✓ Email thông báo đơn hàng</div>
                      )}
                      {profile.preferences.notifications.sms && (
                        <div className="text-sm text-green-600">✓ SMS thông báo giao hàng</div>
                      )}
                      {profile.preferences.notifications.push && (
                        <div className="text-sm text-green-600">✓ Push notification</div>
                      )}
                      {!profile.preferences.notifications.email &&
                       !profile.preferences.notifications.sms &&
                       !profile.preferences.notifications.push && (
                        <div className="text-sm text-gray-500">Không có thông báo nào được bật</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
