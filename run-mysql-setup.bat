@echo off
echo ===========================================
echo    CLOUD MYSQL DATABASE SETUP FOR YAPE
echo ===========================================
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Download from: https://nodejs.org/
    echo 2. Run the installer
    echo 3. Restart command prompt
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✅ Node.js is available
echo.

REM Run cloud database setup
echo 🔧 Setting up Alibaba Cloud RDS database...
node setup-database-simple.js

if errorlevel 1 (
    echo ❌ Cloud database setup failed!
    echo.
    echo Possible issues:
    echo - Alibaba Cloud RDS instance not running
    echo - IP not in whitelist
    echo - Database user kk1213 does not exist
    echo - Database kk121 does not exist
    echo.
    echo Please check Alibaba Cloud console and try again.
    pause
    exit /b 1
)

echo ✅ Database setup completed successfully!
echo.
echo 📊 Database Information:
echo    Provider: Alibaba Cloud RDS
echo    Database: kk121
echo    User: kk1213
echo    Region: Singapore
echo.
echo 🧪 Testing connection...
node simple-kk1213-test.js

if errorlevel 1 (
    echo ❌ Connection test failed!
    echo.
    echo Try running: npm run cloud:test
    pause
    exit /b 1
)

echo.
echo 🎉 MySQL setup completed successfully!
echo.
echo Next steps:
echo 1. Run: npm run db:test       (Test database connection)
echo 2. Run: npm run cloud:test    (Test cloud connection)
echo 3. Run: npm run dev           (Start the application)
echo.
echo 🚀 Ready to use Alibaba Cloud RDS!
echo.
pause
