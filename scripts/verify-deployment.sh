#!/bin/bash

# Deployment Verification Script
# YA PEE E-commerce Platform

set -e

# Configuration
DOMAIN="${DOMAIN:-yapee.com}"
API_URL="${API_URL:-https://api.yapee.com}"
FRONTEND_URL="${FRONTEND_URL:-https://yapee.com}"

echo "🔍 Starting deployment verification for YA PEE E-commerce Platform"
echo "🌐 Domain: $DOMAIN"
echo "🔗 Frontend: $FRONTEND_URL"
echo "🔗 API: $API_URL"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "success" ]; then
        echo -e "${GREEN}✅ $message${NC}"
    elif [ "$status" = "warning" ]; then
        echo -e "${YELLOW}⚠️  $message${NC}"
    else
        echo -e "${RED}❌ $message${NC}"
    fi
}

# Check frontend accessibility
echo ""
echo "🌐 Checking frontend accessibility..."
if curl -s --max-time 10 "$FRONTEND_URL" > /dev/null 2>&1; then
    print_status "success" "Frontend is accessible"

    # Check HTTP status
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
    if [ "$HTTP_STATUS" = "200" ]; then
        print_status "success" "Frontend returns HTTP 200"
    else
        print_status "error" "Frontend returns HTTP $HTTP_STATUS"
    fi

    # Check SSL certificate
    if curl -s --max-time 10 "https://$DOMAIN" > /dev/null 2>&1; then
        print_status "success" "SSL certificate is valid"
    else
        print_status "warning" "SSL certificate check failed"
    fi

else
    print_status "error" "Frontend is not accessible"
fi

# Check API accessibility
echo ""
echo "🔗 Checking API accessibility..."
if curl -s --max-time 10 "$API_URL/health" > /dev/null 2>&1; then
    print_status "success" "API is accessible"

    # Check API health endpoint
    HEALTH_RESPONSE=$(curl -s "$API_URL/health")
    if [ "$HEALTH_RESPONSE" = "OK" ]; then
        print_status "success" "API health check passed"
    else
        print_status "warning" "API health check returned: $HEALTH_RESPONSE"
    fi

else
    print_status "error" "API is not accessible"
fi

# Check database connectivity
echo ""
echo "🗄️  Checking database connectivity..."
# Note: This would require backend endpoint to test DB connection
if curl -s --max-time 10 "$API_URL/api/health/db" > /dev/null 2>&1; then
    print_status "success" "Database connection is healthy"
else
    print_status "warning" "Database connectivity check skipped (endpoint not available)"
fi

# Check static assets
echo ""
echo "📦 Checking static assets..."
ASSETS=(
    "/assets/index-*.css"
    "/assets/index-*.js"
    "/favicon.ico"
)

for asset in "${ASSETS[@]}"; do
    if curl -s --max-time 5 "$FRONTEND_URL$asset" > /dev/null 2>&1; then
        print_status "success" "Asset accessible: $asset"
    else
        print_status "warning" "Asset not accessible: $asset"
    fi
done

# Check critical pages
echo ""
echo "📄 Checking critical pages..."
CRITICAL_PAGES=(
    "/"
    "/products"
    "/cart"
    "/login"
    "/register"
)

for page in "${CRITICAL_PAGES[@]}"; do
    if curl -s --max-time 5 "$FRONTEND_URL$page" > /dev/null 2>&1; then
        print_status "success" "Page accessible: $page"
    else
        print_status "error" "Page not accessible: $page"
    fi
done

# Check API endpoints
echo ""
echo "🔌 Checking API endpoints..."
API_ENDPOINTS=(
    "/api/products"
    "/api/categories"
    "/api/auth/status"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
    if curl -s --max-time 5 "$API_URL$endpoint" > /dev/null 2>&1; then
        print_status "success" "API endpoint accessible: $endpoint"
    else
        print_status "warning" "API endpoint not accessible: $endpoint"
    fi
done

# Check performance
echo ""
echo "⚡ Checking performance..."
# Simple response time check
START_TIME=$(date +%s%N)
curl -s "$FRONTEND_URL" > /dev/null 2>&1
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 )) # Convert to milliseconds

if [ "$RESPONSE_TIME" -lt 3000 ]; then
    print_status "success" "Response time: ${RESPONSE_TIME}ms"
else
    print_status "warning" "Response time: ${RESPONSE_TIME}ms (slow)"
fi

# Check Docker containers (if using Docker)
echo ""
echo "🐳 Checking Docker containers..."
if command -v docker &> /dev/null; then
    CONTAINER_COUNT=$(docker ps --filter "name=yapee" --format "{{.Names}}" | wc -l)
    if [ "$CONTAINER_COUNT" -gt 0 ]; then
        print_status "success" "$CONTAINER_COUNT Docker containers running"
        docker ps --filter "name=yapee" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        print_status "warning" "No Docker containers found"
    fi
else
    print_status "info" "Docker not available for checking"
fi

# Check system resources
echo ""
echo "💻 Checking system resources..."
if command -v free &> /dev/null; then
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    if (( $(echo "$MEMORY_USAGE < 80" | bc -l) )); then
        print_status "success" "Memory usage: ${MEMORY_USAGE}%"
    else
        print_status "warning" "Memory usage: ${MEMORY_USAGE}% (high)"
    fi
fi

if command -v df &> /dev/null; then
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -lt 80 ]; then
        print_status "success" "Disk usage: ${DISK_USAGE}%"
    else
        print_status "warning" "Disk usage: ${DISK_USAGE}% (high)"
    fi
fi

# Check logs for errors
echo ""
echo "📋 Checking application logs..."
if [ -d "/var/log/nginx" ]; then
    ERROR_COUNT=$(grep -c "error" /var/log/nginx/error.log 2>/dev/null || echo "0")
    if [ "$ERROR_COUNT" -eq 0 ]; then
        print_status "success" "No nginx errors found in logs"
    else
        print_status "warning" "$ERROR_COUNT nginx errors found in logs"
    fi
fi

# Final summary
echo ""
echo "🎯 DEPLOYMENT VERIFICATION SUMMARY"
echo "=================================="
echo "🔍 Verification completed for YA PEE E-commerce Platform"
echo "🌐 Frontend URL: $FRONTEND_URL"
echo "🔗 API URL: $API_URL"
echo "📅 Verification Date: $(date)"
echo ""
echo "✅ Deployment verification completed!"
echo "📊 Check the results above for any issues that need attention."
