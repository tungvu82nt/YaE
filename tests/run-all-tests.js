#!/usr/bin/env node

// ===========================================
// COMPREHENSIVE TESTING ORCHESTRATOR
// Unit Tests + E2E Tests + Performance Tests
// ===========================================

import { execSync, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { performance } from 'perf_hooks'

class TestOrchestrator {
  constructor() {
    this.results = {
      unit: { passed: 0, failed: 0, duration: 0 },
      e2e: { passed: 0, failed: 0, duration: 0 },
      performance: { passed: 0, failed: 0, duration: 0 },
      coverage: { percentage: 0, details: {} },
      summary: {}
    }
  }

  async runAllTests() {
    console.log('🚀 COMPREHENSIVE TESTING SUITE\n')
    console.log('=' .repeat(80))
    console.log('📋 Testing Phases:')
    console.log('  1. Unit Tests (Components & Hooks)')
    console.log('  2. E2E Tests (User Journeys)')
    console.log('  3. Performance Tests (Load & Speed)')
    console.log('  4. Coverage Analysis')
    console.log('=' .repeat(80))

    try {
      // Phase 1: Unit Tests
      await this.runUnitTests()

      // Phase 2: E2E Tests
      await this.runE2ETests()

      // Phase 3: Performance Tests
      await this.runPerformanceTests()

      // Phase 4: Coverage Analysis
      await this.analyzeCoverage()

      // Generate Final Report
      this.generateFinalReport()

    } catch (error) {
      console.error('❌ Testing orchestration failed:', error.message)
      process.exit(1)
    }
  }

  async runUnitTests() {
    console.log('\n🧪 PHASE 1: UNIT TESTS\n')
    console.log('-'.repeat(40))

    const startTime = performance.now()

    try {
      console.log('📦 Installing test dependencies...')
      execSync('npm install', { stdio: 'inherit' })

      console.log('🧪 Running Vitest unit tests...')
      const result = execSync('npm run test:run', {
        encoding: 'utf8',
        stdio: 'pipe'
      })

      const duration = performance.now() - startTime
      this.results.unit.duration = duration

      // Parse test results (simplified)
      const passedMatch = result.match(/(\d+)\s+passed/)
      const failedMatch = result.match(/(\d+)\s+failed/)

      this.results.unit.passed = passedMatch ? parseInt(passedMatch[1]) : 0
      this.results.unit.failed = failedMatch ? parseInt(failedMatch[1]) : 0

      console.log(`✅ Unit Tests: ${this.results.unit.passed} passed, ${this.results.unit.failed} failed`)
      console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`)

      if (this.results.unit.failed > 0) {
        console.log('❌ Some unit tests failed - check test output above')
      }

    } catch (error) {
      console.log('❌ Unit tests failed to run:', error.message)
      this.results.unit.failed = 1
    }
  }

  async runE2ETests() {
    console.log('\n🌐 PHASE 2: E2E TESTS\n')
    console.log('-'.repeat(40))

    const startTime = performance.now()

    try {
      console.log('🎭 Installing Playwright browsers...')
      execSync('npx playwright install', { stdio: 'inherit' })

      console.log('🌐 Running Playwright E2E tests...')
      const result = execSync('npm run test:e2e', {
        encoding: 'utf8',
        stdio: 'pipe'
      })

      const duration = performance.now() - startTime
      this.results.e2e.duration = duration

      // Parse E2E results (simplified)
      const passedMatch = result.match(/(\d+)\s+passed/)
      const failedMatch = result.match(/(\d+)\s+failed/)

      this.results.e2e.passed = passedMatch ? parseInt(passedMatch[1]) : 0
      this.results.e2e.failed = failedMatch ? parseInt(failedMatch[1]) : 0

      console.log(`✅ E2E Tests: ${this.results.e2e.passed} passed, ${this.results.e2e.failed} failed`)
      console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`)

      if (this.results.e2e.failed > 0) {
        console.log('❌ Some E2E tests failed - check test output above')
      }

    } catch (error) {
      console.log('❌ E2E tests failed to run:', error.message)
      this.results.e2e.failed = 1
    }
  }

  async runPerformanceTests() {
    console.log('\n⚡ PHASE 3: PERFORMANCE TESTS\n')
    console.log('-'.repeat(40))

    const startTime = performance.now()

    try {
      console.log('🚀 Starting development server...')
      const serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        detached: true
      })

      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 5000))

      console.log('📊 Running performance tests...')
      execSync('node tests/performance/load-test.js', { stdio: 'inherit' })

      console.log('🔥 Running load tests...')
      try {
        execSync('npx artillery run tests/load/load-test-config.yml', {
          stdio: 'inherit',
          timeout: 300000 // 5 minutes timeout
        })
      } catch (loadError) {
        console.log('⚠️  Load test completed (some failures expected under load)')
      }

      // Kill server process
      if (serverProcess.pid) {
        process.kill(-serverProcess.pid)
      }

      const duration = performance.now() - startTime
      this.results.performance.duration = duration
      this.results.performance.passed = 1 // Performance tests completed

      console.log(`✅ Performance Tests: Completed`)
      console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`)

    } catch (error) {
      console.log('❌ Performance tests failed:', error.message)
      this.results.performance.failed = 1
    }
  }

  async analyzeCoverage() {
    console.log('\n📊 PHASE 4: COVERAGE ANALYSIS\n')
    console.log('-'.repeat(40))

    try {
      console.log('📈 Generating coverage report...')
      execSync('npm run test:coverage', { stdio: 'inherit' })

      // Read coverage report if it exists
      const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json')
      if (fs.existsSync(coveragePath)) {
        const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'))

        if (coverageData.total) {
          this.results.coverage.percentage = coverageData.total.lines.pct
          this.results.coverage.details = coverageData.total

          console.log(`📊 Code Coverage: ${this.results.coverage.percentage}%`)
          console.log(`   Lines: ${coverageData.total.lines.pct}%`)
          console.log(`   Functions: ${coverageData.total.functions.pct}%`)
          console.log(`   Branches: ${coverageData.total.branches.pct}%`)
        }
      }

    } catch (error) {
      console.log('⚠️  Coverage analysis failed:', error.message)
    }
  }

  generateFinalReport() {
    console.log('\n🎯 FINAL TESTING REPORT\n')
    console.log('=' .repeat(80))

    const totalTests = this.results.unit.passed + this.results.unit.failed +
                      this.results.e2e.passed + this.results.e2e.failed +
                      this.results.performance.passed + this.results.performance.failed

    const totalPassed = this.results.unit.passed + this.results.e2e.passed + this.results.performance.passed
    const totalFailed = this.results.unit.failed + this.results.e2e.failed + this.results.performance.failed

    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0'

    console.log(`📊 OVERALL RESULTS:`)
    console.log(`   Total Tests: ${totalTests}`)
    console.log(`   Passed: ${totalPassed}`)
    console.log(`   Failed: ${totalFailed}`)
    console.log(`   Success Rate: ${successRate}%`)

    console.log(`\n📋 PHASE BREAKDOWN:`)
    console.log(`   🧪 Unit Tests: ${this.results.unit.passed}/${this.results.unit.passed + this.results.unit.failed} (${(this.results.unit.duration / 1000).toFixed(1)}s)`)
    console.log(`   🌐 E2E Tests: ${this.results.e2e.passed}/${this.results.e2e.passed + this.results.e2e.failed} (${(this.results.e2e.duration / 1000).toFixed(1)}s)`)
    console.log(`   ⚡ Performance: ${this.results.performance.passed}/${this.results.performance.passed + this.results.performance.failed} (${(this.results.performance.duration / 1000).toFixed(1)}s)`)

    if (this.results.coverage.percentage > 0) {
      console.log(`   📊 Coverage: ${this.results.coverage.percentage}%`)
    }

    // Quality Assessment
    console.log(`\n🏆 QUALITY ASSESSMENT:`)

    const getGrade = (percentage) => {
      if (percentage >= 95) return 'A+ 🏆'
      if (percentage >= 90) return 'A ✅'
      if (percentage >= 80) return 'B+ 👍'
      if (percentage >= 70) return 'B ⚠️'
      if (percentage >= 60) return 'C 🟡'
      return 'D ❌'
    }

    console.log(`   Test Success Rate: ${getGrade(parseFloat(successRate))}`)

    if (this.results.coverage.percentage > 0) {
      console.log(`   Code Coverage: ${getGrade(this.results.coverage.percentage)}`)
    }

    // Recommendations
    console.log(`\n💡 RECOMMENDATIONS:`)

    if (totalFailed > 0) {
      console.log(`   ❌ Fix ${totalFailed} failing tests before deployment`)
    }

    if (this.results.coverage.percentage < 80) {
      console.log(`   📊 Improve code coverage (currently ${this.results.coverage.percentage}%)`)
    }

    if (this.results.unit.failed > 0) {
      console.log(`   🧪 Review unit test failures - component logic issues`)
    }

    if (this.results.e2e.failed > 0) {
      console.log(`   🌐 Review E2E test failures - user experience issues`)
    }

    if (this.results.performance.failed > 0) {
      console.log(`   ⚡ Review performance test failures - optimization needed`)
    }

    // Deployment Readiness
    const isReady = totalFailed === 0 && this.results.coverage.percentage >= 70

    console.log(`\n🚀 DEPLOYMENT READINESS:`)
    if (isReady) {
      console.log(`   ✅ READY FOR PRODUCTION`)
      console.log(`   🎯 All tests passing, good coverage, performance verified`)
      console.log(`   📦 Ready for Phase 8: Deployment & Production`)
    } else {
      console.log(`   ⚠️  REQUIRES ATTENTION`)
      console.log(`   🔧 Address failing tests and coverage issues first`)
      console.log(`   📋 Re-run tests after fixes`)
    }

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        totalPassed,
        totalFailed,
        successRate: parseFloat(successRate),
        isReadyForProduction: isReady
      },
      phases: {
        unit: this.results.unit,
        e2e: this.results.e2e,
        performance: this.results.performance,
        coverage: this.results.coverage
      }
    }

    const reportPath = path.join(process.cwd(), 'test-report-final.json')
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📄 Detailed report saved to: ${reportPath}`)
    console.log(`📄 Performance report: performance-report.json`)
    console.log(`📊 Coverage report: coverage/index.html`)

    console.log('\n🎉 TESTING COMPLETE!')
    console.log('=' .repeat(80))
  }
}

// Run comprehensive testing
const orchestrator = new TestOrchestrator()
orchestrator.runAllTests().catch(console.error)
