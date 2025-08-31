# 📋 KẾ HOẠCH THIẾT LẬP MYSQL DATABASE CHO DỰ ÁN YAPE

## 🎯 MỤC TIÊU
Chuyển đổi dự án từ mock data + localStorage sang MySQL database thực sự

## 📊 CÁC BƯỚC THỰC HIỆN

### Bước 1: Cài Đặt MySQL Server
```bash
# Windows - Tải MySQL Installer
# Download: https://dev.mysql.com/downloads/installer/
# Hoặc sử dụng XAMPP/WAMP
```

### Bước 2: Cấu Hình Database
```sql
-- Tạo database
CREATE DATABASE yapee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user
CREATE USER 'yapee_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON yapee_db.* TO 'yapee_user'@'localhost';
FLUSH PRIVILEGES;
```

### Bước 3: Thiết Kế Schema
```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('user', 'admin') DEFAULT 'user',
  avatar VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  parent_id INT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category_id INT,
  brand VARCHAR(100),
  sku VARCHAR(100) UNIQUE,
  stock_quantity INT DEFAULT 0,
  sold_count INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INT DEFAULT 0,
  images JSON,
  specifications JSON,
  tags JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  shipping_address JSON NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Reviews table
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  order_id INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  images JSON,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);
```

### Bước 4: Cập Nhật Dependencies
```json
// Thêm vào package.json
{
  "dependencies": {
    "mysql2": "^3.6.0",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "@types/mysql2": "^1.0.0"
  }
}
```

### Bước 5: Tạo Database Connection
```javascript
// src/lib/database.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'yapee_user',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'yapee_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
```

### Bước 6: Tạo Migration Scripts
```javascript
// scripts/migrate.js
import pool from '../src/lib/database.js';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), 'migrations');

  // Read all migration files
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`Running migration: ${file}`);
    await pool.execute(sql);
  }

  console.log('All migrations completed!');
  process.exit(0);
}

runMigrations().catch(console.error);
```

### Bước 7: Cập Nhật Services
```javascript
// src/services/productService.ts
import pool from '../lib/database';

export class ProductService {
  static async getProducts(filters = {}) {
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;

    const params = [];

    if (filters.category) {
      query += ' AND c.slug = ?';
      params.push(filters.category);
    }

    if (filters.search) {
      query += ' AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY p.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    const [rows] = await pool.execute(query, params);
    return { data: rows, error: null };
  }
}
```

### Bước 8: Import Mock Data
```javascript
// scripts/import-mock-data.js
import pool from '../src/lib/database.js';
import { products, categories } from '../src/data/mockData.js';

async function importData() {
  try {
    // Import categories
    for (const category of categories) {
      await pool.execute(
        'INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)',
        [category.name, category.slug, category.icon]
      );
    }

    // Import products
    for (const product of products) {
      const categoryResult = await pool.execute(
        'SELECT id FROM categories WHERE slug = ?',
        [product.category]
      );

      const categoryId = categoryResult[0][0]?.id;

      await pool.execute(
        `INSERT INTO products
         (name, slug, description, price, original_price, category_id, brand,
          stock_quantity, sold_count, rating, review_count, images, specifications, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.name.toLowerCase().replace(/\s+/g, '-'),
          product.description,
          product.price,
          product.originalPrice,
          categoryId,
          product.brand,
          product.stock,
          product.sold,
          product.rating,
          product.reviewCount,
          JSON.stringify(product.images),
          JSON.stringify(product.specifications || {}),
          JSON.stringify(product.tags || [])
        ]
      );
    }

    console.log('Mock data imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    process.exit(0);
  }
}

importData();
```

### Bước 9: Environment Variables
```bash
# .env
DB_HOST=localhost
DB_USER=yapee_user
DB_PASSWORD=password123
DB_NAME=yapee_db
DB_PORT=3306
```

### Bước 10: Cập Nhật Documentation
- Cập nhật `docs/technical-architecture.md`
- Thêm hướng dẫn setup database
- Document API endpoints

## 📅 LỊCH TRÌNH THỰC HIỆN

### Ngày 1: Infrastructure Setup
- [ ] Cài đặt MySQL Server
- [ ] Tạo database và user
- [ ] Cấu hình environment variables

### Ngày 2: Database Design
- [ ] Thiết kế schema tables
- [ ] Tạo migration scripts
- [ ] Test database connection

### Ngày 3: Backend Integration
- [ ] Cập nhật services để sử dụng MySQL
- [ ] Cập nhật hooks
- [ ] Test CRUD operations

### Ngày 4: Data Migration
- [ ] Import mock data vào MySQL
- [ ] Verify data integrity
- [ ] Update localStorage fallbacks

### Ngày 5: Testing & Optimization
- [ ] Test tất cả features
- [ ] Performance optimization
- [ ] Error handling improvements

## 🚀 LỢI ÍCH SAU KHI CHUYỂN ĐỔI

### ✅ Advantages:
- **Persistent Data**: Data không bị mất khi refresh browser
- **Multi-user Support**: Nhiều user có thể sử dụng cùng lúc
- **Real Database**: Query phức tạp, relationships
- **Scalability**: Có thể mở rộng dễ dàng
- **Backup/Restore**: Database backup và restore
- **Data Integrity**: Constraints và validation

### ⚠️ Challenges:
- **Setup Complexity**: Cần cài đặt và cấu hình MySQL
- **Network Latency**: Database queries có latency
- **Connection Management**: Pool connections
- **Migration Complexity**: Chuyển đổi data structure

## 🔧 CÔNG CỤ CẦN THIẾT

### Required Software:
- MySQL Server 8.0+
- Node.js với mysql2 package
- Database management tool (MySQL Workbench, phpMyAdmin)

### Development Tools:
- Database migration scripts
- Data seeding scripts
- Connection pooling
- Error logging

## 📝 CHECKLIST HOÀN THÀNH

- [ ] MySQL Server installed and configured
- [ ] Database created with proper charset
- [ ] User permissions set up
- [ ] Schema designed and implemented
- [ ] Migration scripts created
- [ ] Services updated to use MySQL
- [ ] Hooks updated for database operations
- [ ] Mock data imported successfully
- [ ] All features tested with MySQL
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Environment variables configured
