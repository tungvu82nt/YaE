@echo off
echo ===========================================
echo    HUONG DAN CAI DAT MYSQL SERVER
echo ===========================================
echo.
echo Buoc 1: Tai MySQL Installer
echo -----------------------------
echo 1. Mo trinh duyet den: https://dev.mysql.com/downloads/installer/
echo 2. Tai "MySQL Installer for Windows"
echo 3. Chay file installer da tai
echo.
echo Buoc 2: Cai dat MySQL
echo ----------------------
echo 1. Chon "Developer Default" setup type
echo 2. Hoan thanh qua trinh cai dat
echo 3. Dat password cho root user (ghi nho password)
echo.
echo Buoc 3: Cau hinh MySQL
echo -----------------------
echo 1. Tim "MySQL Command Line Client" trong Start Menu
echo 2. Chay va dang nhap voi password root
echo.
echo Buoc 4: Tao Database va User
echo -----------------------------
echo Copy & paste cac lenh sau vao MySQL Command Line:
echo.
echo CREATE DATABASE yapee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
echo CREATE USER 'yapee_user'@'localhost' IDENTIFIED BY 'password123';
echo GRANT ALL PRIVILEGES ON yapee_db.* TO 'yapee_user'@'localhost';
echo FLUSH PRIVILEGES;
echo EXIT;
echo.
echo Buoc 5: Test ket noi
echo -------------------
echo Sau khi tao xong, chay lenh sau de test:
echo mysql -u yapee_user -p yapee_db
echo (Password: password123)
echo.
pause
