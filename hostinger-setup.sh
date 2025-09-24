#!/bin/bash

# OTA24Hours Hostinger VPS Deployment Script
# For Ubuntu 24.04 + OpenLiteSpeed + Node.js

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Configuration variables
VPS_IP=""
DB_PASSWORD=""
JWT_SECRET=""
EMAIL=""

# Function to get user input
get_configuration() {
    echo "🚀 OTA24Hours Hostinger VPS Deployment Setup"
    echo "=============================================="
    echo ""
    
    read -p "Enter your VPS IP address: " VPS_IP
    read -s -p "Enter MySQL password for ota_user: " DB_PASSWORD
    echo ""
    read -p "Enter JWT secret (32+ characters): " JWT_SECRET
    read -p "Enter email for SSL certificates: " EMAIL
    
    echo ""
    print_status "Configuration received. Starting deployment..."
    echo ""
}

# Function to update system
update_system() {
    print_header "Updating system packages..."
    apt update && apt upgrade -y
    
    print_status "Installing essential packages..."
    apt install -y curl wget git unzip software-properties-common mysql-server
    
    print_status "Installing PM2..."
    npm install -g pm2
    
    print_status "Installing Certbot for SSL..."
    apt install -y certbot
}

# Function to configure MySQL
setup_mysql() {
    print_header "Setting up MySQL database..."
    
    print_warning "Please run mysql_secure_installation manually after this script"
    
    # Create database setup script
    cat << EOF > /tmp/mysql_setup.sql
CREATE DATABASE IF NOT EXISTS travel_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'ota_user'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON travel_log.* TO 'ota_user'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    print_status "Database setup script created. Run: mysql -u root -p < /tmp/mysql_setup.sql"
}

# Function to create application directories
setup_directories() {
    print_header "Setting up application directories..."
    
    # Create main application directory in OpenLiteSpeed document root
    mkdir -p /usr/local/lsws/Example/html/ota24hours/{backend,frontend,admin,uploads,logs,backups}
    
    # Set proper permissions
    chown -R nobody:nogroup /usr/local/lsws/Example/html/ota24hours
    chmod -R 755 /usr/local/lsws/Example/html/ota24hours
    
    print_status "Application directories created in OpenLiteSpeed root"
    print_status "Upload your applications to:"
    print_status "  Backend: /usr/local/lsws/Example/html/ota24hours/backend"
    print_status "  Frontend: /usr/local/lsws/Example/html/ota24hours/frontend"
    print_status "  Admin: /usr/local/lsws/Example/html/ota24hours/admin"
}

# Function to create environment template
create_env_template() {
    print_header "Creating environment configuration template..."
    
    cat << EOF > /usr/local/lsws/Example/html/ota24hours/.env.production.template
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=ota_user
DB_PASSWORD=$DB_PASSWORD
DB_DATABASE=travel_log

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=24h

# URLs
FRONTEND_URL=https://ota24hours.com
ADMIN_URL=https://admin.ota24hours.com
API_URL=https://api.ota24hours.com

# File Uploads
UPLOAD_PATH=/usr/local/lsws/Example/html/ota24hours/uploads
MAX_FILE_SIZE=5242880

# CORS
CORS_ORIGIN=https://ota24hours.com,https://admin.ota24hours.com
CORS_CREDENTIALS=true

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=/usr/local/lsws/Example/html/ota24hours/logs/app.log
EOF

    print_status "Environment template created at /usr/local/lsws/Example/html/ota24hours/.env.production.template"
}

# Function to create PM2 ecosystem file
create_pm2_config() {
    print_header "Creating PM2 ecosystem configuration..."
    
    cat << 'EOF' > /usr/local/lsws/Example/html/ota24hours/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'ota-backend',
    script: 'index.js',
    cwd: '/usr/local/lsws/Example/html/ota24hours/backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/usr/local/lsws/Example/html/ota24hours/logs/backend-error.log',
    out_file: '/usr/local/lsws/Example/html/ota24hours/logs/backend-out.log',
    log_file: '/usr/local/lsws/Example/html/ota24hours/logs/backend.log',
    time: true,
    max_memory_restart: '1G',
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000
  }]
};
EOF

    print_status "PM2 ecosystem configuration created"
}

# Function to create health check script
create_health_check() {
    print_header "Creating health check script..."
    
    cat << 'EOF' > /usr/local/lsws/Example/html/ota24hours/healthcheck.sh
#!/bin/bash
echo "🏥 OTA24Hours Health Check - $(date)"
echo "=================================="

# Check OpenLiteSpeed
if systemctl is-active --quiet lsws; then
    echo "✅ OpenLiteSpeed is running"
else
    echo "❌ OpenLiteSpeed is down"
fi

# Check Backend API
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.ota24hours.com/health 2>/dev/null || echo "000")
if [ $BACKEND_STATUS -eq 200 ]; then
    echo "✅ Backend API is healthy (Status: $BACKEND_STATUS)"
else
    echo "❌ Backend API is down (Status: $BACKEND_STATUS)"
fi

# Check Frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://ota24hours.com 2>/dev/null || echo "000")
if [ $FRONTEND_STATUS -eq 200 ]; then
    echo "✅ Frontend is healthy (Status: $FRONTEND_STATUS)"
else
    echo "❌ Frontend is down (Status: $FRONTEND_STATUS)"
fi

# Check Admin
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://admin.ota24hours.com 2>/dev/null || echo "000")
if [ $ADMIN_STATUS -eq 200 ]; then
    echo "✅ Admin Panel is healthy (Status: $ADMIN_STATUS)"
else
    echo "❌ Admin Panel is down (Status: $ADMIN_STATUS)"
fi

# Check PM2 processes
echo "PM2 Process Status:"
pm2 status

# Check disk space
echo "Disk Usage:"
df -h /usr/local/lsws/Example/html

# Check memory
echo "Memory Usage:"
free -h
EOF

    chmod +x /usr/local/lsws/Example/html/ota24hours/healthcheck.sh
    print_status "Health check script created and made executable"
}

# Function to create backup script
create_backup_script() {
    print_header "Creating backup script..."
    
    cat << EOF > /usr/local/lsws/Example/html/ota24hours/backup.sh
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/usr/local/lsws/Example/html/ota24hours/backups"
DB_NAME="travel_log"
DB_USER="ota_user"
DB_PASSWORD="$DB_PASSWORD"

# Create database backup
mysqldump -u \$DB_USER -p\$DB_PASSWORD \$DB_NAME > \$BACKUP_DIR/db_backup_\$DATE.sql

# Compress backup
gzip \$BACKUP_DIR/db_backup_\$DATE.sql

# Remove backups older than 30 days
find \$BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_\$DATE.sql.gz"
EOF

    chmod +x /usr/local/lsws/Example/html/ota24hours/backup.sh
    print_status "Backup script created"
}

# Function to create SSL renewal script
create_ssl_renewal() {
    print_header "Creating SSL renewal script..."
    
    cat << 'EOF' > /usr/local/bin/renew-ssl.sh
#!/bin/bash
certbot renew --quiet --post-hook "systemctl reload lsws"
EOF

    chmod +x /usr/local/bin/renew-ssl.sh
    print_status "SSL renewal script created"
}

# Function to configure firewall
setup_firewall() {
    print_header "Configuring UFW firewall..."
    
    # Install UFW if not installed
    apt install -y ufw
    
    # Configure firewall rules
    ufw default deny incoming
    ufw default allow outgoing
    ufw allow ssh
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 7080/tcp  # OpenLiteSpeed WebAdmin
    ufw allow 8088/tcp  # OpenLiteSpeed Example port
    
    print_warning "Firewall rules configured but not enabled."
    print_warning "Run 'sudo ufw enable' when ready to activate firewall."
}

# Function to create deployment script
create_deployment_script() {
    print_header "Creating deployment script..."
    
    cat << 'EOF' > /usr/local/lsws/Example/html/ota24hours/deploy.sh
#!/bin/bash

APP_DIR="/usr/local/lsws/Example/html/ota24hours"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
ADMIN_DIR="$APP_DIR/admin"

echo "🚀 Starting OTA24Hours Deployment..."

# Deploy Backend
if [ -d "$BACKEND_DIR" ]; then
    echo "Deploying Backend..."
    cd $BACKEND_DIR
    npm install --production
    cp .env.production.template .env.production
    pm2 reload ota-backend 2>/dev/null || pm2 start ecosystem.config.js
fi

# Deploy Frontend
if [ -d "$FRONTEND_DIR" ]; then
    echo "Deploying Frontend..."
    cd $FRONTEND_DIR
    npm install --legacy-peer-deps
    npm run build
    cp -r dist/* /usr/local/lsws/Example/html/
fi

# Deploy Admin
if [ -d "$ADMIN_DIR" ]; then
    echo "Deploying Admin..."
    cd $ADMIN_DIR
    npm install --legacy-peer-deps
    npm run build
    mkdir -p /usr/local/lsws/Example/html/admin
    cp -r dist/* /usr/local/lsws/Example/html/admin/
fi

# Restart services
systemctl reload lsws
pm2 restart ota-backend 2>/dev/null || echo "PM2 backend not running"

echo "✅ Deployment completed!"

# Run health check
$APP_DIR/healthcheck.sh
EOF

    chmod +x /usr/local/lsws/Example/html/ota24hours/deploy.sh
    print_status "Deployment script created"
}

# Function to show next steps
show_next_steps() {
    print_header "Deployment setup completed!"
    
    echo ""
    print_status "📋 Next Steps:"
    echo ""
    print_status "1. Secure MySQL:"
    print_status "   sudo mysql_secure_installation"
    echo ""
    print_status "2. Setup database:"
    print_status "   mysql -u root -p < /tmp/mysql_setup.sql"
    echo ""
    print_status "3. Upload your applications to:"
    print_status "   Backend:  /usr/local/lsws/Example/html/ota24hours/backend"
    print_status "   Frontend: /usr/local/lsws/Example/html/ota24hours/frontend"
    print_status "   Admin:    /usr/local/lsws/Example/html/ota24hours/admin"
    echo ""
    print_status "4. Configure OpenLiteSpeed Virtual Hosts:"
    print_status "   Access WebAdmin Console: https://$VPS_IP:7080"
    print_status "   Default credentials: admin / 123456"
    echo ""
    print_status "5. Generate SSL certificates:"
    print_status "   certbot certonly --standalone -d ota24hours.com -d www.ota24hours.com --email $EMAIL"
    print_status "   certbot certonly --standalone -d admin.ota24hours.com --email $EMAIL"
    print_status "   certbot certonly --standalone -d api.ota24hours.com --email $EMAIL"
    echo ""
    print_status "6. Deploy applications:"
    print_status "   /usr/local/lsws/Example/html/ota24hours/deploy.sh"
    echo ""
    print_status "7. Enable firewall:"
    print_status "   sudo ufw enable"
    echo ""
    print_status "📁 Important files created:"
    print_status "├── /usr/local/lsws/Example/html/ota24hours/.env.production.template"
    print_status "├── /usr/local/lsws/Example/html/ota24hours/ecosystem.config.js"
    print_status "├── /usr/local/lsws/Example/html/ota24hours/deploy.sh"
    print_status "├── /usr/local/lsws/Example/html/ota24hours/healthcheck.sh"
    print_status "├── /usr/local/lsws/Example/html/ota24hours/backup.sh"
    print_status "└── /usr/local/bin/renew-ssl.sh"
    echo ""
    print_warning "Remember to follow the detailed guide in HOSTINGER_OPENLITESPEED_DEPLOYMENT.md"
}

# Main execution
main() {
    # Check if running as root
    if [[ $EUID -ne 0 ]]; then
       print_error "This script must be run as root"
       exit 1
    fi
    
    get_configuration
    update_system
    setup_mysql
    setup_directories
    create_env_template
    create_pm2_config
    create_health_check
    create_backup_script
    create_ssl_renewal
    setup_firewall
    create_deployment_script
    show_next_steps
    
    print_status "🎉 Hostinger VPS setup completed successfully!"
}

# Run main function
main "$@"