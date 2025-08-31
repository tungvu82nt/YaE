# 🚀 MYSQL QUICK START FOR YAPE PROJECT

## 📋 QUICK START GUIDE

### Bước 1: Cài đặt MySQL
```bash
# Tải MySQL Installer
1. Truy cập: https://dev.mysql.com/downloads/installer/
2. Tải "MySQL Installer for Windows"
3. Chạy installer
4. Chọn "Developer Default" setup
5. Đặt password cho root user (ghi nhớ!)
```

### Bước 2: Setup Database
```bash
# Chạy script setup tự động
run-mysql-setup.bat
```

### Bước 3: Test Connection
```bash
# Test MySQL connection
test-mysql-connection.bat
```

### Bước 4: Chạy Project
```bash
# Install dependencies
npm install

# Test database connection
npm run db:test

# Start application
npm run dev
```

---

## 📁 FILES CREATED

### Setup Files:
- `mysql-install-guide.cmd` - Hướng dẫn cài đặt MySQL
- `setup-mysql-database.sql` - Script tạo database và tables
- `run-mysql-setup.bat` - Script setup tự động
- `test-mysql-connection.bat` - Script test connection

### Project Files:
- `src/lib/database.js` - Database connection
- `src/services/apiClient.js` - API client for MySQL
- `scripts/run-migration.js` - Migration runner
- `scripts/import-mock-data.js` - Data importer
- `scripts/test-db-setup.js` - Database tests

---

## 🔧 MANUAL SETUP (Nếu cần)

### Tạo Database Thủ Công:
```sql
-- Mở MySQL Command Line Client
mysql -u root -p

-- Chạy các lệnh sau:
CREATE DATABASE yapee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'yapee_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON yapee_db.* TO 'yapee_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Import Schema:
```bash
mysql -u yapee_user -p yapee_db < setup-mysql-database.sql
```

---

## 📊 DATABASE INFO

### Connection Details:
```
Host: localhost
User: yapee_user
Password: password123
Database: yapee_db
Port: 3306
```

### Sample Data:
- **1 Admin User**: `admin` / `admin123`
- **8 Categories**: Điện thoại, Điện tử, Thời trang, etc.
- **6 Products**: iPhone, Samsung, MacBook, etc.

---

## 🎯 AVAILABLE SCRIPTS

```bash
# Test database connection
npm run db:test

# Run migrations (create tables)
npm run db:migrate

# Import sample data
npm run db:seed

# Reset everything
npm run db:reset

# Start development server
npm run dev
```

---

## 🔍 TROUBLESHOOTING

### MySQL Service Not Running:
```bash
# Start MySQL service
net start mysql

# Or through Windows Services
services.msc
```

### Connection Failed:
```bash
# Check MySQL status
mysql --version
mysql -u yapee_user -p yapee_db -e "SELECT 1;"

# Reset if needed
run-mysql-setup.bat
```

### Permission Issues:
```bash
# Run as Administrator
# Or grant permissions manually
mysql -u root -p
GRANT ALL PRIVILEGES ON yapee_db.* TO 'yapee_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## ✅ VERIFICATION

Sau khi setup xong, bạn sẽ thấy:
- ✅ MySQL service running
- ✅ Database `yapee_db` created
- ✅ User `yapee_user` created
- ✅ All tables created with data
- ✅ Application connects to database
- ✅ CRUD operations working

---

## 🎉 SUCCESS INDICATORS

### Terminal Output:
```
✅ MySQL connection successful!
✅ Database setup completed successfully!
✅ Connection test passed!
🎉 MySQL setup is working perfectly!
```

### Application Logs:
```
✅ MySQL connection successful!
📊 Connected to database: yapee_db
🧪 Testing database setup... ✅
```

---

## 🚀 NEXT STEPS

1. ✅ **MySQL Installed** - Database server ready
2. ✅ **Database Created** - Schema and data loaded
3. ✅ **Connection Tested** - Everything working
4. 🔄 **Start Development** - `npm run dev`

**🎊 Chúc mừng! MySQL đã sẵn sàng cho dự án Yape!**
