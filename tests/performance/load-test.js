#!/usr/bin/env node

// ===========================================
// PERFORMANCE TESTING SUITE
// Load Testing & Performance Analysis
// ===========================================

import { chromium } from 'playwright'
import { performance } from 'perf_hooks'
import fs from 'fs'
import path from 'path'

class PerformanceTester {
  constructor() {
    this.results = {
      navigation: [],
      rendering: [],
      interactions: [],
      memory: [],
      network: [],
      summary: {}
    }
  }

  async runAllTests() {
    console.log('🚀 PERFORMANCE TESTING SUITE\n')
    console.log('=' .repeat(60))

    const browser = await chromium.launch()
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    })

    try {
      await this.testNavigationPerformance(context)
      await this.testRenderingPerformance(context)
      await this.testInteractionPerformance(context)
      await this.testMemoryUsage(context)
      await this.testNetworkPerformance(context)

      this.generateReport()

    } catch (error) {
      console.error('❌ Performance testing failed:', error.message)
    } finally {
      await browser.close()
    }
  }

  async testNavigationPerformance(context) {
    console.log('\n📊 NAVIGATION PERFORMANCE TEST\n')

    const page = await context.newPage()

    // Test homepage navigation
    const startTime = performance.now()
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    const loadTime = performance.now() - startTime

    console.log(`✅ Homepage load time: ${loadTime.toFixed(2)}ms`)

    // Test navigation to different pages
    const pages = [
      { name: 'Search', url: '#search' },
      { name: 'Profile', url: '#profile' },
      { name: 'Orders', url: '#orders' },
      { name: 'Wishlist', url: '#wishlist' }
    ]

    for (const pageTest of pages) {
      const navStart = performance.now()
      await page.click(`[href="${pageTest.url}"]`)
      await page.waitForLoadState('networkidle')
      const navTime = performance.now() - navStart

      console.log(`✅ ${pageTest.name} navigation: ${navTime.toFixed(2)}ms`)
      this.results.navigation.push({
        page: pageTest.name,
        time: navTime,
        timestamp: new Date().toISOString()
      })
    }

    await page.close()
  }

  async testRenderingPerformance(context) {
    console.log('\n🎨 RENDERING PERFORMANCE TEST\n')

    const page = await context.newPage()
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')

    // Measure product list rendering
    const renderStart = performance.now()
    const productCount = await page.locator('[data-testid="product-card"]').count()
    const renderTime = performance.now() - renderStart

    console.log(`✅ Product list rendering: ${renderTime.toFixed(2)}ms (${productCount} products)`)

    // Measure cart rendering
    await page.click('[data-testid="cart-icon"]')
    const cartRenderStart = performance.now()
    await page.waitForSelector('[data-testid="cart-content"]')
    const cartRenderTime = performance.now() - cartRenderStart

    console.log(`✅ Cart rendering: ${cartRenderTime.toFixed(2)}ms`)

    // Measure search results rendering
    await page.fill('[data-testid="search-input"]', 'iPhone')
    await page.click('[data-testid="search-button"]')
    const searchRenderStart = performance.now()
    await page.waitForSelector('[data-testid="search-results"]')
    const searchRenderTime = performance.now() - searchRenderStart

    console.log(`✅ Search results rendering: ${searchRenderTime.toFixed(2)}ms`)

    this.results.rendering.push(
      { component: 'ProductList', time: renderTime, items: productCount },
      { component: 'Cart', time: cartRenderTime },
      { component: 'SearchResults', time: searchRenderTime }
    )

    await page.close()
  }

  async testInteractionPerformance(context) {
    console.log('\n🖱️  INTERACTION PERFORMANCE TEST\n')

    const page = await context.newPage()
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')

    // Test add to cart interaction
    const addToCartStart = performance.now()
    await page.click('[data-testid="product-card"] [data-testid="add-to-cart"]')
    await page.waitForSelector('[data-testid="cart-notification"]')
    const addToCartTime = performance.now() - addToCartStart

    console.log(`✅ Add to cart: ${addToCartTime.toFixed(2)}ms`)

    // Test cart quantity update
    const quantityUpdateStart = performance.now()
    await page.click('[data-testid="quantity-increase"]')
    await page.waitForFunction(() => {
      const quantity = document.querySelector('[data-testid="cart-quantity"]')
      return quantity && quantity.textContent === '2'
    })
    const quantityUpdateTime = performance.now() - quantityUpdateStart

    console.log(`✅ Quantity update: ${quantityUpdateTime.toFixed(2)}ms`)

    // Test search interaction
    const searchStart = performance.now()
    await page.fill('[data-testid="search-input"]', 'Samsung')
    await page.click('[data-testid="search-button"]')
    await page.waitForSelector('[data-testid="search-results"]')
    const searchTime = performance.now() - searchStart

    console.log(`✅ Search interaction: ${searchTime.toFixed(2)}ms`)

    this.results.interactions.push(
      { action: 'AddToCart', time: addToCartTime },
      { action: 'QuantityUpdate', time: quantityUpdateTime },
      { action: 'Search', time: searchTime }
    )

    await page.close()
  }

  async testMemoryUsage(context) {
    console.log('\n💾 MEMORY USAGE TEST\n')

    const page = await context.newPage()
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    })

    if (initialMemory) {
      console.log(`📊 Initial memory: ${(initialMemory.used / 1024 / 1024).toFixed(2)} MB`)
    }

    // Perform memory-intensive operations
    await page.fill('[data-testid="search-input"]', 'a') // Trigger suggestions
    await page.waitForTimeout(1000)

    // Add multiple items to cart
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="product-card"]:nth-of-type(1) [data-testid="add-to-cart"]')
      await page.waitForTimeout(100)
    }

    // Navigate through pages
    await page.click('[data-testid="nav-search"]')
    await page.click('[data-testid="nav-profile"]')
    await page.click('[data-testid="nav-orders"]')

    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      return performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    })

    if (finalMemory && initialMemory) {
      const memoryIncrease = finalMemory.used - initialMemory.used
      console.log(`📊 Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`)
      console.log(`📊 Final memory: ${(finalMemory.used / 1024 / 1024).toFixed(2)} MB`)

      this.results.memory.push({
        initial: initialMemory.used,
        final: finalMemory.used,
        increase: memoryIncrease,
        percentage: ((memoryIncrease / initialMemory.used) * 100).toFixed(2)
      })
    }

    await page.close()
  }

  async testNetworkPerformance(context) {
    console.log('\n🌐 NETWORK PERFORMANCE TEST\n')

    const page = await context.newContext()
    const newPage = await page.newPage()

    // Track network requests
    const requests = []
    const responses = []

    newPage.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        timestamp: Date.now()
      })
    })

    newPage.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        timestamp: Date.now()
      })
    })

    const networkStart = performance.now()
    await newPage.goto('http://localhost:5173')
    await newPage.waitForLoadState('networkidle')
    const networkTime = performance.now() - networkStart

    console.log(`✅ Network load time: ${networkTime.toFixed(2)}ms`)
    console.log(`📊 Total requests: ${requests.length}`)
    console.log(`📊 Total responses: ${responses.length}`)

    // Analyze request types
    const requestTypes = requests.reduce((acc, req) => {
      const type = req.url.split('.').pop()?.toLowerCase() || 'other'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    console.log('📊 Request types:', requestTypes)

    // Check for slow requests (> 1 second)
    const slowRequests = responses.filter(resp => {
      const request = requests.find(req => req.url === resp.url)
      if (request) {
        const duration = resp.timestamp - request.timestamp
        return duration > 1000
      }
      return false
    })

    console.log(`⚠️  Slow requests (>1s): ${slowRequests.length}`)

    this.results.network.push({
      totalTime: networkTime,
      requestCount: requests.length,
      responseCount: responses.length,
      requestTypes,
      slowRequests: slowRequests.length
    })

    await newPage.close()
    await page.close()
  }

  generateReport() {
    console.log('\n📋 PERFORMANCE TEST REPORT\n')
    console.log('=' .repeat(60))

    // Navigation Summary
    const avgNavTime = this.results.navigation.reduce((sum, nav) => sum + nav.time, 0) / this.results.navigation.length
    console.log(`🚀 Average Navigation Time: ${avgNavTime.toFixed(2)}ms`)

    // Rendering Summary
    const avgRenderTime = this.results.rendering.reduce((sum, render) => sum + render.time, 0) / this.results.rendering.length
    console.log(`🎨 Average Rendering Time: ${avgRenderTime.toFixed(2)}ms`)

    // Interaction Summary
    const avgInteractionTime = this.results.interactions.reduce((sum, interaction) => sum + interaction.time, 0) / this.results.interactions.length
    console.log(`🖱️  Average Interaction Time: ${avgInteractionTime.toFixed(2)}ms`)

    // Memory Summary
    if (this.results.memory.length > 0) {
      const memory = this.results.memory[0]
      console.log(`💾 Memory Usage: ${(memory.final / 1024 / 1024).toFixed(2)} MB (${memory.percentage}% increase)`)
    }

    // Network Summary
    if (this.results.network.length > 0) {
      const network = this.results.network[0]
      console.log(`🌐 Network Performance: ${network.totalTime.toFixed(2)}ms (${network.requestCount} requests)`)
    }

    // Performance Ratings
    console.log('\n🏆 PERFORMANCE RATINGS\n')

    const getRating = (time, thresholds) => {
      if (time <= thresholds.excellent) return '🏆 Excellent'
      if (time <= thresholds.good) return '✅ Good'
      if (time <= thresholds.average) return '⚠️  Average'
      return '❌ Poor'
    }

    console.log(`Navigation: ${getRating(avgNavTime, { excellent: 500, good: 1000, average: 2000 })}`)
    console.log(`Rendering: ${getRating(avgRenderTime, { excellent: 100, good: 300, average: 600 })}`)
    console.log(`Interactions: ${getRating(avgInteractionTime, { excellent: 200, good: 500, average: 1000 })}`)

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS\n')

    if (avgNavTime > 2000) {
      console.log('⚡ Optimize initial page load - consider code splitting')
    }
    if (avgRenderTime > 500) {
      console.log('🎨 Optimize component rendering - use React.memo, lazy loading')
    }
    if (avgInteractionTime > 800) {
      console.log('🖱️  Optimize interactions - reduce re-renders, use debouncing')
    }
    if (this.results.memory.length > 0 && this.results.memory[0].percentage > 50) {
      console.log('💾 Monitor memory usage - check for memory leaks')
    }
    if (this.results.network.length > 0 && this.results.network[0].slowRequests > 5) {
      console.log('🌐 Optimize network requests - implement caching, CDN')
    }

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        averageNavigationTime: avgNavTime,
        averageRenderingTime: avgRenderTime,
        averageInteractionTime: avgInteractionTime,
        memoryIncrease: this.results.memory[0]?.percentage || 0,
        networkRequests: this.results.network[0]?.requestCount || 0,
        slowRequests: this.results.network[0]?.slowRequests || 0
      },
      details: this.results
    }

    const reportPath = path.join(process.cwd(), 'performance-report.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📄 Detailed report saved to: ${reportPath}`)
  }
}

// Run performance tests
const tester = new PerformanceTester()
tester.runAllTests().catch(console.error)
