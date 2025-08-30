import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { companyInfo } from '../data/mockData';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Y</span>
              </div>
              <span className="text-xl font-bold">Yapee</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {companyInfo.mission}
            </p>
            <div className="flex space-x-4">
              <Facebook size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Youtube size={20} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Chăm sóc khách hàng</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Trung tâm trợ giúp</li>
              <li className="hover:text-white cursor-pointer transition-colors">Hướng dẫn mua hàng</li>
              <li className="hover:text-white cursor-pointer transition-colors">Chính sách bảo hành</li>
              <li className="hover:text-white cursor-pointer transition-colors">Chính sách đổi trả</li>
            </ul>
          </div>

          {/* About Yapee */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Về Yapee</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Giới thiệu</li>
              <li className="hover:text-white cursor-pointer transition-colors">Tuyển dụng</li>
              <li className="hover:text-white cursor-pointer transition-colors">Chính sách bảo mật</li>
              <li className="hover:text-white cursor-pointer transition-colors">Điều khoản sử dụng</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên hệ</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <Phone size={16} />
                <span>{companyInfo.hotline}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} />
                <span>{companyInfo.email.support}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="mt-1" />
                <span>{companyInfo.address}</span>
              </div>
              <div className="text-sm">
                <span>Giờ làm việc: {companyInfo.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Yapee. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}