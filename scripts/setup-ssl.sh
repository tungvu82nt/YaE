#!/bin/bash

# SSL Certificate Setup Script
# YA PEE E-commerce Platform

set -e

# Configuration
DOMAIN="${DOMAIN:-yapee.com}"
EMAIL="${SSL_EMAIL:-admin@yapee.com}"
CERTBOT_DIR="/etc/letsencrypt"
WEBROOT="/var/www/html"

echo "🔒 Setting up SSL certificates for $DOMAIN"

# Install Certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."

    # Ubuntu/Debian
    if command -v apt-get &> /dev/null; then
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    fi

    # CentOS/RHEL
    if command -v yum &> /dev/null; then
        yum install -y certbot python-certbot-nginx
    fi
fi

# Create webroot directory for Let's Encrypt challenges
mkdir -p "$WEBROOT/.well-known/acme-challenge"

# Stop nginx temporarily (if running)
if systemctl is-active --quiet nginx; then
    echo "⏸️  Stopping nginx for certificate generation..."
    systemctl stop nginx
fi

# Generate SSL certificate
echo "📜 Generating SSL certificate..."
certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --domain "$DOMAIN" \
    --domain "www.$DOMAIN"

# Restart nginx
if systemctl is-active --quiet nginx || systemctl is-enabled nginx; then
    echo "▶️  Starting nginx..."
    systemctl start nginx
fi

# Verify certificate
echo "✅ Verifying SSL certificate..."
openssl x509 -in "$CERTBOT_DIR/live/$DOMAIN/cert.pem" -text -noout | head -10

# Create symbolic links for nginx
echo "🔗 Creating SSL certificate symlinks..."
ln -sf "$CERTBOT_DIR/live/$DOMAIN/fullchain.pem" /etc/ssl/certs/yapee.crt
ln -sf "$CERTBOT_DIR/live/$DOMAIN/privkey.pem" /etc/ssl/certs/yapee.key

# Set proper permissions
chmod 600 /etc/ssl/certs/yapee.key
chmod 644 /etc/ssl/certs/yapee.crt

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
nginx -t

# Reload nginx
echo "🔄 Reloading nginx..."
nginx -s reload

# Setup automatic renewal
echo "⏰ Setting up automatic certificate renewal..."
cat > /etc/cron.d/certbot-renew << EOF
0 12 * * * root /usr/bin/certbot renew --quiet --post-hook "nginx -s reload"
EOF

chmod 644 /etc/cron.d/certbot-renew

# Enable cron service if not running
if ! systemctl is-active --quiet cron; then
    systemctl enable cron
    systemctl start cron
fi

echo "🎉 SSL setup completed successfully!"
echo "🔒 Certificate details:"
echo "   Domain: $DOMAIN"
echo "   Certificate path: $CERTBOT_DIR/live/$DOMAIN/"
echo "   Expires: $(openssl x509 -in "$CERTBOT_DIR/live/$DOMAIN/cert.pem" -enddate -noout | cut -d= -f2)"
echo "   Auto-renewal: Enabled (daily check)"

# Test HTTPS connection
echo "🌐 Testing HTTPS connection..."
sleep 2
curl -I "https://$DOMAIN" | head -5

echo "✅ SSL certificate setup completed!"
echo "🔄 Certificate will auto-renew before expiration"
