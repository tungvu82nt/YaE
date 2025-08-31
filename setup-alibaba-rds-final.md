# 🚀 HƯỚNG DẪN SETUP ALIBABA CLOUD RDS - FINAL VERSION

## 📋 THÔNG TIN DATABASE HIỆN TẠI

### **Connection Details:**
```
🌐 Network Type: VPC (Virtual Private Cloud)
🏢 VPC ID: vpc-t4nmy4krub66fs7v9v5ai
📍 CIDR: 172.16.0.0/12
🔌 Database Proxy: Enabled

📡 Internal Host: rm-gs5wmnw28364t27ia.mysql.singapore.rds.aliyuncs.com
🔓 External Host: rm-gs5wmnw28364t27iago.mysql.singapore.rds.aliyuncs.com
🔌 Port: 3306
📊 Database: kk121
```

### **User Credentials:**
```
👤 Primary User: vutung82nt
👤 Alternative User: Userkk1213
🔑 Password: Dh1206@@
```

### **Tenant Information:**
```
🆔 Tenant ID: 1801054
🔢 Tenant UID: 5572856589532867
👑 Owner: kk1213
```

---

## 🔧 SETUP BƯỚC MỘT: ĐĂNG NHẬP ALIBABA CLOUD

### **1.1 Truy cập Alibaba Cloud Console**
1. Mở trình duyệt
2. Truy cập: https://account.alibabacloud.com/login/login.htm
3. Đăng nhập với tài khoản của bạn

### **1.2 Chọn Region**
- Chọn **Asia Pacific (Singapore)** - ap-southeast-1
- Verify bạn đang ở đúng region

---

## 🔧 SETUP BƯỚC HAI: TẠO DATABASE USERS

### **2.1 Tìm RDS Instance**
1. Ở thanh search → Gõ **RDS**
2. Click vào **RDS** → **Instances**
3. Tìm instance với ID: `rm-gs5wmnw28364t27ia`
4. Click vào instance để vào trang quản lý

### **2.2 Tạo User Account**
1. Trong RDS Console → **Database Management** → **Accounts**
2. Click **Create Account**

### **2.3 Tạo User `vutung82nt`**
```
Account Name: vutung82nt
Account Type: High Privilege
Password: Dh1206@@
Confirm Password: Dh1206@@
Description: YaE Project Primary User
```

### **2.4 Tạo User `Userkk1213` (Alternative)**
```
Account Name: Userkk1213
Account Type: High Privilege
Password: Dh1206@@
Confirm Password: Dh1206@@
Description: YaE Project Alternative User
```

---

## 🔧 SETUP BƯỚC BA: CẤU HÌNH WHITELIST

### **3.1 Vào Whitelist Settings**
1. Trong RDS Console → **Data Security** → **Whitelist Settings**
2. Click **Create Whitelist** hoặc **Modify** existing

### **3.2 Thêm IP của bạn**
```
Whitelist Name: YaE_Development_Access
IP Addresses: 27.64.140.215
Description: YaE Project Development IP Access
```

**Quan trọng:** Phải thêm IP `27.64.140.215` để có thể kết nối từ máy tính của bạn!

---

## 🔧 SETUP BƯỚC BỐN: VERIFY DATABASE

### **4.1 Kiểm tra Database `kk121`**
1. Trong RDS Console → **Databases**
2. Tìm database `kk121`
3. Nếu không có → **Create Database**:
   ```
   Database Name: kk121
   Supported Character Set: utf8mb4
   Collation: utf8mb4_unicode_ci
   Description: YaE E-commerce Database
   ```

### **4.2 Cấp Quyền cho Users**
1. Trong **Accounts** → Click vào user `vutung82nt`
2. Click **Modify Permissions**
3. Chọn database `kk121`
4. ✅ Check ALL permissions
5. Click **OK**

6. Lặp lại cho user `Userkk1213`

---

## 🔧 SETUP BƯỚC NĂM: TEST CONNECTION

### **5.1 Test từ YaE Project**
```bash
# Test connection với user chính
npm run cloud:test

# Hoặc test trực tiếp
node simple-user-test.js
```

### **5.2 Expected Results:**
```bash
✅ Connection successful!
📊 MySQL Version: 8.x.x
📋 Current Database: kk121
```

### **5.3 Nếu Connection Failed:**
```bash
❌ Access denied for user 'vutung82nt'@'27.64.140.215'
```

**Giải pháp:**
- ✅ Kiểm tra user đã được tạo chưa
- ✅ Verify password đúng
- ✅ Check IP đã được thêm vào whitelist
- ✅ Verify database permissions

---

## 🔧 SETUP BƯỚC SÁU: IMPORT DATABASE SCHEMA

### **6.1 Auto Import Schema**
```bash
# Import tables và sample data
npm run cloud:setup
```

### **6.2 Manual Import (Alternative)**
```bash
# Connect to database
npm run cloud:connect

# Then run:
mysql> USE kk121;
mysql> SOURCE setup-cloud-db.sql;
```

### **6.3 Verify Import**
```bash
# Check tables created
mysql> SHOW TABLES;

# Expected tables:
# users, categories, products, orders, order_items, reviews
```

---

## 🔧 SETUP BƯỚC BẢY: TEST PROJECT INTEGRATION

### **7.1 Test Database với Project**
```bash
# Test project database integration
npm run db:test

# Start development server
npm run dev
```

### **7.2 Verify Application**
1. Mở browser: http://localhost:5173
2. Test login với: `admin` / `password123`
3. Verify products hiển thị từ database
4. Test add to cart functionality

---

## 📊 DATABASE SCHEMA OVERVIEW

### **Tables sẽ được tạo:**
- `users` - Thông tin người dùng
- `categories` - Danh mục sản phẩm
- `products` - Thông tin sản phẩm
- `orders` - Đơn hàng
- `order_items` - Chi tiết đơn hàng
- `reviews` - Đánh giá sản phẩm

### **Sample Data:**
- 1 Admin user (username: admin)
- 8 Product categories
- 6 Sample products
- Foreign key constraints
- Proper indexes

---

## 🚀 QUICK START COMMANDS

```bash
# 1. Test connection
npm run cloud:test

# 2. Setup database schema
npm run cloud:setup

# 3. Test project integration
npm run db:test

# 4. Start development
npm run dev

# 5. Open browser
http://localhost:5173
```

---

## 🔍 TROUBLESHOOTING GUIDE

### **Lỗi: Connection Timeout**
```
❌ Error: connect ETIMEDOUT
```
**Solutions:**
- ✅ RDS instance đang chạy
- ✅ IP trong whitelist
- ✅ Network connectivity

### **Lỗi: Access Denied**
```
❌ Error: Access denied for user 'xxx'@'27.64.140.215'
```
**Solutions:**
- ✅ User exists in RDS console
- ✅ Password correct
- ✅ User has permissions on kk121
- ✅ IP 27.64.140.215 in whitelist

### **Lỗi: Unknown Database**
```
❌ Error: Unknown database 'kk121'
```
**Solutions:**
- ✅ Database kk121 exists
- ✅ User has access to database
- ✅ Database name spelling correct

---

## 📞 SUPPORT INFORMATION

### **Alibaba Cloud Resources:**
- [RDS Documentation](https://www.alibabacloud.com/help/en/rds/)
- [Whitelist Configuration](https://www.alibabacloud.com/help/en/rds/developer-reference/configure-an-ip-address-whitelist-for-an-apsaradb-rds-for-mysql-instance)
- [User Management](https://www.alibabacloud.com/help/en/rds/developer-reference/create-a-database-account-for-an-apsaradb-rds-for-mysql-instance)

### **YaE Project Scripts:**
- `npm run cloud:test` - Test connection
- `npm run cloud:setup` - Setup database
- `npm run cloud:connect` - Connect to DB
- `npm run db:test` - Test project integration

---

## ✅ VERIFICATION CHECKLIST

- [ ] Alibaba Cloud Console access
- [ ] RDS instance `rm-gs5wmnw28364t27ia` exists
- [ ] User `vutung82nt` created with password `Dh1206@@`
- [ ] User `Userkk1213` created (backup)
- [ ] Database `kk121` exists
- [ ] IP `27.64.140.215` in whitelist
- [ ] Users have permissions on kk121 database
- [ ] Connection test passes
- [ ] Schema import successful
- [ ] Sample data loaded
- [ ] Project integration works

---

## 🎯 FINAL STATUS

### **✅ Đã hoàn thành:**
- ✅ Cấu hình .env với thông tin Alibaba Cloud RDS
- ✅ Tạo test scripts cho cả hai users
- ✅ Setup project integration files
- ✅ Tạo hướng dẫn chi tiết

### **⏳ Cần setup trên Alibaba Cloud:**
- ❌ Tạo users `vutung82nt` và `Userkk1213`
- ❌ Thêm IP `27.64.140.215` vào whitelist
- ❌ Verify database `kk121` exists
- ❌ Grant permissions cho users

---

## 🚀 NEXT STEPS

1. ✅ **Complete Alibaba Cloud Setup** - Follow steps above
2. 🔄 **Test Connection** - `npm run cloud:test`
3. 🔄 **Import Schema** - `npm run cloud:setup`
4. 🔄 **Project Integration** - `npm run db:test`
5. 🚀 **Development Ready** - `npm run dev`

**🎊 YaE project đã sẵn sàng cho Alibaba Cloud RDS!**

**📞 Cần hỗ trợ setup Alibaba Cloud Console?**
