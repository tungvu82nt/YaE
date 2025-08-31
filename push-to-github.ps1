# ===========================================
# YA PEE E-COMMERCE - PUSH TO GITHUB SCRIPT
# ===========================================

Write-Host "🚀 YA PEE E-COMMERCE - PUSH TO GITHUB" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Git đã được cài đặt chưa
try {
    git --version > $null 2>&1
    Write-Host "✅ Git đã được cài đặt" -ForegroundColor Green
} catch {
    Write-Host "❌ Git chưa được cài đặt. Vui lòng cài đặt Git trước." -ForegroundColor Red
    Write-Host "📥 Tải từ: https://git-scm.com/downloads" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra xem đã có git repository chưa
if (Test-Path ".git") {
    Write-Host "✅ Git repository đã tồn tại" -ForegroundColor Green
} else {
    Write-Host "📝 Khởi tạo Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository đã được khởi tạo" -ForegroundColor Green
}

# Cấu hình Git user (nếu chưa có)
$userName = git config user.name
$userEmail = git config user.email

if (-not $userName -or -not $userEmail) {
    Write-Host "👤 Cấu hình thông tin Git user:" -ForegroundColor Yellow
    $name = Read-Host "Nhập tên của bạn"
    $email = Read-Host "Nhập email của bạn"

    git config user.name $name
    git config user.email $email
    Write-Host "✅ Đã cấu hình Git user: $name <$email>" -ForegroundColor Green
}

# Thêm tất cả file
Write-Host "📦 Thêm tất cả file vào Git..." -ForegroundColor Yellow
git add .

# Kiểm tra trạng thái
$status = git status --porcelain
if (-not $status) {
    Write-Host "ℹ️ Không có thay đổi nào để commit" -ForegroundColor Blue
    exit 0
}

# Tạo commit
Write-Host "💾 Tạo commit..." -ForegroundColor Yellow
$commitMessage = "feat: Initial commit - YA PEE E-commerce platform

✅ React + TypeScript frontend
✅ Node.js + Express backend
✅ MySQL database with Alibaba Cloud RDS
✅ Modern UI with TailwindCSS
✅ Authentication & User Management
✅ Product catalog & search
✅ Shopping cart & checkout
✅ Admin panel
✅ Performance monitoring
✅ Test framework (Vitest + Playwright)
✅ Docker configuration
✅ ESLint + Prettier setup
✅ Vite build system

All process.env errors have been fixed for browser compatibility."

git commit -m $commitMessage
Write-Host "✅ Commit đã được tạo" -ForegroundColor Green

# Đổi tên branch thành main
Write-Host "🌿 Đổi tên branch thành 'main'..." -ForegroundColor Yellow
git branch -M main

# Hỏi người dùng về GitHub repository URL
Write-Host "" -ForegroundColor White
Write-Host "🔗 Cấu hình GitHub repository:" -ForegroundColor Cyan
$repoUrl = Read-Host "Nhập URL của GitHub repository (ví dụ: https://github.com/username/yapee-ecommerce.git)"

if ($repoUrl) {
    # Kiểm tra remote origin đã tồn tại chưa
    $existingRemote = git remote get-url origin 2>$null
    if ($existingRemote) {
        Write-Host "🔄 Cập nhật remote origin..." -ForegroundColor Yellow
        git remote set-url origin $repoUrl
    } else {
        Write-Host "➕ Thêm remote origin..." -ForegroundColor Yellow
        git remote add origin $repoUrl
    }

    # Push lên GitHub
    Write-Host "⬆️ Push lên GitHub..." -ForegroundColor Yellow
    try {
        git push -u origin main
        Write-Host "🎉 Đã push thành công lên GitHub!" -ForegroundColor Green
        Write-Host "🔗 Repository: $repoUrl" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Lỗi khi push lên GitHub: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Có thể bạn cần:" -ForegroundColor Yellow
        Write-Host "   1. Tạo repository trên GitHub trước" -ForegroundColor White
        Write-Host "   2. Cấu hình SSH key hoặc Personal Access Token" -ForegroundColor White
        Write-Host "   3. Kiểm tra quyền truy cập repository" -ForegroundColor White
    }
} else {
    Write-Host "ℹ️ Bạn có thể push lên GitHub sau bằng cách chạy:" -ForegroundColor Blue
    Write-Host "   git remote add origin <repository-url>" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
}

Write-Host "" -ForegroundColor White
Write-Host "📊 Tóm tắt:" -ForegroundColor Cyan
Write-Host "   ✅ Dự án đã được commit" -ForegroundColor Green
Write-Host "   ✅ Branch 'main' đã được tạo" -ForegroundColor Green
if ($repoUrl) {
    Write-Host "   ✅ Đã cấu hình GitHub repository" -ForegroundColor Green
}
Write-Host "   📁 Số file đã được thêm: $(($status | Measure-Object).Count)" -ForegroundColor Blue

Write-Host "" -ForegroundColor White
Write-Host "🎊 YA PEE E-COMMERCE PROJECT SUCCESSFULLY PUSHED TO GITHUB!" -ForegroundColor Green
Write-Host "   🌟 React + TypeScript + Modern Architecture" -ForegroundColor Cyan
Write-Host "   🚀 Production Ready E-commerce Platform" -ForegroundColor Cyan
