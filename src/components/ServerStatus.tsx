import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, Wifi, Database, Shield, Server } from 'lucide-react';

interface LocalStatus {
  localStorage: boolean;
  mockData: boolean;
  timestamp: string;
}

export default function ServerStatusComponent() {
  const [status, setStatus] = useState<LocalStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<string>('');

  const checkStatus = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check local storage availability
      const localStorageAvailable = (() => {
        try {
          const test = '__test__';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch {
          return false;
        }
      })();

      const serverStatus: LocalStatus = {
        localStorage: localStorageAvailable,
        mockData: true, // Always available
        timestamp: new Date().toISOString()
      };

      setStatus(serverStatus);
      setLastCheck(new Date().toLocaleTimeString('vi-VN'));
    } catch (error) {
      console.error('Failed to check local status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    // Auto-refresh every 60 seconds (less frequent for local)
    const interval = setInterval(checkStatus, 60000);
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

  const allServicesOnline = status && status.localStorage && status.mockData;

  return (
    <div className={`border rounded-lg p-4 ${
      allServicesOnline ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trạng thái Ứng dụng</h3>
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
              {getStatusIcon(status?.mockData || false)}
              <span className={`text-sm font-medium ${getStatusColor(status?.mockData || false)}`}>
                Mock Data
              </span>
            </div>
            <div className="text-xs text-gray-500">Dữ liệu mẫu</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5 text-gray-400" />
          <div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(status?.localStorage || false)}
              <span className={`text-sm font-medium ${getStatusColor(status?.localStorage || false)}`}>
                Local Storage
              </span>
            </div>
            <div className="text-xs text-gray-500">Lưu trữ cục bộ</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-gray-400" />
          <div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                Offline Mode
              </span>
            </div>
            <div className="text-xs text-gray-500">Hoạt động offline</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Wifi className="w-5 h-5 text-gray-400" />
          <div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                Standalone
              </span>
            </div>
            <div className="text-xs text-gray-500">Độc lập</div>
          </div>
        </div>
      </div>

      {status && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {allServicesOnline ? 'Tất cả chức năng hoạt động bình thường' : 'Một số chức năng có thể bị hạn chế'}
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
              <p className="text-yellow-800 font-medium mb-1">Có vấn đề với local storage</p>
              <p className="text-yellow-700">
                Một số dữ liệu có thể không được lưu. Vui lòng kiểm tra trình duyệt của bạn.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}