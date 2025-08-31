#!/usr/bin/env node

// ===========================================
// YA PEE PRODUCTION DEPLOYMENT SCRIPT (Node.js)
// Cross-platform deployment automation
// ===========================================

import { execSync, spawn } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { platform } from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Configuration
const config = {
    appName: 'yapee-ecommerce',
    remoteHost: process.env.DEPLOY_HOST || 'yapee.com',
    remoteUser: process.env.DEPLOY_USER || 'deploy',
    remotePath: process.env.DEPLOY_PATH || '/var/www/html',
    backupDir: '/var/www/backups'
}

// Colors for output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
}

// Logging functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`)
}

function logInfo(message) {
    log(`[INFO] ${message}`, 'blue')
}

function logSuccess(message) {
    log(`[SUCCESS] ${message}`, 'green')
}

function logWarning(message) {
    log(`[WARNING] ${message}`, 'yellow')
}

function logError(message) {
    log(`[ERROR] ${message}`, 'red')
}

// Execute command and return output
function execCommand(command, options = {}) {
    try {
        return execSync(command, {
            encoding: 'utf8',
            stdio: 'pipe',
            ...options
        })
    } catch (error) {
        throw new Error(`Command failed: ${command}\n${error.message}`)
    }
}

// Pre-deployment checks
function preDeploymentChecks() {
    logInfo('🔍 Running pre-deployment checks...')

    // Check if we're in the project root
    if (!existsSync(join(projectRoot, 'package.json'))) {
        throw new Error('package.json not found. Please run this script from the project root.')
    }

    // Check if dist directory exists
    if (!existsSync(join(projectRoot, 'dist'))) {
        throw new Error('dist directory not found. Please build the application first with: npm run build')
    }

    // Check if required files exist
    const requiredFiles = [
        'dist/index.html',
        'server/index.js',
        'package.json'
    ]

    for (const file of requiredFiles) {
        if (!existsSync(join(projectRoot, file))) {
            throw new Error(`Required file not found: ${file}`)
        }
    }

    logSuccess('✅ Pre-deployment checks passed')
}

// Build application
function buildApplication() {
    logInfo('🔨 Building application for production...')

    try {
        // Clean previous build
        if (platform() === 'win32') {
            execCommand('if exist dist rmdir /s /q dist', { cwd: projectRoot })
        } else {
            execCommand('rm -rf dist', { cwd: projectRoot })
        }

        // Install dependencies
        execCommand('npm ci', { cwd: projectRoot })

        // Build application
        execCommand('npm run build', { cwd: projectRoot })

        // Verify build
        if (!existsSync(join(projectRoot, 'dist/index.html'))) {
            throw new Error('Build failed - dist/index.html not found')
        }

        logSuccess('✅ Application built successfully')
    } catch (error) {
        throw new Error(`Build failed: ${error.message}`)
    }
}

// Create deployment package
function createDeploymentPackage() {
    logInfo('📦 Creating deployment package...')

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const packageName = `${config.appName}_${timestamp}.tar.gz`
    const tempDir = join(projectRoot, 'temp_deploy')

    try {
        // Create temporary directory
        if (platform() === 'win32') {
            execCommand(`mkdir "${tempDir}"`, { cwd: projectRoot })
        } else {
            execCommand(`mkdir -p "${tempDir}"`, { cwd: projectRoot })
        }

        // Copy files
        const filesToCopy = [
            'dist/*',
            'server/index.js',
            'package.json',
            'package-lock.json'
        ]

        for (const pattern of filesToCopy) {
            if (platform() === 'win32') {
                execCommand(`xcopy "${pattern}" "${tempDir}\\" /E /I /H /Y`, { cwd: projectRoot })
            } else {
                execCommand(`cp -r ${pattern} "${tempDir}/"`, { cwd: projectRoot })
            }
        }

        // Create ecosystem config for PM2
        const ecosystemConfig = {
            apps: [{
                name: config.appName,
                script: 'server/index.js',
                instances: 1,
                exec_mode: 'fork',
                env: {
                    NODE_ENV: 'production',
                    PORT: 3001
                },
                env_production: {
                    NODE_ENV: 'production',
                    PORT: 3001
                },
                error_file: './logs/err.log',
                out_file: './logs/out.log',
                log_file: './logs/combined.log',
                time: true,
                watch: false,
                max_memory_restart: '1G',
                restart_delay: 4000
            }]
        }

        writeFileSync(
            join(tempDir, 'ecosystem.config.js'),
            `module.exports = ${JSON.stringify(ecosystemConfig, null, 2)}`
        )

        // Create package
        if (platform() === 'win32') {
            // For Windows, we'll create a zip file instead
            execCommand(`powershell "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${packageName}' -Force"`, { cwd: projectRoot })
        } else {
            execCommand(`tar -czf "${packageName}" -C "${tempDir}" .`, { cwd: projectRoot })
        }

        logSuccess(`✅ Deployment package created: ${packageName}`)
        return packageName

    } catch (error) {
        throw new Error(`Failed to create deployment package: ${error.message}`)
    } finally {
        // Cleanup temp directory
        try {
            if (platform() === 'win32') {
                execCommand(`rmdir /s /q "${tempDir}"`, { cwd: projectRoot })
            } else {
                execCommand(`rm -rf "${tempDir}"`, { cwd: projectRoot })
            }
        } catch (cleanupError) {
            logWarning(`Failed to cleanup temp directory: ${cleanupError.message}`)
        }
    }
}

// Deploy to server (simplified local deployment for demo)
function deployToServer(packageName) {
    logInfo(`🚀 Deploying to local production environment`)

    const deployPath = join(projectRoot, 'production')

    try {
        // Create production directory
        if (platform() === 'win32') {
            execCommand(`if not exist "${deployPath}" mkdir "${deployPath}"`, { cwd: projectRoot })
        } else {
            execCommand(`mkdir -p "${deployPath}"`, { cwd: projectRoot })
        }

        // Extract package
        if (platform() === 'win32') {
            execCommand(`powershell "Expand-Archive -Path '${packageName}' -DestinationPath '${deployPath}' -Force"`, { cwd: projectRoot })
        } else {
            execCommand(`tar -xzf "${packageName}" -C "${deployPath}"`, { cwd: projectRoot })
        }

        // Install dependencies
        execCommand('npm ci --production', { cwd: deployPath })

        logSuccess(`✅ Application deployed to: ${deployPath}`)
        logInfo('💡 To start the production server, run:')
        logInfo(`   cd ${deployPath}`)
        logInfo('   NODE_ENV=production node server/index.js')

        return deployPath

    } catch (error) {
        throw new Error(`Deployment failed: ${error.message}`)
    }
}

// Main deployment process
async function main() {
    try {
        log('🚀 YA PEE Production Deployment (Local Demo)')
        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

        // Parse command line arguments
        const args = process.argv.slice(2)
        let skipBuild = false

        for (const arg of args) {
            if (arg === '--skip-build') {
                skipBuild = true
            }
        }

        // Pre-deployment checks
        preDeploymentChecks()

        // Build application (unless skipped)
        if (!skipBuild) {
            buildApplication()
        }

        // Create deployment package
        const packageName = createDeploymentPackage()

        // Confirm deployment
        log('')
        logWarning('⚠️  About to deploy to local production environment')
        log(`   Package: ${packageName}`)
        log('')

        // For demo purposes, auto-confirm
        logInfo('🔄 Proceeding with deployment...')

        // Deploy to server
        const deployPath = deployToServer(packageName)

        logSuccess('🎉 Local deployment completed successfully!')
        log('')
        log('📋 Deployment Summary:')
        log(`   📦 Deployment Path: ${deployPath}`)
        log('   🌐 To start server: npm run serve:local')
        log('   🏥 Health Check: http://localhost:3001/health')
        log('   🔌 API Health: http://localhost:3001/api/health')

        // Cleanup
        try {
            if (existsSync(join(projectRoot, packageName))) {
                if (platform() === 'win32') {
                    execCommand(`del "${packageName}"`, { cwd: projectRoot })
                } else {
                    execCommand(`rm "${packageName}"`, { cwd: projectRoot })
                }
            }
        } catch (cleanupError) {
            logWarning(`Failed to cleanup package: ${cleanupError.message}`)
        }

        log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    } catch (error) {
        logError(`❌ Deployment failed: ${error.message}`)
        process.exit(1)
    }
}

// Run main function
main()
