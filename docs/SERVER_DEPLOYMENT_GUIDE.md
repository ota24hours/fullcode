# OTA24Hours Server Deployment Guide

## 🌐 Domain Structure
- **Main Frontend (User)**: `ota24hours.com`
- **Admin Panel**: `admin.ota24hours.com`
- **Backend API**: `api.ota24hours.com`

## 📋 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: Minimum 50GB SSD
- **CPU**: 2+ cores
- **Bandwidth**: Unlimited or high quota

### Software Stack
- Node.js 18+ 
- MySQL 8.0+
- Nginx (reverse proxy)
- PM2 (process manager)
- SSL certificates (Let's Encrypt)

## 🚀 Phase 1: Server Setup

### 1.1 Initial Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 1.2 Install MySQL

```bash
# Install MySQL
sudo apt install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

```sql
-- In MySQL console
CREATE DATABASE travel_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ota_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON travel_log.* TO 'ota_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 1.3 Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 1.4 Install PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 startup script
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

## 🚀 Phase 2: Domain Configuration

### 2.1 DNS Records Setup

Configure these DNS records in your domain provider:

```
Type    Name        Value               TTL
A       @           YOUR_SERVER_IP      300
A       admin       YOUR_SERVER_IP      300
A       api         YOUR_SERVER_IP      300
CNAME   www         ota24hours.com      300
```

### 2.2 SSL Certificates

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificates
sudo certbot --nginx -d ota24hours.com -d www.ota24hours.com
sudo certbot --nginx -d admin.ota24hours.com
sudo certbot --nginx -d api.ota24hours.com

# Auto-renewal setup
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚀 Phase 3: Backend Deployment

### 3.1 Prepare Backend Files

```bash
# Create application directory
sudo mkdir -p /var/www/ota24hours
sudo chown -R $USER:$USER /var/www/ota24hours

# Navigate to directory
cd /var/www/ota24hours

# Upload your backend files (use one of these methods):
# Method 1: Git clone
git clone YOUR_BACKEND_REPO backend

# Method 2: SCP from local machine
# scp -r E:\OTA24Hours\travel-backend-main user@server:/var/www/ota24hours/backend

# Method 3: Upload via FTP/SFTP
```

### 3.2 Configure Backend Environment

```bash
cd /var/www/ota24hours/backend

# Install dependencies
npm install --production

# Create production environment file
cp .env .env.production
```

**Edit .env.production:**

```env
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=ota_user
DB_PASSWORD=your_secure_password_here
DB_DATABASE=travel_log

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here_minimum_32_characters
JWT_EXPIRES_IN=24h

# API Configuration
API_PREFIX=/api/v1

# File Upload Configuration
UPLOAD_PATH=/var/www/ota24hours/uploads
MAX_FILE_SIZE=5242880

# Email Configuration (if needed)
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_password

# Other configurations
FRONTEND_URL=https://ota24hours.com
ADMIN_URL=https://admin.ota24hours.com
```

### 3.3 Database Migration

```bash
# Run database migrations
npm run build
NODE_ENV=production npm run start

# Or if you have migration scripts:
# npm run migrate
```

### 3.4 PM2 Configuration

Create PM2 ecosystem file:

```bash
nano /var/www/ota24hours/backend/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'ota-backend',
    script: 'index.js',
    cwd: '/var/www/ota24hours/backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/ota-backend-error.log',
    out_file: '/var/log/ota-backend-out.log',
    log_file: '/var/log/ota-backend.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### 3.5 Start Backend Service

```bash
# Start with PM2
cd /var/www/ota24hours/backend
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs ota-backend
```

## 🚀 Phase 4: Frontend Applications Deployment

### 4.1 Prepare Frontend Applications

```bash
# Create frontend directories
mkdir -p /var/www/ota24hours/frontend
mkdir -p /var/www/ota24hours/admin

# Upload frontend files
# Method 1: Copy from local
# scp -r E:\OTA24Hours\tours-kerala-main user@server:/var/www/ota24hours/frontend
# scp -r E:\OTA24Hours\tours-kerala-admin-main user@server:/var/www/ota24hours/admin
```

### 4.2 Build User Frontend

```bash
cd /var/www/ota24hours/frontend

# Install dependencies
npm install --legacy-peer-deps

# Update environment for production
nano src/environments/environment.prod.ts
```

**environment.prod.ts:**

```typescript
export const environment = {
  production: true,
  demo: 'saas',
  baseUrl: 'https://api.ota24hours.com',
  // Add other production configurations
};
```

```bash
# Build for production
npm run build

# The built files will be in dist/ folder
```

### 4.3 Build Admin Frontend

```bash
cd /var/www/ota24hours/admin

# Install dependencies
npm install --legacy-peer-deps

# Update environment for production
nano src/environments/environment.prod.ts
```

**environment.prod.ts:**

```typescript
export const environment = {
  production: true,
  baseUrl: 'https://api.ota24hours.com',
  // Add other production configurations
};
```

```bash
# Build for production
npm run build

# The built files will be in dist/ folder
```

## 🚀 Phase 5: Nginx Configuration

### 5.1 Main Frontend Configuration

```bash
sudo nano /etc/nginx/sites-available/ota24hours.com
```

```nginx
server {
    listen 80;
    server_name ota24hours.com www.ota24hours.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ota24hours.com www.ota24hours.com;

    ssl_certificate /etc/letsencrypt/live/ota24hours.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ota24hours.com/privkey.pem;

    root /var/www/ota24hours/frontend/dist/travel-ota;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5.2 Admin Panel Configuration

```bash
sudo nano /etc/nginx/sites-available/admin.ota24hours.com
```

```nginx
server {
    listen 80;
    server_name admin.ota24hours.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.ota24hours.com;

    ssl_certificate /etc/letsencrypt/live/admin.ota24hours.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.ota24hours.com/privkey.pem;

    root /var/www/ota24hours/admin/dist/tours-kerala-admin;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5.3 Backend API Configuration

```bash
sudo nano /etc/nginx/sites-available/api.ota24hours.com
```

```nginx
upstream backend {
    server 127.0.0.1:5000;
    keepalive 32;
}

server {
    listen 80;
    server_name api.ota24hours.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.ota24hours.com;

    ssl_certificate /etc/letsencrypt/live/api.ota24hours.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.ota24hours.com/privkey.pem;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;

    location / {
        limit_req zone=api burst=10 nodelay;

        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Buffer sizes
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }

    # File upload endpoint with increased limits
    location /api/v1/upload {
        client_max_body_size 10M;
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.4 Enable Sites

```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/ota24hours.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin.ota24hours.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.ota24hours.com /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 🚀 Phase 6: Security & Optimization

### 6.1 Firewall Configuration

```bash
# Install UFW
sudo apt install -y ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3306/tcp  # MySQL (only from localhost)

# Enable firewall
sudo ufw enable
```

### 6.2 MySQL Security

```bash
# Create MySQL configuration
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Add these optimizations:

```ini
[mysqld]
bind-address = 127.0.0.1
max_connections = 500
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
query_cache_type = 1
query_cache_size = 64M
```

```bash
# Restart MySQL
sudo systemctl restart mysql
```

### 6.3 Log Management

```bash
# Create log rotation
sudo nano /etc/logrotate.d/ota24hours
```

```
/var/log/ota-*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
```

## 🚀 Phase 7: Monitoring & Backup

### 7.1 PM2 Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

### 7.2 Database Backup Script

```bash
# Create backup directory
sudo mkdir -p /var/backups/ota24hours

# Create backup script
sudo nano /var/backups/ota24hours/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/ota24hours"
DB_NAME="travel_log"
DB_USER="ota_user"
DB_PASSWORD="your_secure_password_here"

# Create database backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

```bash
# Make script executable
sudo chmod +x /var/backups/ota24hours/backup.sh

# Add to crontab for daily backups
sudo crontab -e
# Add this line:
0 2 * * * /var/backups/ota24hours/backup.sh
```

## 🚀 Phase 8: Deployment Commands

### 8.1 Quick Deployment Script

Create a deployment script:

```bash
nano /var/www/ota24hours/deploy.sh
```

```bash
#!/bin/bash

echo "Starting OTA24Hours deployment..."

# Backend deployment
echo "Deploying backend..."
cd /var/www/ota24hours/backend
git pull origin main
npm install --production
pm2 reload ota-backend

# Frontend deployment
echo "Deploying frontend..."
cd /var/www/ota24hours/frontend
git pull origin main
npm install --legacy-peer-deps
npm run build

# Admin deployment
echo "Deploying admin..."
cd /var/www/ota24hours/admin
git pull origin main
npm install --legacy-peer-deps
npm run build

# Reload Nginx
sudo systemctl reload nginx

echo "Deployment completed!"
```

### 8.2 Health Check Script

```bash
nano /var/www/ota24hours/healthcheck.sh
```

```bash
#!/bin/bash

# Check backend
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.ota24hours.com/health)
if [ $BACKEND_STATUS -eq 200 ]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is down (Status: $BACKEND_STATUS)"
fi

# Check frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://ota24hours.com)
if [ $FRONTEND_STATUS -eq 200 ]; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is down (Status: $FRONTEND_STATUS)"
fi

# Check admin
ADMIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://admin.ota24hours.com)
if [ $ADMIN_STATUS -eq 200 ]; then
    echo "✅ Admin is healthy"
else
    echo "❌ Admin is down (Status: $ADMIN_STATUS)"
fi

# Check PM2
pm2 status
```

## 🎯 Final Checklist

- [ ] Server setup complete
- [ ] DNS records configured
- [ ] SSL certificates installed
- [ ] Backend deployed and running
- [ ] Frontend built and served
- [ ] Admin panel built and served
- [ ] Nginx configured
- [ ] Security measures in place
- [ ] Monitoring setup
- [ ] Backup system configured

## 🔗 Access URLs

After deployment:
- **User Platform**: https://ota24hours.com
- **Admin Panel**: https://admin.ota24hours.com
- **API Endpoint**: https://api.ota24hours.com

## 📞 Support Commands

```bash
# Check all services
sudo systemctl status nginx mysql
pm2 status

# View logs
pm2 logs ota-backend
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart ota-backend
sudo systemctl restart nginx mysql

# SSL renewal
sudo certbot renew --dry-run
```

---

**Note**: Replace placeholder values (passwords, domains, etc.) with your actual production values before deployment.