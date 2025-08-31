@echo off
echo ===========================================
echo    TEST CLOUD MYSQL CONNECTION
echo ===========================================
echo.

echo 🔍 Testing Alibaba Cloud RDS connection...
node test-user-kk1213.js

if errorlevel 1 (
    echo ❌ Cloud connection failed!
    echo.
    echo Possible issues:
    echo - Alibaba Cloud RDS instance not running
    echo - IP not in whitelist
    echo - Wrong username/password
    echo - Database kk121 does not exist
    echo.
    echo Try running: npm run cloud:setup
    pause
    exit /b 1
)

echo ✅ Cloud database connection successful!
echo.

echo 📊 Testing database access...
node simple-kk1213-test.js

if errorlevel 1 (
    echo ❌ Database access failed!
    echo.
    echo Try running: npm run cloud:setup
    pause
    exit /b 1
)

echo ✅ Database access successful!
echo.

echo 📋 Database statistics:
echo (Check the Node.js output above for detailed statistics)

echo.
echo 🎉 Cloud MySQL setup is working perfectly!
echo.
echo You can now run:
echo - npm run db:test       (Run comprehensive database tests)
echo - npm run cloud:test    (Test cloud connection)
echo - npm run dev           (Start the application)
echo.
pause
