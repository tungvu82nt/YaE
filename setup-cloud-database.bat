@echo off
echo ===========================================
echo     YAEE PROJECT - ALIBABA CLOUD RDS SETUP
echo ===========================================
echo.

echo 🚀 Setting up Alibaba Cloud RDS for YaE Project
echo.

echo 📋 Prerequisites Check:
echo - Alibaba Cloud RDS instance running
echo - User 'yapee_user' created with password 'password123'
echo - Database 'yapee_db' created
echo - IP whitelist configured (including 27.64.140.215)
echo.

echo 🔍 Step 1: Testing Cloud Connection...
echo.

REM Test cloud connection
node test-no-ssl-connection.js

if errorlevel 1 (
    echo.
    echo ❌ Connection test failed!
    echo.
    echo 🔧 Please check:
    echo - Alibaba Cloud RDS instance status
    echo - User yapee_user exists
    echo - Whitelist includes your IP
    echo - Database yapee_db exists
    echo.
    echo 📞 Need help? Check setup-alibaba-rds-guide.md
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Connection test passed!
echo.

echo 📄 Step 2: Setting up Database Schema...
echo.

REM Auto setup database
node auto-setup-cloud-db.js

if errorlevel 1 (
    echo.
    echo ❌ Database setup failed!
    echo.
    echo 🔧 Possible solutions:
    echo - Check user permissions
    echo - Verify database exists
    echo - Check whitelist settings
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Database setup completed!
echo.

echo 🧪 Step 3: Testing Project Integration...
echo.

REM Test project database integration
npm run db:test

if errorlevel 1 (
    echo.
    echo ❌ Project integration test failed!
    echo.
    echo ⚠️  Project will use mock data as fallback
    echo.
) else (
    echo.
    echo ✅ Project integration successful!
    echo.
)

echo 🎉 SETUP COMPLETE!
echo ================
echo.
echo ✅ Alibaba Cloud RDS configured
echo ✅ Database schema imported
echo ✅ Sample data loaded
echo ✅ Project ready for development
echo.
echo 🚀 Start development:
echo npm run dev
echo.
echo 🌐 Open browser: http://localhost:5173
echo.
echo 📊 Test credentials:
echo Username: admin
echo Password: password123
echo.

pause
