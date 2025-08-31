#!/usr/bin/env node

// ===========================================
// YA PEE DEVELOPMENT SERVERS STARTER
// Start both Vite dev server and production web server
// ===========================================

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import winston from 'winston'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ]
})

// Server processes
let viteProcess = null
let webServerProcess = null

// Cleanup function
function cleanup() {
  logger.info('🧹 Cleaning up processes...')

  if (viteProcess) {
    logger.info('Stopping Vite dev server...')
    viteProcess.kill('SIGTERM')
  }

  if (webServerProcess) {
    logger.info('Stopping web server...')
    webServerProcess.kill('SIGTERM')
  }

  process.exit(0)
}

// Handle process signals
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

// Function to start Vite dev server
function startViteServer() {
  return new Promise((resolve, reject) => {
    logger.info('🚀 Starting Vite dev server...')

    viteProcess = spawn('npm', ['run', 'dev'], {
      cwd: projectRoot,
      stdio: 'pipe',
      shell: true
    })

    let viteReady = false

    viteProcess.stdout.on('data', (data) => {
      const output = data.toString()
      console.log('🔧 Vite:', output.trim())

      if (output.includes('Local:') && output.includes('localhost:5173')) {
        viteReady = true
        logger.info('✅ Vite dev server is ready!')
        resolve()
      }
    })

    viteProcess.stderr.on('data', (data) => {
      const output = data.toString()
      console.error('🔧 Vite Error:', output.trim())
    })

    viteProcess.on('close', (code) => {
      if (code !== 0 && !viteReady) {
        reject(new Error(`Vite dev server exited with code ${code}`))
      }
    })

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!viteReady) {
        reject(new Error('Vite dev server startup timeout'))
      }
    }, 30000)
  })
}

// Function to start web server
function startWebServer() {
  return new Promise((resolve, reject) => {
    logger.info('🌐 Starting production web server...')

    webServerProcess = spawn('npm', ['run', 'start'], {
      cwd: projectRoot,
      stdio: 'pipe',
      shell: true,
      env: { ...process.env, NODE_ENV: 'development' }
    })

    let webServerReady = false

    webServerProcess.stdout.on('data', (data) => {
      const output = data.toString()
      console.log('🌐 Web Server:', output.trim())

      if (output.includes('YA PEE E-commerce Web Server Started Successfully')) {
        webServerReady = true
        logger.info('✅ Web server is ready!')
        resolve()
      }
    })

    webServerProcess.stderr.on('data', (data) => {
      const output = data.toString()
      console.error('🌐 Web Server Error:', output.trim())
    })

    webServerProcess.on('close', (code) => {
      if (code !== 0 && !webServerReady) {
        reject(new Error(`Web server exited with code ${code}`))
      }
    })

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!webServerReady) {
        reject(new Error('Web server startup timeout'))
      }
    }, 30000)
  })
}

// Main function
async function main() {
  try {
    console.log('🚀 YA PEE Development Environment Setup')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // Start Vite dev server first
    await startViteServer()

    // Wait a moment for Vite to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Start web server
    await startWebServer()

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 BOTH SERVERS STARTED SUCCESSFULLY!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n📋 Server Information:')
    console.log('   🔧 Vite Dev Server: http://localhost:5173')
    console.log('   🌐 Production Web Server: http://localhost:3001')
    console.log('   🏥 Health Check: http://localhost:3001/health')
    console.log('   🔌 API Health: http://localhost:3001/api/health')
    console.log('\n💡 Access your application at: http://localhost:3001')
    console.log('\n🛑 Press Ctrl+C to stop all servers')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // Keep the process running
    process.stdin.resume()

  } catch (error) {
    logger.error('❌ Failed to start servers:', error.message)
    cleanup()
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('💥 Uncaught exception:', error)
  cleanup()
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('💥 Unhandled rejection at:', promise, 'reason:', reason)
  cleanup()
})

// Start the servers
main()
