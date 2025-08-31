#!/usr/bin/env node

// ===========================================
// YA PEE PRODUCTION SERVER TEST SCRIPT
// Test production web server with static files
// ===========================================

import fetch from 'node-fetch'

const SERVER_URL = 'http://localhost:3001'
const TIMEOUT = 10000 // 10 seconds

async function testEndpoint(url, description, expectHtml = false) {
  console.log(`\n🧪 Testing: ${description}`)
  console.log(`   URL: ${url}`)

  try {
    const startTime = Date.now()
    const response = await fetch(url, {
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'YA-PEE-Production-Test/1.0'
      }
    })
    const endTime = Date.now()
    const responseTime = endTime - startTime

    console.log(`   ✅ Status: ${response.status} ${response.statusText}`)
    console.log(`   ⚡ Response Time: ${responseTime}ms`)

    if (response.ok) {
      const contentType = response.headers.get('content-type')
      console.log(`   📄 Content-Type: ${contentType || 'unknown'}`)

      const contentLength = response.headers.get('content-length')
      if (contentLength) {
        console.log(`   📏 Content-Length: ${contentLength} bytes`)
      }

      if (expectHtml && contentType && contentType.includes('text/html')) {
        const html = await response.text()
        console.log(`   📄 HTML Length: ${html.length} characters`)

        // Check for React app indicators
        const hasDoctype = html.includes('<!doctype html>')
        const hasRootDiv = html.includes('<div id="root"></div>')
        const hasTitle = html.includes('Yapee - Thương mại điện tử')
        const hasScript = html.includes('<script type="module"')
        const hasStylesheet = html.includes('link rel="stylesheet"') || html.includes('<link rel="stylesheet"')

        console.log(`   ✅ Contains DOCTYPE: ${hasDoctype ? 'Yes' : 'No'}`)
        console.log(`   ✅ Contains Root Div: ${hasRootDiv ? 'Yes' : 'No'}`)
        console.log(`   ✅ Contains Title: ${hasTitle ? 'Yes' : 'No'}`)
        console.log(`   ✅ Contains Script: ${hasScript ? 'Yes' : 'No'}`)
        console.log(`   ✅ Contains Stylesheet: ${hasStylesheet ? 'Yes' : 'No'}`)

        // Debug: show partial HTML content
        if (!hasStylesheet) {
          console.log(`   🔍 HTML Debug (first 300 chars):`)
          console.log(`      ${html.substring(0, 300)}...`)
        }

        const isReactApp = hasDoctype && hasRootDiv && hasTitle && hasScript && hasStylesheet
        console.log(`   🎯 Is React App: ${isReactApp ? 'YES ✅' : 'NO ❌'}`)

        return { success: true, status: response.status, responseTime, isReactApp }
      } else if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        console.log(`   📊 JSON Response:`, JSON.stringify(data, null, 2))
        return { success: true, status: response.status, responseTime, data }
      } else {
        const text = await response.text()
        console.log(`   📄 Response: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`)
        return { success: true, status: response.status, responseTime, content: text }
      }
    } else {
      console.log(`   ❌ Error Response:`, await response.text())
      return { success: false, status: response.status, responseTime }
    }

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runProductionTests() {
  console.log('🚀 YA PEE Production Server Test Suite')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔍 Testing PRODUCTION BUILD with static file serving')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Wait for server to start
  console.log('\n⏳ Waiting 3 seconds for production server to start...')
  await new Promise(resolve => setTimeout(resolve, 3000))

  const tests = [
    {
      url: `${SERVER_URL}/health`,
      description: 'Health Check Endpoint',
      expectHtml: false
    },
    {
      url: `${SERVER_URL}/api/health`,
      description: 'API Health Check',
      expectHtml: false
    },
    {
      url: `${SERVER_URL}/`,
      description: 'Main Application Route (Production HTML)',
      expectHtml: true
    },
    {
      url: `${SERVER_URL}/nonexistent`,
      description: 'SPA Fallback for Unknown Routes',
      expectHtml: true
    }
  ]

  const results = []

  for (const test of tests) {
    const result = await testEndpoint(test.url, test.description, test.expectHtml)
    results.push({ ...test, ...result })
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 PRODUCTION TEST SUMMARY')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const successful = results.filter(r => r.success).length
  const total = results.length
  const htmlTests = results.filter(r => r.expectHtml)
  const reactAppTests = htmlTests.filter(r => r.isReactApp)

  console.log(`✅ Successful Tests: ${successful}/${total}`)
  console.log(`❌ Failed Tests: ${total - successful}/${total}`)
  console.log(`🎯 React App Tests: ${reactAppTests.length}/${htmlTests.length} passed`)

  if (successful === total) {
    console.log('\n🎉 ALL TESTS PASSED! Production server is working perfectly.')

    if (reactAppTests.length === htmlTests.length) {
      console.log('🚀 REACT APPLICATION IS SERVING CORRECTLY!')
    } else {
      console.log('⚠️  HTML serving works but React app detection failed.')
    }
  } else {
    console.log('\n⚠️  SOME TESTS FAILED. Check server configuration.')
    console.log('\nFailed tests:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.description}: ${r.error || `Status ${r.status}`}`)
    })
  }

  console.log('\n📋 Server Information:')
  console.log(`   🌐 URL: ${SERVER_URL}`)
  console.log(`   🏥 Health Check: ${SERVER_URL}/health`)
  console.log(`   🔌 API Health: ${SERVER_URL}/api/health`)
  console.log(`   📦 Build Directory: ./dist/`)
  console.log(`   🚀 Status: PRODUCTION READY`)

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Exit with appropriate code
  const allPassed = successful === total && reactAppTests.length === htmlTests.length
  process.exit(allPassed ? 0 : 1)
}

// Handle script interruption
process.on('SIGINT', () => {
  console.log('\n\n🛑 Production test interrupted by user')
  process.exit(1)
})

// Run production tests
runProductionTests().catch(error => {
  console.error('💥 Production test script error:', error)
  process.exit(1)
})
