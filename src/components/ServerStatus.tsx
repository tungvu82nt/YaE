import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, Wifi, Database, Shield, Server } from 'lucide-react';
import { ServerChecker, ServerStatus } from '../utils/serverCheck';

export default function ServerStatusComponent() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<string>('');

  const checkStatus = async () => {
    setLoading(true);
    try {
      const serverStatus = await ServerChecker.checkAllServices();
      setStatus(serverStatus);
      setLastCheck(new Date().toLocaleTimeString('vi-VN'));
    } catch (error) {
      console.error('Failed to check server status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (isOnline: boolean) => {
    if (loading) return <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />;
    return isOnline ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (isOnline: boolean) => {
    if (loading) return 'text-gray-500';
    return isOnline ? 'text-green-600' : 'text-red-600';
  };

  if (!status && !loading) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 font-medium">Không thể kiểm tra trạng thái server</span>
        </div>
      </div>
    );
  }

  const allServicesOnline = status && Object.values(status).every(value => 
    typeof value === 'boolean' ? value : true
  );

  return (
    <div className={`border rounded-lg p-4 ${
      allServicesOnline ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trạng thái Server</h3>
        <button
          onClick={checkStatus}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Kiểm tra lại</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-3">
          <Server className="w-5 h-5 text-gray-400" />
          <div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status?.supabase || false)}
              <span className={`text-sm font-medium ${getStatusColor(status?.supabase || false)}`}>
                Supabase
              </span>
            </div>
            <div className="text-xs text-gray-500">Backend Server</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5 text-gray-400" />
          <div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status?.database || false)}
              <span className={`text-sm font-medium ${getStatusColor(status?.database || false)}`}>
                Database
              </span>
            </div>
            <div className="text-xs text-gray-500">Cơ sở dữ liệu</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-gray-400" />
          <div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status?.auth || false)}
              <span className={`text-sm font-medium ${getStatusColor(status?.auth || false)}`}>
                Auth
              </span>
            </div>
            <div className="text-xs text-gray-500">Đăng nhập</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Wifi className="w-5 h-5 text-gray-400" />
          <div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status?.storage || false)}
              <span className={`text-sm font-medium ${getStatusColor(status?.storage || false)}`}>
                Storage
              </span>
            </div>
            <div className="text-xs text-gray-500">Lưu trữ</div>
          </div>
        </div>
      </div>

      {status && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {ServerChecker.getStatusMessage(status)}
            </span>
            <span className="text-gray-500">
              Kiểm tra lần cuối: {lastCheck}
            </span>
          </div>
        </div>
      )}

      {!allServicesOnline && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-800 font-medium mb-1">Phát hiện sự cố server</p>
              <p className="text-yellow-700">
                Vui lòng liên hệ <strong>Hotline: 0333.938.014</strong> để được hỗ trợ ngay lập tức.
                Hoặc thử lại sau 5-10 phút.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}