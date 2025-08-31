-- ===========================================
-- ALIBABA CLOUD RDS MYSQL SETUP
-- ===========================================

-- Connect to cloud database first, then run these commands

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS yapee_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create user (if not exists)
CREATE USER IF NOT EXISTS 'yapee_user'@'%' IDENTIFIED BY 'password123';
CREATE USER IF NOT EXISTS 'yapee_user'@'localhost' IDENTIFIED BY 'password123';

-- Grant privileges
GRANT ALL PRIVILEGES ON yapee_db.* TO 'yapee_user'@'%';
GRANT ALL PRIVILEGES ON yapee_db.* TO 'yapee_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE yapee_db;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  parent_id INT DEFAULT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  payment_method VARCHAR(50),
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  shipping_address JSON NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create foreign keys
ALTER TABLE categories ADD CONSTRAINT fk_categories_parent
FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE products ADD CONSTRAINT fk_products_category
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE orders ADD CONSTRAINT fk_orders_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;

ALTER TABLE reviews ADD CONSTRAINT fk_reviews_product
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE reviews ADD CONSTRAINT fk_reviews_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE reviews ADD CONSTRAINT fk_reviews_order
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
CREATE INDEX idx_categories_is_active ON categories(is_active);

CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE FULLTEXT INDEX idx_products_search ON products(name, brand, description);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Insert sample data
INSERT IGNORE INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@yapee.local', '$2b$10$hashedpassword', 'Administrator', 'admin');

INSERT IGNORE INTO categories (name, slug, icon, sort_order) VALUES
('Điện Thoại - Máy Tính Bảng', 'dien-thoai', 'Smartphone', 1),
('Điện Tử', 'dien-tu', 'Laptop', 2),
('Thời Trang Nam', 'thoi-trang-nam', 'ShirtIcon', 3),
('Thời Trang Nữ', 'thoi-trang-nu', 'Shirt', 4),
('Mẹ & Bé', 'me-be', 'Baby', 5),
('Nhà Cửa & Đời Sống', 'nha-cua', 'Home', 6),
('Sách & Tiểu Thuyết', 'sach', 'Book', 7),
('Thể Thao & Du Lịch', 'the-thao', 'Bike', 8);

INSERT IGNORE INTO products (name, slug, description, price, original_price, category_id, brand, stock_quantity, sold_count, rating, review_count, images, specifications, tags) VALUES
('iPhone 15 Pro Max 256GB', 'iphone-15-pro-max-256gb', 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP và màn hình Super Retina XDR', 34990000, 36990000, 1, 'Apple', 50, 1250, 4.8, 2847, '["https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg", "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg"]', '{"Màn hình": "6.7 inch Super Retina XDR", "Camera": "48MP + 12MP + 12MP", "Chip": "A17 Pro", "RAM": "8GB", "Bộ nhớ": "256GB"}', '["hot", "new"]'),
('Samsung Galaxy S24 Ultra 512GB', 'samsung-galaxy-s24-ultra-512gb', 'Galaxy S24 Ultra với S Pen tích hợp, camera 200MP và AI Galaxy', 31990000, 33990000, 1, 'Samsung', 35, 890, 4.7, 1893, '["https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg", "https://images.pexels.com/photos/5077404/pexels-photo-5077404.jpeg"]', '{"Màn hình": "6.8 inch Dynamic AMOLED 2X", "Camera": "200MP + 50MP + 12MP + 10MP", "Chip": "Snapdragon 8 Gen 3", "RAM": "12GB", "Bộ nhớ": "512GB"}', '["hot"]'),
('MacBook Air M2 13 inch 256GB', 'macbook-air-m2-13-inch-256gb', 'MacBook Air với chip M2, thiết kế mỏng nhẹ và hiệu năng vượt trội', 27990000, 29990000, 2, 'Apple', 25, 567, 4.9, 1456, '["https://images.pexels.com/photos/18105/pexels-photo.jpg", "https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg"]', '{"Màn hình": "13.6 inch Liquid Retina", "Chip": "Apple M2", "RAM": "8GB", "SSD": "256GB", "Pin": "Lên đến 18 giờ"}', '["bestseller"]'),
('Áo Polo Nam Cao Cấp', 'ao-polo-nam-cao-cap', 'Áo polo nam chất liệu cotton cao cấp, form dáng hiện đại', 299000, 399000, 3, 'Yapee Fashion', 100, 2340, 4.5, 892, '["https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg", "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg"]', '{"Chất liệu": "100% Cotton", "Xuất xứ": "Việt Nam", "Size": "S, M, L, XL, XXL", "Màu sắc": "Đen, Trắng, Xanh navy"}', '["sale"]'),
('Tai Nghe Bluetooth Sony WH-1000XM5', 'tai-nghe-bluetooth-sony-wh-1000xm5', 'Tai nghe chống ồn hàng đầu với âm thanh Hi-Res và pin 30 giờ', 8990000, 9990000, 2, 'Sony', 60, 445, 4.8, 756, '["https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg", "https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg"]', '{"Driver": "30mm", "Kết nối": "Bluetooth 5.2", "Pin": "30 giờ", "Chống ồn": "Active Noise Cancelling", "Trọng lượng": "250g"}', '["bestseller"]'),
('Đầm Maxi Nữ Họa Tiết Hoa', 'dam-maxi-nu-hoa-tiet-hoa', 'Đầm maxi nữ với họa tiết hoa thanh lịch, phù hợp dạo phố và đi chơi', 485000, 650000, 4, 'Yapee Fashion', 80, 1780, 4.6, 634, '["https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg", "https://images.pexels.com/photos/1381553/pexels-photo-1381553.jpeg"]', '{"Chất liệu": "Voan lụa", "Size": "S, M, L, XL", "Màu sắc": "Hoa đỏ, Hoa xanh, Hoa vàng", "Kiểu dáng": "Maxi dài", "Xuất xứ": "Việt Nam"}', '["trending"]');

SELECT '✅ Alibaba Cloud RDS Setup Complete!' as status;
SELECT VERSION() as mysql_version;
SELECT DATABASE() as current_database;
SELECT COUNT(*) as categories_count FROM categories;
SELECT COUNT(*) as products_count FROM products;
SELECT COUNT(*) as users_count FROM users;

