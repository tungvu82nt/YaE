# 🚀 HƯỚNG DẪN SETUP MYSQL DATABASE CHO DỰ ÁN YAPE

## 📋 MỤC LỤC
1. [Cài đặt MySQL](#1-cài-đặt-mysql)
2. [Cấu hình Database](#2-cấu-hình-database)
3. [Chạy Migration](#3-chạy-migration)
4. [Import Mock Data](#4-import-mock-data)
5. [Cấu hình Environment](#5-cấu-hình-environment)
6. [Chạy ứng dụng](#6-chạy-ứng-dụng)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. CÀI ĐẶT MYSQL

### Tải MySQL Installer
```
1. Truy cập: https://dev.mysql.com/downloads/installer/
2. Chọn "MySQL Installer for Windows"
3. Download và chạy installer
4. Chọn "Developer Default" setup type
5. Hoàn thành cài đặt
```

### Cài đặt qua XAMPP (Dễ hơn)
```
1. Tải XAMPP: https://www.apachefriends.org/
2. Cài đặt và chạy XAMPP
3. Start MySQL module trong XAMPP Control Panel
```

---

## 2. CẤU HÌNH DATABASE

### Tạo Database và User
```sql
-- Mở MySQL Command Line Client hoặc phpMyAdmin
-- Chạy các lệnh sau:

-- Tạo database
CREATE DATABASE yapee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user
CREATE USER 'yapee_user'@'localhost' IDENTIFIED BY 'password123';

-- Cấp quyền
GRANT ALL PRIVILEGES ON yapee_db.* TO 'yapee_user'@'localhost';

-- Áp dụng thay đổi
FLUSH PRIVILEGES;

-- Kiểm tra
USE yapee_db;
SELECT DATABASE();
```

### Verify Connection
```bash
# Test connection
mysql -u yapee_user -p yapee_db
# Password: password123
```

---

## 3. CHẠY MIGRATION

### Cài đặt Dependencies
```bash
npm install
```

### Chạy Migration Script
```bash
# Chạy migration để tạo tables
npm run db:migrate
```

**Migration sẽ tạo:**
- ✅ `users` table
- ✅ `categories` table
- ✅ `products` table
- ✅ `orders` table
- ✅ `order_items` table
- ✅ `reviews` table
- ✅ Views và stored procedures
- ✅ Triggers và indexes

---

## 4. IMPORT MOCK DATA

### Chạy Import Script
```bash
# Import mock data vào database
npm run db:seed
```

**Sẽ import:**
- 📁 **8 categories**: Điện thoại, Điện tử, Thời trang nam/nữ, etc.
- 📦 **6 products**: iPhone, Samsung, MacBook, etc.
- 👤 **1 admin user**: username: `admin`, password: `admin123`

### Verify Data Import
```sql
-- Kiểm tra data
USE yapee_db;

SELECT COUNT(*) as categories_count FROM categories;
SELECT COUNT(*) as products_count FROM products;
SELECT * FROM users WHERE username = 'admin';

-- Xem sample products
SELECT name, price, brand FROM products LIMIT 5;
```

---

## 5. CẤU HÌNH ENVIRONMENT

### File config.js (đã tạo)
```javascript
// Kiểm tra file config.js đã có cấu hình đúng
module.exports = {
  database: {
    host: 'localhost',
    user: 'yapee_user',
    password: 'password123',
    database: 'yapee_db',
    port: 3306
  }
  // ... other configs
};
```

### Tùy chỉnh cấu hình (tùy chọn)
```javascript
// Sửa file config.js nếu cần
module.exports = {
  database: {
    host: '127.0.0.1',          // Thay đổi host nếu cần
    user: 'your_username',      // Thay đổi username
    password: 'your_password',  // Thay đổi password
    database: 'yapee_db',       // Tên database
    port: 3306                  // Port MySQL (3306 là default)
  }
};
```

---

## 6. CHẠY ỨNG DỤNG

### Development Mode
```bash
npm run dev
```

### Build Production
```bash
npm run build
npm run preview
```

### Test Database Connection
```javascript
// Kiểm tra console log khi chạy app
// Sẽ thấy: "✅ MySQL connection successful!"
```

---

## 7. TROUBLESHOOTING

### Lỗi Connection Failed
```
❌ MySQL connection failed: ER_ACCESS_DENIED_ERROR

Giải pháp:
1. Kiểm tra MySQL service đang chạy
2. Verify username/password trong config.js
3. Kiểm tra user có quyền truy cập database
```

### Lỗi Database Not Found
```
❌ Database 'yapee_db' does not exist

Giải pháp:
1. Tạo database: CREATE DATABASE yapee_db;
2. Chạy lại migration: npm run db:migrate
```

### Lỗi Import Data Failed
```
❌ Import failed: Table doesn't exist

Giải pháp:
1. Đảm bảo migration đã chạy thành công
2. Kiểm tra tables đã được tạo: SHOW TABLES;
3. Chạy lại import: npm run db:seed
```

### Lỗi Port Conflict
```
❌ Port 3306 is already in use

Giải pháp:
1. Thay đổi port trong config.js
2. Hoặc dừng service khác đang dùng port 3306
```

---

## 📊 DATABASE SCHEMA OVERVIEW

### Tables Relationship
```
users (1) ──── (N) orders
    │              │
    │              │
    └── (1) ──── (N) reviews
                   │
categories (1) ─── (N) products
                   │
                   └── (1) ─── (N) order_items
```

### Key Tables
- **`users`**: Thông tin user (id, username, email, role)
- **`categories`**: Danh mục sản phẩm (hierarchical)
- **`products`**: Thông tin sản phẩm đầy đủ
- **`orders`**: Đơn hàng và trạng thái
- **`order_items`**: Chi tiết đơn hàng
- **`reviews`**: Đánh giá sản phẩm

---

## 🎯 FEATURES HIỆN CÓ

### ✅ Database Integration
- 🔗 **Connection Pooling**: Tối ưu kết nối
- 🛡️ **Error Handling**: Fallback to localStorage
- 📊 **Query Optimization**: Indexes và prepared statements
- 🔄 **Auto Migration**: Scripts tự động tạo tables

### ✅ Data Management
- 📦 **CRUD Operations**: Create, Read, Update, Delete
- 🔍 **Advanced Search**: Full-text search, filtering
- 📈 **Statistics**: Order statistics và analytics
- 💾 **Data Persistence**: Survives browser refresh

### ✅ User Experience
- ⚡ **Fast Loading**: Instant data access
- 🔄 **Offline Mode**: Fallback to localStorage
- 🎯 **Real-time Updates**: Live data synchronization
- 🛒 **Shopping Cart**: Persistent cart across sessions

---

## 🚀 NEXT STEPS

### Production Deployment
```bash
# 1. Setup production MySQL server
# 2. Update config.js với production credentials
# 3. Run migrations on production
# 4. Deploy application
```

### Advanced Features (Future)
- 🔐 **Password Hashing**: bcrypt cho security
- 📧 **Email Notifications**: Order confirmations
- 📊 **Analytics Dashboard**: Advanced reporting
- 🔄 **Real-time Updates**: WebSocket integration
- 📱 **API Endpoints**: REST API cho mobile apps

---

## ❓ HỖ TRỢ

Nếu gặp vấn đề:
1. ✅ Kiểm tra MySQL service đang chạy
2. ✅ Verify database credentials
3. ✅ Check migration logs
4. ✅ Test connection manually
5. 📧 Liên hệ support nếu cần

**🎉 Chúc mừng! Database MySQL đã sẵn sàng cho dự án Yapee!**
