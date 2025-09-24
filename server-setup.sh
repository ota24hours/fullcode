#!/bin/bash

# OTA24Hours Server Setup Script
# Run this script on your server as a user with sudo privileges

set -e

echo "🚀 Starting OTA24Hours Server Setup..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a user with sudo privileges."
   exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
print_status "Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common build-essential

# Install Node.js 20 LTS
print_status "Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_status "Node.js installed: $NODE_VERSION"
print_status "NPM installed: $NPM_VERSION"

# Install MySQL
print_status "Installing MySQL Server..."
sudo apt install -y mysql-server

print_warning "Please run 'sudo mysql_secure_installation' after this script completes to secure MySQL."

# Install Nginx
print_status "Installing Nginx..."
sudo apt install -y nginx

# Start and enable services
print_status "Starting and enabling services..."
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl start mysql
sudo systemctl enable mysql

# Install PM2
print_status "Installing PM2 process manager..."
sudo npm install -g pm2

# Install Certbot for SSL
print_status "Installing Certbot for SSL certificates..."
sudo apt install -y certbot python3-certbot-nginx

# Create application directories
print_status "Creating application directories..."
sudo mkdir -p /var/www/ota24hours/{backend,frontend,admin,uploads}
sudo mkdir -p /var/log/ota24hours
sudo mkdir -p /var/backups/ota24hours

# Set permissions
print_status "Setting up permissions..."
sudo chown -R $USER:$USER /var/www/ota24hours
sudo chown -R $USER:$USER /var/log/ota24hours
sudo chmod -R 755 /var/www/ota24hours

# Install UFW firewall
print_status "Installing and configuring UFW firewall..."
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

print_warning "Firewall rules set but not enabled. Run 'sudo ufw enable' when ready."

# Create MySQL database and user
print_status "Setting up MySQL database..."
cat << 'EOF' > /tmp/mysql_setup.sql
CREATE DATABASE IF NOT EXISTS travel_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'ota_user'@'localhost' IDENTIFIED BY 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON travel_log.* TO 'ota_user'@'localhost';
FLUSH PRIVILEGES;
EOF

print_warning "Database setup script created at /tmp/mysql_setup.sql"
print_warning "Please run: sudo mysql < /tmp/mysql_setup.sql"
print_warning "And change the default password in the script!"

# Create basic backup script
print_status "Creating backup script..."
cat << 'EOF' > /var/backups/ota24hours/backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/ota24hours"
DB_NAME="travel_log"
DB_USER="ota_user"
DB_PASSWORD="CHANGE_THIS_PASSWORD"

# Create database backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
EOF

chmod +x /var/backups/ota24hours/backup.sh

# Create health check script
print_status "Creating health check script..."
cat << 'EOF' > /var/www/ota24hours/healthcheck.sh
#!/bin/bash

echo "🏥 OTA24Hours Health Check"
echo "========================="

# Check backend
echo "Checking Backend API..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.ota24hours.com/health 2>/dev/null || echo "000")
if [ $BACKEND_STATUS -eq 200 ]; then
    echo "✅ Backend is healthy (Status: $BACKEND_STATUS)"
else
    echo "❌ Backend is down (Status: $BACKEND_STATUS)"
fi

# Check frontend
echo "Checking Frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://ota24hours.com 2>/dev/null || echo "000")
if [ $FRONTEND_STATUS -eq 200 ]; then
    echo "✅ Frontend is healthy (Status: $FRONTEND_STATUS)"
else
    echo "❌ Frontend is down (Status: $FRONTEND_STATUS)"
fi

# Check admin
echo "Checking Admin Panel..."
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://admin.ota24hours.com 2>/dev/null || echo "000")
if [ $ADMIN_STATUS -eq 200 ]; then
    echo "✅ Admin is healthy (Status: $ADMIN_STATUS)"
else
    echo "❌ Admin is down (Status: $ADMIN_STATUS)"
fi

# Check PM2 processes
echo "Checking PM2 Processes..."
pm2 status

# Check disk space
echo "Checking Disk Space..."
df -h /var/www /var/log /var/backups

# Check memory usage
echo "Checking Memory Usage..."
free -h
EOF

chmod +x /var/www/ota24hours/healthcheck.sh

print_status "✅ Server setup completed!"
print_status ""
print_status "📋 Next Steps:"
print_status "1. Configure MySQL: sudo mysql < /tmp/mysql_setup.sql (after updating password)"
print_status "2. Upload your application files to /var/www/ota24hours/"
print_status "3. Configure DNS records for your domains"
print_status "4. Generate SSL certificates with certbot"
print_status "5. Configure Nginx virtual hosts"
print_status "6. Enable firewall: sudo ufw enable"
print_status ""
print_status "📁 Application Structure:"
print_status "├── /var/www/ota24hours/backend     (Upload your backend here)"
print_status "├── /var/www/ota24hours/frontend    (Upload your frontend here)"
print_status "├── /var/www/ota24hours/admin       (Upload your admin here)"
print_status "├── /var/www/ota24hours/uploads     (File uploads directory)"
print_status "└── /var/www/ota24hours/healthcheck.sh (Health monitoring)"
print_status ""
print_warning "Remember to:"
print_warning "- Change default MySQL password in backup script"
print_warning "- Configure proper environment variables"
print_warning "- Set up monitoring and alerting"
print_warning "- Configure regular backups"

echo "🎉 Setup complete! Your server is ready for OTA24Hours deployment."