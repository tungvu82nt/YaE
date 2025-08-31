import { test, expect } from '@playwright/test'

test.describe('User Journey E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up the page
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('complete user journey: browse -> login -> add to cart -> checkout -> order success', async ({ page }) => {
    // Step 1: Browse products
    await test.step('Browse products on homepage', async () => {
      await expect(page.locator('text=YA PEE')).toBeVisible()
      await expect(page.locator('text=iPhone')).toBeVisible()
      await expect(page.locator('text=Samsung')).toBeVisible()
    })

    // Step 2: Login
    await test.step('User login', async () => {
      await page.locator('text=Đăng nhập').click()

      // Wait for auth modal
      await page.waitForSelector('[data-testid="auth-modal"]', { timeout: 5000 })

      await page.locator('input[placeholder*="email"]').fill('test@example.com')
      await page.locator('input[placeholder*="mật khẩu"]').fill('password123')
      await page.locator('button:has-text("Đăng nhập")').click()

      // Wait for login success
      await expect(page.locator('text=Test User')).toBeVisible({ timeout: 5000 })
    })

    // Step 3: Add product to cart
    await test.step('Add product to cart', async () => {
      // Find first product card and add to cart
      const firstProductCard = page.locator('[data-testid="product-card"]').first()
      await expect(firstProductCard).toBeVisible()

      const addToCartButton = firstProductCard.locator('button:has-text("Thêm vào giỏ")')
      await addToCartButton.click()

      // Check cart notification
      await expect(page.locator('text=Đã thêm vào giỏ hàng')).toBeVisible({ timeout: 3000 })
    })

    // Step 4: View and modify cart
    await test.step('View and modify cart', async () => {
      // Open cart
      await page.locator('[data-testid="cart-icon"]').click()
      await expect(page.locator('text=Giỏ hàng')).toBeVisible()

      // Check cart has items
      await expect(page.locator('text=iPhone')).toBeVisible()

      // Increase quantity
      await page.locator('[data-testid="quantity-increase"]').click()

      // Verify quantity updated
      await expect(page.locator('text=Số lượng: 2')).toBeVisible()
    })

    // Step 5: Proceed to checkout
    await test.step('Proceed to checkout', async () => {
      await page.locator('button:has-text("Thanh toán")').click()

      // Verify checkout page
      await expect(page.locator('text=Thanh toán')).toBeVisible()
      await expect(page.locator('text=Thông tin giao hàng')).toBeVisible()
    })

    // Step 6: Fill shipping information
    await test.step('Fill shipping information', async () => {
      // Fill shipping form
      await page.locator('input[placeholder*="họ tên"]').fill('Nguyễn Văn A')
      await page.locator('input[placeholder*="số điện thoại"]').fill('0987654321')
      await page.locator('input[placeholder*="địa chỉ"]').fill('123 Đường ABC, Quận 1, TP.HCM')
      await page.locator('input[placeholder*="thành phố"]').fill('TP.HCM')

      // Select payment method
      await page.locator('text=Thanh toán khi nhận hàng (COD)').click()
    })

    // Step 7: Complete order
    await test.step('Complete order', async () => {
      await page.locator('button:has-text("Đặt hàng")').click()

      // Verify order success page
      await expect(page.locator('text=Đặt hàng thành công')).toBeVisible({ timeout: 5000 })
      await expect(page.locator('text=Cảm ơn bạn đã đặt hàng')).toBeVisible()
    })

    // Step 8: View order history
    await test.step('View order history', async () => {
      await page.locator('text=Đơn hàng của tôi').click()

      // Verify orders page
      await expect(page.locator('text=Lịch sử đơn hàng')).toBeVisible()
      await expect(page.locator('text=ĐH00')).toBeVisible()
    })
  })

  test('admin journey: login -> manage products -> view orders', async ({ page }) => {
    // Step 1: Admin login
    await test.step('Admin login', async () => {
      // Navigate to admin mode (this would be a special URL or button)
      await page.goto('http://localhost:5173?admin=true')
      await expect(page.locator('text=YA PEE - Admin Panel')).toBeVisible()
    })

    // Step 2: View dashboard
    await test.step('View admin dashboard', async () => {
      await expect(page.locator('text=Tổng quan')).toBeVisible()
      await expect(page.locator('text=Thống kê')).toBeVisible()
      await expect(page.locator('text=Đơn hàng')).toBeVisible()
    })

    // Step 3: Manage products
    await test.step('Manage products', async () => {
      await page.locator('text=Sản phẩm').click()
      await expect(page.locator('text=Quản lý sản phẩm')).toBeVisible()

      // Add new product
      await page.locator('button:has-text("Thêm sản phẩm")').click()
      await expect(page.locator('text=Thêm sản phẩm mới')).toBeVisible()
    })

    // Step 4: View orders
    await test.step('View orders', async () => {
      await page.locator('text=Đơn hàng').click()
      await expect(page.locator('text=Quản lý đơn hàng')).toBeVisible()

      // Check order statistics
      await expect(page.locator('text=Tổng đơn hàng')).toBeVisible()
    })

    // Step 5: View analytics
    await test.step('View analytics', async () => {
      await page.locator('text=Thống kê').click()
      await expect(page.locator('text=Phân tích bán hàng')).toBeVisible()
      await expect(page.locator('text=Doanh thu')).toBeVisible()
    })
  })

  test('search and filter functionality', async ({ page }) => {
    // Step 1: Access search
    await test.step('Access search functionality', async () => {
      await page.locator('text=Tìm kiếm nâng cao').click()
      await expect(page.locator('text=Tìm kiếm sản phẩm')).toBeVisible()
    })

    // Step 2: Perform search
    await test.step('Perform search', async () => {
      await page.locator('input[placeholder*="Tìm kiếm"]').fill('iPhone')
      await page.locator('button:has-text("Tìm kiếm")').click()

      // Verify search results
      await expect(page.locator('text=Kết quả tìm kiếm cho "iPhone"')).toBeVisible()
    })

    // Step 3: Apply filters
    await test.step('Apply filters', async () => {
      // Price filter
      await page.locator('input[placeholder*="Giá từ"]').fill('10000000')
      await page.locator('input[placeholder*="Giá đến"]').fill('30000000')

      // Category filter
      await page.locator('select[name="category"]').selectOption('Điện thoại')

      // Apply filters
      await page.locator('button:has-text("Áp dụng bộ lọc")').click()

      // Verify filtered results
      await expect(page.locator('text=iPhone')).toBeVisible()
    })

    // Step 4: Sort results
    await test.step('Sort results', async () => {
      await page.locator('select[name="sort"]').selectOption('Giá tăng dần')
      await page.locator('button:has-text("Sắp xếp")').click()

      // Verify sorting (this would need specific assertions based on implementation)
    })
  })

  test('wishlist functionality', async ({ page }) => {
    // Step 1: Login
    await test.step('User login for wishlist', async () => {
      await page.locator('text=Đăng nhập').click()
      await page.locator('input[placeholder*="email"]').fill('test@example.com')
      await page.locator('input[placeholder*="mật khẩu"]').fill('password123')
      await page.locator('button:has-text("Đăng nhập")').click()
      await expect(page.locator('text=Test User')).toBeVisible()
    })

    // Step 2: Add to wishlist
    await test.step('Add product to wishlist', async () => {
      const firstProductCard = page.locator('[data-testid="product-card"]').first()
      const wishlistButton = firstProductCard.locator('[data-testid="wishlist-button"]')
      await wishlistButton.click()

      // Verify added to wishlist
      await expect(page.locator('text=Đã thêm vào danh sách yêu thích')).toBeVisible()
    })

    // Step 3: View wishlist
    await test.step('View wishlist', async () => {
      await page.locator('text=Danh sách yêu thích').click()
      await expect(page.locator('text=Sản phẩm yêu thích')).toBeVisible()

      // Verify product is in wishlist
      await expect(page.locator('text=iPhone')).toBeVisible()
    })

    // Step 4: Remove from wishlist
    await test.step('Remove from wishlist', async () => {
      await page.locator('[data-testid="remove-wishlist"]').click()
      await expect(page.locator('text=Danh sách yêu thích trống')).toBeVisible()
    })
  })

  test('responsive design validation', async ({ page }) => {
    // Test mobile viewport
    await test.step('Mobile responsiveness', async () => {
      await page.setViewportSize({ width: 375, height: 667 })

      await expect(page.locator('text=YA PEE')).toBeVisible()
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()

      // Test mobile menu
      await page.locator('[data-testid="mobile-menu-toggle"]').click()
      await expect(page.locator('[data-testid="mobile-menu-content"]')).toBeVisible()
    })

    // Test tablet viewport
    await test.step('Tablet responsiveness', async () => {
      await page.setViewportSize({ width: 768, height: 1024 })

      await expect(page.locator('text=YA PEE')).toBeVisible()
      // Navigation should be visible on tablet
    })

    // Test desktop viewport
    await test.step('Desktop responsiveness', async () => {
      await page.setViewportSize({ width: 1920, height: 1080 })

      await expect(page.locator('text=YA PEE')).toBeVisible()
      // Full navigation should be visible
    })
  })

  test('error handling and edge cases', async ({ page }) => {
    // Test network error simulation
    await test.step('Network error handling', async () => {
      // Simulate network failure
      await page.route('**/api/**', route => route.abort())

      await page.reload()
      await expect(page.locator('text=Lỗi kết nối mạng')).toBeVisible()
    })

    // Test invalid login
    await test.step('Invalid login handling', async () => {
      await page.locator('text=Đăng nhập').click()
      await page.locator('input[placeholder*="email"]').fill('invalid@example.com')
      await page.locator('input[placeholder*="mật khẩu"]').fill('wrongpassword')
      await page.locator('button:has-text("Đăng nhập")').click()

      await expect(page.locator('text=Email hoặc mật khẩu không đúng')).toBeVisible()
    })

    // Test empty cart checkout
    await test.step('Empty cart checkout handling', async () => {
      // Clear cart first
      await page.locator('[data-testid="cart-icon"]').click()
      await page.locator('[data-testid="clear-cart"]').click()

      await page.locator('button:has-text("Thanh toán")').click()
      await expect(page.locator('text=Giỏ hàng trống')).toBeVisible()
    })
  })
})
