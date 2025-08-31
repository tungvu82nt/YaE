@echo off
echo ===========================================
echo    TEST ALIBABA CLOUD RDS MYSQL CONNECTION
echo ===========================================
echo.

echo 🔍 Testing Alibaba Cloud RDS Connection...
echo.

REM Test with Node.js script
node test-cloud-db.js

if errorlevel 1 (
    echo.
    echo ❌ Cloud database test failed!
    echo.
    echo 🔧 Troubleshooting:
    echo - Check if database user exists on Alibaba Cloud RDS
    echo - Verify whitelist settings allow your IP
    echo - Ensure database password is correct
    echo - Check if yapee_db database exists
    echo.
    echo 📞 You may need to:
    echo 1. Create database user manually in Alibaba Cloud console
    echo 2. Add your IP to whitelist
    echo 3. Create yapee_db database
    echo 4. Run setup-cloud-db.sql manually
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Cloud database connection successful!
echo.
echo 🚀 You can now run:
echo - npm run db:test    (Test with project)
echo - npm run dev        (Start development server)
echo.
pause

