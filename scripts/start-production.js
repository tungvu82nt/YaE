#!/usr/bin/env node

// ===========================================
// YA PEE PRODUCTION SERVER STARTER
// Cross-platform script to start production server
// ===========================================

import { spawn } from 'child_process'
import { platform } from 'os'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🚀 YA PEE Production Server Starter')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

const isWindows = platform() === 'win32'

// Set environment variables
const env = {
    ...process.env,
    NODE_ENV: 'production'
}

// Command to run the server
let command, args

if (isWindows) {
    // Windows PowerShell syntax
    command = 'cmd'
    args = ['/c', 'node', 'server/index.js']
} else {
    // Unix/Linux syntax
    command = 'node'
    args = ['server/index.js']
}

console.log(`📍 Platform: ${platform()}`)
console.log(`🔧 Command: ${command} ${args.join(' ')}`)
console.log(`🌍 Environment: ${env.NODE_ENV}`)
console.log('')

// Spawn the server process
const serverProcess = spawn(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    env: env
})

// Handle process events
serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
})

serverProcess.on('close', (code) => {
    if (code !== 0) {
        console.error(`❌ Server process exited with code ${code}`)
        process.exit(code)
    }
})

// Handle script termination
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, stopping server...')
    serverProcess.kill('SIGINT')
})

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, stopping server...')
    serverProcess.kill('SIGTERM')
})

console.log('✅ Production server starting...')
console.log('📋 Server will be available at: http://localhost:3001')
console.log('🏥 Health check: http://localhost:3001/health')
console.log('🛑 Press Ctrl+C to stop the server')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
