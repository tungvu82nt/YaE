#!/bin/bash

# ===========================================
# YA PEE PRODUCTION DEPLOYMENT SCRIPT
# Automated deployment for production environment
# ===========================================

set -e  # Exit on any error

# Configuration
APP_NAME="yapee-ecommerce"
REMOTE_HOST="${REMOTE_HOST:-yapee.com}"
REMOTE_USER="${REMOTE_USER:-deploy}"
REMOTE_PATH="${REMOTE_PATH:-/var/www/html}"
BACKUP_DIR="${BACKUP_DIR:-/var/www/backups}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Pre-deployment checks
pre_deployment_checks() {
    log_info "🔍 Running pre-deployment checks..."

    # Check if we're in the project root
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please run this script from the project root."
        exit 1
    fi

    # Check if dist directory exists
    if [ ! -d "dist" ]; then
        log_error "dist directory not found. Please build the application first with: npm run build"
        exit 1
    fi

    # Check if required files exist
    required_files=("dist/index.html" "server/index.js" "package.json")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_error "Required file not found: $file"
            exit 1
        fi
    done

    log_success "✅ Pre-deployment checks passed"
}

# Build application
build_application() {
    log_info "🔨 Building application for production..."

    # Clean previous build
    rm -rf dist

    # Install dependencies
    npm ci

    # Build application
    npm run build

    # Verify build
    if [ ! -f "dist/index.html" ]; then
        log_error "Build failed - dist/index.html not found"
        exit 1
    fi

    log_success "✅ Application built successfully"
}

# Create deployment package
create_deployment_package() {
    log_info "📦 Creating deployment package..."

    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local package_name="${APP_NAME}_${timestamp}.tar.gz"

    # Create temporary directory
    local temp_dir=$(mktemp -d)

    # Copy files to temp directory
    mkdir -p "$temp_dir/app"
    cp -r dist/* "$temp_dir/app/"
    cp server/index.js "$temp_dir/app/"
    cp package.json "$temp_dir/app/"
    cp package-lock.json "$temp_dir/app/" 2>/dev/null || true

    # Create ecosystem file for PM2
    cat > "$temp_dir/app/ecosystem.config.js" << EOF
module.exports = {
  apps: [{
    name: '${APP_NAME}',
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
EOF

    # Create package
    cd "$temp_dir"
    tar -czf "$package_name" app/
    mv "$package_name" "$OLDPWD/"
    cd "$OLDPWD"

    # Cleanup
    rm -rf "$temp_dir"

    echo "$package_name"
    log_success "✅ Deployment package created: $package_name"
}

# Deploy to server
deploy_to_server() {
    local package_name=$1

    log_info "🚀 Deploying to server: $REMOTE_HOST"

    # Create backup on remote server
    log_info "📋 Creating backup on remote server..."
    ssh "$REMOTE_USER@$REMOTE_HOST" "
        mkdir -p $BACKUP_DIR
        if [ -d '$REMOTE_PATH' ]; then
            timestamp=\$(date +'%Y%m%d_%H%M%S')
            tar -czf '$BACKUP_DIR/backup_\$timestamp.tar.gz' -C '$REMOTE_PATH' . 2>/dev/null || true
            echo 'Backup created: backup_\$timestamp.tar.gz'
        fi
    "

    # Upload package
    log_info "📤 Uploading deployment package..."
    scp "$package_name" "$REMOTE_USER@$REMOTE_HOST:/tmp/"

    # Deploy on remote server
    log_info "🔄 Deploying application..."
    ssh "$REMOTE_USER@$REMOTE_HOST" "
        set -e

        # Stop existing application
        if command -v pm2 &> /dev/null; then
            pm2 stop '${APP_NAME}' 2>/dev/null || true
            pm2 delete '${APP_NAME}' 2>/dev/null || true
        fi

        # Extract package
        rm -rf '$REMOTE_PATH'
        mkdir -p '$REMOTE_PATH'
        tar -xzf '/tmp/$package_name' -C '$REMOTE_PATH' --strip-components=1

        # Install dependencies
        cd '$REMOTE_PATH'
        npm ci --production

        # Start application with PM2
        if command -v pm2 &> /dev/null; then
            pm2 start ecosystem.config.js --env production
            pm2 save
            pm2 startup
        else
            echo 'PM2 not found. Starting with Node.js directly...'
            NODE_ENV=production nohup node server/index.js > app.log 2>&1 &
            echo \$! > app.pid
        fi

        # Cleanup
        rm '/tmp/$package_name'

        echo 'Deployment completed successfully!'
    "

    log_success "✅ Deployment completed successfully"
}

# Post-deployment verification
verify_deployment() {
    log_info "🔍 Verifying deployment..."

    # Wait for application to start
    sleep 5

    # Test health endpoint
    local health_check_url="http://$REMOTE_HOST/health"
    local max_attempts=10
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        log_info "Testing health check (attempt $attempt/$max_attempts)..."

        if curl -s --max-time 10 "$health_check_url" > /dev/null; then
            log_success "✅ Application is responding correctly"
            return 0
        fi

        sleep 5
        ((attempt++))
    done

    log_error "❌ Application health check failed after $max_attempts attempts"
    return 1
}

# Rollback function
rollback_deployment() {
    log_warning "🔄 Initiating rollback..."

    ssh "$REMOTE_USER@$REMOTE_HOST" "
        # Stop current application
        if command -v pm2 &> /dev/null; then
            pm2 stop '${APP_NAME}' 2>/dev/null || true
            pm2 delete '${APP_NAME}' 2>/dev/null || true
        else
            if [ -f '$REMOTE_PATH/app.pid' ]; then
                kill \$(cat '$REMOTE_PATH/app.pid') 2>/dev/null || true
            fi
        fi

        # Find latest backup
        latest_backup=\$(ls -t $BACKUP_DIR/backup_*.tar.gz 2>/dev/null | head -1)

        if [ -n \"\$latest_backup\" ]; then
            # Restore from backup
            rm -rf '$REMOTE_PATH'
            mkdir -p '$REMOTE_PATH'
            tar -xzf \"\$latest_backup\" -C '$REMOTE_PATH'

            # Restart application
            cd '$REMOTE_PATH'
            if command -v pm2 &> /dev/null; then
                pm2 start ecosystem.config.js --env production 2>/dev/null || true
            else
                NODE_ENV=production nohup node server/index.js > app.log 2>&1 &
            fi

            echo 'Rollback completed successfully!'
        else
            echo 'No backup found for rollback!'
        fi
    "
}

# Main deployment process
main() {
    log_info "🚀 Starting YA PEE Production Deployment"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --host=*)
                REMOTE_HOST="${1#*=}"
                shift
                ;;
            --user=*)
                REMOTE_USER="${1#*=}"
                shift
                ;;
            --path=*)
                REMOTE_PATH="${1#*=}"
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                echo "Usage: $0 [--host=hostname] [--user=username] [--path=remote_path] [--skip-build]"
                exit 1
                ;;
        esac
    done

    # Pre-deployment checks
    pre_deployment_checks

    # Build application (unless skipped)
    if [ "$SKIP_BUILD" != "true" ]; then
        build_application
    fi

    # Create deployment package
    local package_name=$(create_deployment_package)

    # Confirm deployment
    echo ""
    log_warning "⚠️  About to deploy to: $REMOTE_HOST"
    log_warning "   Remote path: $REMOTE_PATH"
    log_warning "   Package: $package_name"
    echo ""
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Deployment cancelled by user"
        rm -f "$package_name"
        exit 0
    fi

    # Deploy to server
    if deploy_to_server "$package_name"; then
        # Verify deployment
        if verify_deployment; then
            log_success "🎉 Deployment successful!"
            echo ""
            log_info "📋 Deployment Summary:"
            echo "   🌐 Application URL: http://$REMOTE_HOST"
            echo "   🏥 Health Check: http://$REMOTE_HOST/health"
            echo "   🔌 API Health: http://$REMOTE_HOST/api/health"
            echo "   📦 Deployment Package: $package_name"

            # Cleanup local package
            rm -f "$package_name"
        else
            log_error "❌ Deployment verification failed"
            echo ""
            read -p "Do you want to rollback? (y/N): " -n 1 -r
            echo

            if [[ $REPLY =~ ^[Yy]$ ]]; then
                rollback_deployment
            fi

            exit 1
        fi
    else
        log_error "❌ Deployment failed"
        rm -f "$package_name"
        exit 1
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Handle script interruption
trap 'echo -e "\n${RED}Deployment interrupted by user${NC}"; exit 1' INT TERM

# Run main function
main "$@"
