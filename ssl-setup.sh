# OTA24Hours SSL Certificate Setup Script

#!/bin/bash

# Configuration
DOMAIN_MAIN="ota24hours.com"
DOMAIN_ADMIN="admin.ota24hours.com"
DOMAIN_API="api.ota24hours.com"
EMAIL="admin@ota24hours.com"  # Change this to your email

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root (use sudo)"
   exit 1
fi

print_status "🔒 Starting SSL Certificate Setup for OTA24Hours"

# Install Certbot if not already installed
if ! command -v certbot &> /dev/null; then
    print_status "Installing Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
fi

# Stop nginx temporarily
print_status "Stopping Nginx temporarily..."
systemctl stop nginx

# Generate SSL certificates for all domains
print_status "Generating SSL certificate for main domain: $DOMAIN_MAIN"
certbot certonly --standalone -d $DOMAIN_MAIN -d www.$DOMAIN_MAIN --email $EMAIL --agree-tos --non-interactive

print_status "Generating SSL certificate for admin domain: $DOMAIN_ADMIN"
certbot certonly --standalone -d $DOMAIN_ADMIN --email $EMAIL --agree-tos --non-interactive

print_status "Generating SSL certificate for API domain: $DOMAIN_API"
certbot certonly --standalone -d $DOMAIN_API --email $EMAIL --agree-tos --non-interactive

# Start nginx
print_status "Starting Nginx..."
systemctl start nginx

# Test nginx configuration
print_status "Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    print_status "✅ Nginx configuration is valid"
    systemctl reload nginx
else
    print_error "❌ Nginx configuration has errors"
    exit 1
fi

# Setup auto-renewal
print_status "Setting up SSL certificate auto-renewal..."
cat << 'EOF' > /etc/cron.d/certbot-renewal
# Certbot renewal cron job for OTA24Hours
0 12 * * * root /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
EOF

# Test renewal process
print_status "Testing certificate renewal..."
certbot renew --dry-run

# Display certificate information
print_status "📋 SSL Certificate Information:"
echo "=================================="
certbot certificates

print_status "🔒 SSL setup completed successfully!"
print_status ""
print_status "📋 Certificate Details:"
print_status "Main Domain: $DOMAIN_MAIN"
print_status "Admin Domain: $DOMAIN_ADMIN"
print_status "API Domain: $DOMAIN_API"
print_status ""
print_status "🔄 Auto-renewal is configured to run daily at 12:00 PM"
print_status "Certificates will be automatically renewed when they have 30 days or less remaining"
print_status ""
print_warning "Make sure your Nginx configuration files are using the correct SSL certificate paths:"
print_warning "Certificate: /etc/letsencrypt/live/DOMAIN/fullchain.pem"
print_warning "Private Key: /etc/letsencrypt/live/DOMAIN/privkey.pem"