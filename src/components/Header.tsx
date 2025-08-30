import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, Settings, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AuthModal from './AuthModal';
import ServerStatusComponent from './ServerStatus';

export default function Header() {
  const { state, dispatch, auth } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showServerStatus, setShowServerStatus] = useState(false);
  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    auth.signOut();
    if (state.isAdminMode) {
      dispatch({ type: 'TOGGLE_ADMIN_MODE' });
    }
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Y</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">Yapee</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                name="search"
                placeholder="Tìm kiếm sản phẩm, thương hiệu,..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Server Status */}
            <div className="relative">
              <button
                onClick={() => setShowServerStatus(!showServerStatus)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Kiểm tra trạng thái server"
              >
                <AlertTriangle size={20} />
              </button>

              {showServerStatus && (
                <div className="absolute right-0 mt-2 w-96 z-50">
                  <ServerStatusComponent />
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <User size={24} />
                {state.user && <span className="hidden md:block">{state.user.name}</span>}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {!state.user ? (
                    <>
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Đăng nhập
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="font-medium">{state.user.name}</p>
                        <p className="text-sm text-gray-500">{state.user.email}</p>
                      </div>
                      {state.user.role === 'admin' && (
                        <button
                          onClick={() => dispatch({ type: 'TOGGLE_ADMIN_MODE' })}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Settings size={16} />
                          <span>{state.isAdminMode ? 'Chế độ User' : 'Chế độ Admin'}</span>
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </header>
  );
}