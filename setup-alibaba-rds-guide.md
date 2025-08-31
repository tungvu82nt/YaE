# 🚀 HƯỚNG DẪN SETUP ALIBABA CLOUD RDS CHO YAEE PROJECT

## 📋 THÔNG TIN DATABASE HIỆN TẠI

```
🌐 Network Type: VPC (Virtual Private Cloud)
🏢 VPC ID: vpc-t4nmy4krub66fs7v9v5ai
📍 CIDR: 172.16.0.0/12
🔌 Database Proxy: Enabled

📡 Internal Address: rm-gs5wmnw28364t27ia.mysql.singapore.rds.aliyuncs.com
🔓 External Address: rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com
🔌 Port: 3306
```

---

## 🔧 BƯỚC 1: TRUY CẬP ALIBABA CLOUD CONSOLE

### 1.1 Đăng nhập Alibaba Cloud
1. Truy cập: https://account.alibabacloud.com/login/login.htm
2. Đăng nhập với tài khoản của bạn
3. Chọn region **Singapore** (hoặc region chứa RDS instance)

### 1.2 Tìm RDS Instance
1. **Search** → **RDS**
2. **Chọn** RDS instance của bạn
3. **Verify** thông tin:
   - Instance ID: `rm-gs5wmnw28364t27ia`
   - Status: Running
   - Engine: MySQL

---

## 🔧 BƯỚC 2: TẠO DATABASE USER

### 2.1 Vào Database Accounts
1. Trong RDS Console → **Database Management**
2. Click **Accounts** tab
3. Click **Create Account**

### 2.2 Tạo User `yapee_user`
```
Account Name: yapee_user
Account Type: High Privilege (recommended)
Password: password123
Confirm Password: password123
Description: YaE Project Database User
```

### 2.3 Cấp Quyền cho Database
1. Sau khi tạo user → **Modify Permissions**
2. **Database Name**: `yapee_db`
3. **Permissions**: Check ALL permissions
4. **Authorized Databases**: `yapee_db`
5. Click **OK**

---

## 🔧 BƯỚC 3: CẤU HÌNH WHITELIST

### 3.1 Vào Whitelist Settings
1. Trong RDS Console → **Data Security**
2. Click **Whitelist Settings**

### 3.2 Thêm IP của bạn
```
Whitelist Name: YaE_Development
IP Addresses: 27.64.140.215
Description: YaE Project Development IP
```

### 3.3 Lưu ý quan trọng
- **Internal Access**: Chỉ dùng trong VPC (bảo mật hơn)
- **External Access**: Thêm IP public của bạn
- **Temporary**: Có thể dùng `0.0.0.0/0` cho development (ít bảo mật)

---

## 🔧 BƯỚC 4: TẠO DATABASE

### 4.1 Vào Database Management
1. Trong RDS Console → **Databases**
2. Click **Create Database**

### 4.2 Tạo Database `yapee_db`
```
Database Name: yapee_db
Character Set: utf8mb4
Collation: utf8mb4_unicode_ci
Description: YaE E-commerce Database
```

### 4.3 Verify Database
- Database sẽ xuất hiện trong danh sách
- Status: Running

---

## 🔧 BƯỚC 5: TEST CONNECTION

### 5.1 Test từ Project
```bash
# Test connection
npm run cloud:test

# Hoặc test đơn giản
node simple-cloud-test.js
```

### 5.2 Expected Result
```bash
✅ Connection successful!
📊 MySQL Version: 8.x.x
📋 Available databases: yapee_db, ...
```

---

## 🔧 BƯỚC 6: IMPORT DATABASE SCHEMA

### 6.1 Import Tables & Data
```bash
# Import schema và sample data
npm run cloud:setup

# Hoặc import thủ công
mysql -h rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com -u yapee_user -p yapee_db < setup-cloud-db.sql
```

### 6.2 Verify Import
```bash
# Kiểm tra tables đã tạo
mysql -h rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com -u yapee_user -p yapee_db -e "SHOW TABLES;"

# Kiểm tra data
mysql -h rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com -u yapee_user -p yapee_db -e "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM products;"
```

---

## 🔧 BƯỚC 7: TEST PROJECT INTEGRATION

### 7.1 Test Database Functions
```bash
# Test project database integration
npm run db:test

# Test với mock data fallback
npm run dev
```

### 7.2 Verify Application
1. Mở browser → http://localhost:5173
2. Test các tính năng:
   - Đăng nhập (admin/password123)
   - Xem sản phẩm
   - Thêm vào giỏ hàng
   - Đặt hàng

---

## 🛠️ TROUBLESHOOTING

### Lỗi: Connection Timeout
```
❌ Error: connect ETIMEDOUT
```
**Giải pháp:**
- Kiểm tra instance đang chạy
- Verify whitelist includes your IP
- Try external address if internal fails

### Lỗi: Access Denied
```
❌ Error: Access denied for user 'yapee_user'
```
**Giải pháp:**
- Verify user exists in RDS console
- Check password is correct
- Ensure user has permissions on yapee_db
- Confirm whitelist settings

### Lỗi: Database Not Found
```
❌ Error: Unknown database 'yapee_db'
```
**Giải pháp:**
- Create database in RDS console
- Grant user permissions on the database
- Verify database name spelling

---

## 📊 DATABASE SCHEMA OVERVIEW

### Tables được tạo:
- `users` - Thông tin người dùng
- `categories` - Danh mục sản phẩm
- `products` - Thông tin sản phẩm
- `orders` - Đơn hàng
- `order_items` - Chi tiết đơn hàng
- `reviews` - Đánh giá sản phẩm

### Sample Data:
- 1 Admin user
- 8 Categories (Điện thoại, Laptop, Thời trang, v.v.)
- 6 Sample products
- Foreign key constraints
- Indexes for performance

---

## 🔐 SECURITY NOTES

### Production Settings:
- ✅ Use Internal Address (VPC only)
- ✅ Restrict IP whitelist
- ✅ Enable SSL connections
- ✅ Use strong passwords
- ✅ Monitor access logs

### Development Settings:
- ⚠️ External Address (accessible)
- ⚠️ Broad IP whitelist
- ✅ SSL connections
- ✅ Regular backup checks

---

## 📞 SUPPORT RESOURCES

### Alibaba Cloud Documentation:
- [RDS User Guide](https://www.alibabacloud.com/help/en/rds/)
- [Whitelist Configuration](https://www.alibabacloud.com/help/en/rds/developer-reference/configure-an-ip-address-whitelist-for-an-apsaradb-rds-for-mysql-instance)
- [Database Management](https://www.alibabacloud.com/help/en/rds/developer-reference/create-a-database-on-an-apsaradb-rds-for-mysql-instance)

### MySQL Resources:
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Connection Troubleshooting](https://dev.mysql.com/doc/mysql-errors/8.0/en/)

---

## ✅ VERIFICATION CHECKLIST

- [ ] Alibaba Cloud Console access
- [ ] RDS instance running
- [ ] User `yapee_user` created with password `password123`
- [ ] Database `yapee_db` created
- [ ] IP `27.64.140.215` in whitelist
- [ ] Connection test passes
- [ ] Schema import successful
- [ ] Sample data loaded
- [ ] Project integration works
- [ ] Application functions properly

---

## 🚀 QUICK START COMMANDS

```bash
# 1. Test connection
npm run cloud:test

# 2. Import schema
npm run cloud:setup

# 3. Test project
npm run db:test

# 4. Start development
npm run dev

# 5. Connect manually
npm run cloud:connect
```

---

## 🎯 NEXT STEPS

1. ✅ **Setup Alibaba Cloud RDS** - Complete above steps
2. 🔄 **Test Connection** - Run npm run cloud:test
3. 🔄 **Import Data** - Run npm run cloud:setup
4. 🔄 **Project Integration** - Run npm run db:test
5. 🚀 **Development Ready** - Start coding!

**🎊 Chúc mừng! YaE project đã sẵn sàng với Alibaba Cloud RDS!**
