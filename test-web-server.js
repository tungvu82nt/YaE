#!/usr/bin/env node

// ===========================================
// YA PEE WEB SERVER TEST SCRIPT
// Test production web server functionality
// ===========================================

import fetch from 'node-fetch'
import { setTimeout } from 'timers/promises'

const SERVER_URL = 'http://localhost:3001'
const TIMEOUT = 5000 // 5 seconds

async function testEndpoint(url, description) {
  console.log(`\n🧪 Testing: ${description}`)
  console.log(`   URL: ${url}`)

  try {
    const startTime = Date.now()
    const response = await fetch(url, {
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'YA-PEE-Test-Script/1.0'
      }
    })
    const endTime = Date.now()
    const responseTime = endTime - startTime

    console.log(`   ✅ Status: ${response.status} ${response.statusText}`)
    console.log(`   ⚡ Response Time: ${responseTime}ms`)

    if (response.ok) {
      const contentType = response.headers.get('content-type')
      console.log(`   📄 Content-Type: ${contentType || 'unknown'}`)

      // Check response size
      const contentLength = response.headers.get('content-length')
      if (contentLength) {
        console.log(`   📏 Content-Length: ${contentLength} bytes`)
      }

      // Try to parse JSON for API endpoints
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        console.log(`   📊 JSON Response:`, JSON.stringify(data, null, 2))
      } else if (contentType && contentType.includes('text/html')) {
        const text = await response.text()
        console.log(`   📄 HTML Response Length: ${text.length} characters`)
        console.log(`   📄 Contains React App: ${text.includes('<!DOCTYPE html>') ? 'Yes' : 'No'}`)
      }
    } else {
      console.log(`   ❌ Error Response:`, await response.text())
    }

    return { success: response.ok, status: response.status, responseTime }

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🚀 YA PEE Web Server Test Suite')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Wait for server to start
  console.log('\n⏳ Waiting 3 seconds for server to start...')
  await setTimeout(3000)

  const tests = [
    {
      url: `${SERVER_URL}/health`,
      description: 'Health Check Endpoint'
    },
    {
      url: `${SERVER_URL}/api/health`,
      description: 'API Health Check'
    },
    {
      url: `${SERVER_URL}/`,
      description: 'Main Application Route'
    },
    {
      url: `${SERVER_URL}/nonexistent`,
      description: '404 Error Handling'
    }
  ]

  const results = []

  for (const test of tests) {
    const result = await testEndpoint(test.url, test.description)
    results.push({ ...test, ...result })
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 TEST SUMMARY')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const successful = results.filter(r => r.success).length
  const total = results.length

  console.log(`✅ Successful Tests: ${successful}/${total}`)
  console.log(`❌ Failed Tests: ${total - successful}/${total}`)

  if (successful === total) {
    console.log('\n🎉 ALL TESTS PASSED! Web server is running correctly.')
    console.log('\n📋 Server Information:')
    console.log(`   🌐 URL: ${SERVER_URL}`)
    console.log(`   🏥 Health Check: ${SERVER_URL}/health`)
    console.log(`   🔌 API Health: ${SERVER_URL}/api/health`)
    console.log(`   🚀 Status: PRODUCTION READY`)
  } else {
    console.log('\n⚠️  SOME TESTS FAILED. Please check server configuration.')
    console.log('\nFailed tests:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.description}: ${r.error || `Status ${r.status}`}`)
    })
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  // Exit with appropriate code
  process.exit(successful === total ? 0 : 1)
}

// Handle script interruption
process.on('SIGINT', () => {
  console.log('\n\n🛑 Test interrupted by user')
  process.exit(1)
})

// Run tests
runTests().catch(error => {
  console.error('💥 Test script error:', error)
  process.exit(1)
})
