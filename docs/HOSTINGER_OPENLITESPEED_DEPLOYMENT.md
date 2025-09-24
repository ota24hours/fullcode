# 🚀 OTA24Hours Deployment Guide for Hostinger VPS
## Ubuntu 24.04 + OpenLiteSpeed + Node.js

### 🎯 Server Configuration
- **OS**: Ubuntu 24.04
- **Web Server**: OpenLiteSpeed (Pre-installed)
- **Runtime**: Node.js (Pre-installed)
- **Panel**: OpenLiteSpeed WebAdmin Console

### 🌐 Domain Structure
- **Main Frontend**: `ota24hours.com` (User platform)
- **Admin Panel**: `admin.ota24hours.com`
- **Backend API**: `api.ota24hours.com`

---

## 📋 Phase 1: Initial Server Setup

### 1.1 Connect to Your Hostinger VPS
```bash
ssh root@148.230.101.50
# Your Hostinger VPS IP: 148.230.101.50
```

### 1.2 Update System and Install Required Packages
```bash
# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git unzip software-properties-common mysql-server

# Install PM2 for process management
npm install -g pm2

# Install Certbot for SSL
apt install -y certbot
```

### 1.3 Verify Pre-installed Software
```bash
# Check Node.js version
node --version

# Check NPM version
npm --version

# Check OpenLiteSpeed status
systemctl status lsws

# Access OpenLiteSpeed WebAdmin Console
# URL: https://YOUR_VPS_IP:7080
# Default credentials are usually: admin / 123456
```

---

## 📋 Phase 2: Database Setup

### 2.1 Configure MySQL
```bash
# Secure MySQL installation
mysql_secure_installation
```

**Follow the prompts:**
- Set root password: `Yes` (use a strong password)
- Remove anonymous users: `Yes`
- Disallow root login remotely: `Yes`
- Remove test database: `Yes`
- Reload privilege tables: `Yes`

### 2.2 Create Database and User
```bash
# Login to MySQL
mysql -u root -p
```

```sql
-- Create database
CREATE DATABASE travel_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user with secure password
CREATE USER 'ota_user'@'localhost' IDENTIFIED BY 'OTA24hrs_Secure_2025!';

-- Grant privileges
GRANT ALL PRIVILEGES ON travel_log.* TO 'ota_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 2.3 Test Database Connection
```bash
mysql -u ota_user -p travel_log
# Should connect successfully
```

---

## 📋 Phase 3: Application Directory Setup

### 3.1 Create Application Structure
```bash
# Create main application directory
mkdir -p /usr/local/lsws/Example/html/ota24hours
cd /usr/local/lsws/Example/html/ota24hours

# Create subdirectories
mkdir -p backend frontend admin uploads logs

# Set proper permissions
chown -R nobody:nogroup /usr/local/lsws/Example/html/ota24hours
chmod -R 755 /usr/local/lsws/Example/html/ota24hours
```

### 3.2 Upload Your Applications

**Option A: Using SCP/SFTP from your local machine**
```bash
# From your Windows machine (PowerShell):
scp -r E:\OTA24Hours\travel-backend-main root@YOUR_VPS_IP:/usr/local/lsws/Example/html/ota24hours/backend
scp -r E:\OTA24Hours\tours-kerala-main root@YOUR_VPS_IP:/usr/local/lsws/Example/html/ota24hours/frontend
scp -r E:\OTA24Hours\tours-kerala-admin-main root@YOUR_VPS_IP:/usr/local/lsws/Example/html/ota24hours/admin
```

**Option B: Using Git (recommended)**
```bash
cd /usr/local/lsws/Example/html/ota24hours
git clone https://github.com/ota24hours/backend.git backend
git clone https://github.com/ota24hours/frontend.git frontend
git clone https://github.com/ota24hours/admin.git admin
```

---

## 📋 Phase 4: Backend Configuration

### 4.1 Setup Backend Application
```bash
cd /usr/local/lsws/Example/html/ota24hours/backend

# Install dependencies (including TypeScript for production)
npm install --production
npm install -g typescript ts-node

# Install TypeScript dependencies locally if needed
npm install typescript ts-node @types/node --save-dev

# Create production environment file
cp .env .env.production
```

### 4.2 Configure Environment Variables
```bash
nano .env.production
```

**Update with these values:**
```env
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=ota_user
DB_PASSWORD=OTA24hrs_Secure_2025!
DB_DATABASE=travel_log

# JWT Configuration
JWT_SECRET=OTA24Hours_JWT_SecureKey_2025_ProductionReady!
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
```

### 4.3 Create PM2 Ecosystem File
```bash
nano /usr/local/lsws/Example/html/ota24hours/backend/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'ota-backend',
    script: 'index.ts',
    interpreter: 'node',
    interpreter_args: '-r ts-node/register',
    cwd: '/usr/local/lsws/Example/html/ota24hours/backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      TS_NODE_PROJECT: './tsconfig.json'
    },
    error_file: '/usr/local/lsws/Example/html/ota24hours/logs/backend-error.log',
    out_file: '/usr/local/lsws/Example/html/ota24hours/logs/backend-out.log',
    log_file: '/usr/local/lsws/Example/html/ota24hours/logs/backend.log',
    time: true,
    max_memory_restart: '1G',
    autorestart: true
  }]
};
```

### 4.4 Start Backend with PM2
```bash
cd /usr/local/lsws/Example/html/ota24hours/backend

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
# Follow the instructions provided by PM2

# Check status
pm2 status
```

---

## 📋 Phase 5: Frontend Applications Setup

### 5.1 Configure User Frontend
```bash
cd /usr/local/lsws/Example/html/ota24hours/frontend

# Install dependencies
npm install --legacy-peer-deps

# Update production environment
nano src/environments/environment.prod.ts
```

**Update environment.prod.ts:**
```typescript
export const environment = {
  production: true,
  demo: 'saas',
  baseUrl: 'https://api.ota24hours.com',
  // Add other configurations as needed
};
```

```bash
# Build for production
npm run build

# Move build files to web root
cp -r dist/* /usr/local/lsws/Example/html/
```

### 5.2 Configure Admin Frontend
```bash
cd /usr/local/lsws/Example/html/ota24hours/admin

# Install dependencies
npm install --legacy-peer-deps

# Update production environment
nano src/environments/environment.prod.ts
```

**Update environment.prod.ts:**
```typescript
export const environment = {
  production: true,
  baseUrl: 'https://api.ota24hours.com',
  // Add other configurations as needed
};
```

```bash
# Build for production
npm run build

# Create admin directory in web root
mkdir -p /usr/local/lsws/Example/html/admin
cp -r dist/* /usr/local/lsws/Example/html/admin/
```

---

## 📋 Phase 6: OpenLiteSpeed Configuration

### 6.1 Access OpenLiteSpeed WebAdmin Console
1. **Primary Access**: `https://148.230.101.50:7080`
2. **Alternative Access**: `http://148.230.101.50:7080` (if HTTPS fails)
3. **Hostinger Panel**: Check if OpenLiteSpeed is running via Hostinger control panel
4. Login with default credentials (admin/123456) or your updated credentials
   **If admin/123456 doesn't work, reset the password using SSH:**
   ```bash
   # Reset OpenLiteSpeed admin password
   sudo /usr/local/lsws/admin/misc/admpass.sh
   ```
   **Follow the prompts to set new username and password**
5. Change default password in **Actions > Change Password**

**Troubleshooting WebAdmin Access:**
```bash
# Check if OpenLiteSpeed is running
systemctl status lsws

# Check if port 7080 is open
netstat -tlnp | grep :7080

# Restart OpenLiteSpeed if needed
systemctl restart lsws

# Check OpenLiteSpeed logs
tail -f /usr/local/lsws/logs/error.log

# Alternative: Access via Hostinger control panel
# Look for "OpenLiteSpeed" in your Hostinger dashboard
```

### 6.2 Configure Virtual Hosts

#### 6.2.1 Main Frontend Virtual Host (ota24hours.com)
1. Go to **Virtual Hosts** tab
2. Click **Add** (+ icon)
3. Fill in details:
   - **Virtual Host Name**: `ota24hours.com`
   - **Virtual Host Root**: `/usr/local/lsws/Example/html/`
   - **Config File**: `$SERVER_ROOT/conf/vhosts/ota24hours.com/vhconf.conf`
   - **Enable Scripts/ExtApps**: Yes

4. Click **Save**

5. Configure the Virtual Host:
   - Click on **ota24hours.com** virtual host
   - Go to **General** tab:
     - **Document Root**: `/usr/local/lsws/Example/html/`
     - **Index Files**: `index.html`
   
   - Go to **Listeners** tab and create HTTP(80) and HTTPS(443) listeners
   
   - Go to **SSL** tab (after creating SSL certificates):
     - **Private Key File**: `/etc/letsencrypt/live/ota24hours.com/privkey.pem`
     - **Certificate File**: `/etc/letsencrypt/live/ota24hours.com/fullchain.pem`

#### 6.2.2 Admin Panel Virtual Host (admin.ota24hours.com)
1. Repeat similar process for admin subdomain:
   - **Virtual Host Name**: `admin.ota24hours.com`
   - **Document Root**: `/usr/local/lsws/Example/html/admin/`

#### 6.2.3 API Virtual Host (api.ota24hours.com)
1. Create API virtual host:
   - **Virtual Host Name**: `api.ota24hours.com`
   - **Document Root**: `/usr/local/lsws/Example/html/ota24hours/backend/`

2. **Configure Script Handler for Node.js:**
   - Go to **Script Handler** tab
   - Click **Add** (+ icon)
   - **Configuration Options:**
   
   **Option 1 - Recommended (Proxy Method):**
   ```
   Suffixes: *
   Handler Type: Proxy
   Handler Name: http://localhost:5000
   ```
   
   **Option 2 - CGI Method:**
   ```
   Suffixes: js
   Handler Type: CGI
   Handler Name: /usr/bin/node
   ```
   
   **Option 3 - If you see LiteSpeed SAPI:**
   ```
   Suffixes: js
   Handler Type: LiteSpeed SAPI
   Handler Name: lsphp81 (or available version)
   ```

3. **Configure Rewrite Rules (Recommended for API):**
   - Go to **Rewrite** tab
   - **Enable Rewrite**: Yes
   - **Rewrite Rules**:
     ```
     RewriteEngine On
     RewriteRule ^(.*)$ http://localhost:5000$1 [P,L]
     ```

4. **Alternative: Configure as External App**
   - Go to **Actions** > **External Apps**
   - **Type**: `Node.js`
   - **Address**: `uds://tmp/lshttpd/lsphp.sock`
   - **Max Connections**: `35`
   - **Initial Request Timeout (secs)**: `60`
   - **Retry Timeout (secs)**: `0`

### 6.3 Configure Domain Mapping
1. Go to **Listeners** tab
2. For each listener (HTTP:80 and HTTPS:443), add virtual host mappings:
   - `ota24hours.com` → `ota24hours.com`
   - `www.ota24hours.com` → `ota24hours.com`
   - `admin.ota24hours.com` → `admin.ota24hours.com`
   - `api.ota24hours.com` → `api.ota24hours.com`

---

## 📋 Phase 7: SSL Certificate Setup

### 7.1 Generate SSL Certificates using Certbot
```bash
# Stop OpenLiteSpeed temporarily
systemctl stop lsws

# Generate certificates for all domains
certbot certonly --standalone -d ota24hours.com -d www.ota24hours.com --email admin@ota24hours.com --agree-tos --non-interactive

certbot certonly --standalone -d admin.ota24hours.com --email admin@ota24hours.com --agree-tos --non-interactive

certbot certonly --standalone -d api.ota24hours.com --email admin@ota24hours.com --agree-tos --non-interactive

# Start OpenLiteSpeed
systemctl start lsws
```

### 7.2 Configure SSL in OpenLiteSpeed
1. Go back to **OpenLiteSpeed WebAdmin Console**
2. For each Virtual Host, configure SSL:
   - **SSL** tab
   - **Private Key File**: `/etc/letsencrypt/live/DOMAIN/privkey.pem`
   - **Certificate File**: `/etc/letsencrypt/live/DOMAIN/fullchain.pem`
   - **Protocol Version**: TLSv1.2, TLSv1.3

### 7.3 Setup Auto-renewal
```bash
# Create renewal script
nano /usr/local/bin/renew-ssl.sh
```

```bash
#!/bin/bash
certbot renew --quiet --post-hook "systemctl reload lsws"
```

```bash
# Make script executable
chmod +x /usr/local/bin/renew-ssl.sh

# Add to crontab
crontab -e
# Add this line:
0 12 * * * /usr/local/bin/renew-ssl.sh
```

---

## 📋 Phase 8: Security Configuration

### 8.1 Configure Firewall
```bash
# Install UFW if not installed
apt install -y ufw

# Configure firewall rules
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 7080/tcp  # OpenLiteSpeed WebAdmin (consider restricting to specific IPs)
ufw allow 8088/tcp  # OpenLiteSpeed Example port

# Enable firewall
ufw enable

# Check status
ufw status
```

### 8.2 Secure OpenLiteSpeed WebAdmin
1. In **OpenLiteSpeed WebAdmin Console**:
2. Go to **Actions > Security**
3. Change default admin password
4. Configure **Access Control** to restrict admin panel access to specific IPs
5. Consider changing default port 7080 to custom port

---

## 📋 Phase 9: Performance Optimization

### 9.1 OpenLiteSpeed Optimization
1. In **OpenLiteSpeed WebAdmin Console**:
2. Go to **Server Configuration > Tuning**:
   - **Max Connections**: 2000
   - **Max SSL Connections**: 1000
   - **Connection Timeout**: 300
   - **Max Keep-Alive Requests**: 1000

3. **Cache Configuration**:
   - Go to **Server Configuration > Cache**
   - Enable **Object Cache**
   - **Cache Directory**: `/tmp/lshttpdcache`

### 9.2 Node.js Application Optimization (Optional)
```bash
# Configure PM2 for better performance (Optional)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true

# Additional PM2 optimizations (Optional)
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'
pm2 set pm2-logrotate:workerInterval 30
pm2 set pm2-logrotate:dateFormat 'YYYY-MM-DD_HH-mm-ss'
```

**Note**: These optimizations improve log management and performance but are not required for basic functionality.

---

## 📋 Phase 10: Testing and Validation

### 10.1 Restart All Services
```bash
# Restart OpenLiteSpeed
systemctl restart lsws

# Restart PM2 applications
pm2 restart all

# Check service status
systemctl status lsws
pm2 status
```

### 10.2 Test All Applications
```bash
# Test backend API
curl -I https://api.ota24hours.com/health

# Test if domains resolve
curl -I https://ota24hours.com
curl -I https://admin.ota24hours.com
```

### 10.3 Browser Testing

**Expected Results:**
1. **Main Frontend**: `https://ota24hours.com` - Should load Angular user platform
2. **Admin Panel**: `https://admin.ota24hours.com` - Should load Angular admin interface
   - Login with: `super_admin` / `admin@123`
3. **API Health Check**: `https://api.ota24hours.com/health` - Should return JSON response

**Common Issues and Solutions:**

**Issue 1: Main domain shows "Hello World! From OpenLiteSpeed NodeJS"**
- This means the default OpenLiteSpeed page is loading instead of your Angular frontend
- **Solution**: Check if Angular build files are in the correct location
```bash
# Check if Angular build files exist
ls -la /usr/local/lsws/Example/html/
# Should see index.html and other Angular files

# If missing, rebuild and copy Angular files
cd /usr/local/lsws/Example/html/ota24hours/frontend
npm run build
cp -r dist/* /usr/local/lsws/Example/html/
```

**Issue 2: SSL Errors on API/Admin domains**
- SSL certificates may not be properly configured
- **Solution**: Check SSL certificate installation
```bash
# Check if SSL certificates exist
ls -la /etc/letsencrypt/live/

# If certificates don't exist, generate them
systemctl stop lsws
certbot certonly --standalone -d ota24hours.com -d www.ota24hours.com
certbot certonly --standalone -d admin.ota24hours.com
certbot certonly --standalone -d api.ota24hours.com
systemctl start lsws
```

**Issue 3: 500 Internal Server Error for API/Admin**
- Backend API may not be running or misconfigured
- **Solution**: Check PM2 and backend status
```bash
# Check PM2 status
pm2 status

# Check backend logs
pm2 logs ota-backend

# Restart backend if needed
pm2 restart ota-backend

# Test local API
curl http://localhost:5000/health
```

---

## 📋 Phase 11: Monitoring and Backup

### 11.1 Create Health Check Script
```bash
nano /usr/local/lsws/Example/html/ota24hours/healthcheck.sh
```

```bash
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
```

```bash
chmod +x /usr/local/lsws/Example/html/ota24hours/healthcheck.sh
```

### 11.2 Setup Database Backup
```bash
# Create backup directory
mkdir -p /usr/local/lsws/Example/html/ota24hours/backups

# Create backup script
nano /usr/local/lsws/Example/html/ota24hours/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/usr/local/lsws/Example/html/ota24hours/backups"
DB_NAME="travel_log"
DB_USER="ota_user"
DB_PASSWORD="OTA24hrs_Secure_2025!"

# Create database backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

```bash
chmod +x /usr/local/lsws/Example/html/ota24hours/backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /usr/local/lsws/Example/html/ota24hours/backup.sh
```

---

## 🎯 Final Verification Checklist

### ✅ Services Running
- [ ] OpenLiteSpeed service: `systemctl status lsws`
- [ ] MySQL service: `systemctl status mysql`
- [ ] PM2 backend process: `pm2 status`

### ✅ Domain Access
- [ ] `https://ota24hours.com` - User platform loads
- [ ] `https://admin.ota24hours.com` - Admin panel loads
- [ ] `https://api.ota24hours.com/health` - API responds

### ✅ SSL Certificates
- [ ] All domains have valid SSL certificates
- [ ] No browser SSL warnings
- [ ] Auto-renewal configured

### ✅ Functionality
- [ ] Admin login works: `super_admin` / `admin@123`
- [ ] Database connection working
- [ ] File uploads working
- [ ] API endpoints responding

---

## 🚨 Troubleshooting Common Issues

### Issue: Main Domain Shows Default OpenLiteSpeed Page

**Problem**: `https://ota24hours.com/` shows "Hello World! From OpenLiteSpeed NodeJS"

**Root Cause**: Angular frontend build files are not in the correct location

**Solution:**
```bash
# 1. Check current web root contents
ls -la /usr/local/lsws/Example/html/

# 2. Navigate to frontend directory and rebuild
cd /usr/local/lsws/Example/html/ota24hours/frontend
npm run build --prod

# 3. Copy build files to web root (overwrite existing)
cp -rf dist/* /usr/local/lsws/Example/html/

# 4. Set proper permissions
chown -R nobody:nogroup /usr/local/lsws/Example/html/
chmod -R 755 /usr/local/lsws/Example/html/

# 5. Restart OpenLiteSpeed
systemctl restart lsws
```

### Issue: SSL Errors and Certificate Problems

**Problem**: SSL errors on `api.ota24hours.com` and `admin.ota24hours.com`

**Root Cause**: SSL certificates not properly generated or configured

**Solution:**
```bash
# 1. Stop OpenLiteSpeed to free up ports 80/443
systemctl stop lsws

# 2. Generate SSL certificates for all domains
certbot certonly --standalone -d ota24hours.com -d www.ota24hours.com --email admin@ota24hours.com --agree-tos --non-interactive

certbot certonly --standalone -d admin.ota24hours.com --email admin@ota24hours.com --agree-tos --non-interactive

certbot certonly --standalone -d api.ota24hours.com --email admin@ota24hours.com --agree-tos --non-interactive

# 3. Verify certificates were created
ls -la /etc/letsencrypt/live/

# 4. Start OpenLiteSpeed
systemctl start lsws

# 5. Configure SSL in OpenLiteSpeed WebAdmin Console
# - Go to Virtual Hosts → Each domain → SSL tab
# - Set Private Key: /etc/letsencrypt/live/DOMAIN/privkey.pem
# - Set Certificate: /etc/letsencrypt/live/DOMAIN/fullchain.pem
```

### Issue: 500 Internal Server Error for API

**Problem**: `http://api.ota24hours.com/health` returns 500 error

**Root Cause**: Backend API not running or proxy misconfiguration

**Solution:**
```bash
# 1. Check if backend is running
pm2 status

# 2. If not running, start it
cd /usr/local/lsws/Example/html/ota24hours/backend
pm2 start ecosystem.config.js

# 3. Check backend logs for errors
pm2 logs ota-backend

# 4. Test backend locally
curl http://localhost:5000/health

# 5. If local test works, check OpenLiteSpeed proxy configuration
# In WebAdmin Console:
# - Go to Virtual Hosts → api.ota24hours.com → Script Handler
# - Ensure proxy is set to: http://localhost:5000
# - Go to Rewrite tab and ensure rules are:
#   RewriteEngine On
#   RewriteRule ^(.*)$ http://localhost:5000$1 [P,L]

# 6. Restart OpenLiteSpeed
systemctl restart lsws
```

### Issue: Admin Panel 500 Error

**Problem**: `admin.ota24hours.com` returns 500 error

**Root Cause**: Admin build files missing or misconfigured

**Solution:**
```bash
# 1. Check if admin build files exist
ls -la /usr/local/lsws/Example/html/admin/

# 2. If missing, rebuild admin panel
cd /usr/local/lsws/Example/html/ota24hours/admin
npm run build --prod

# 3. Copy admin build files
mkdir -p /usr/local/lsws/Example/html/admin
cp -rf dist/* /usr/local/lsws/Example/html/admin/

# 4. Set proper permissions
chown -R nobody:nogroup /usr/local/lsws/Example/html/admin/
chmod -R 755 /usr/local/lsws/Example/html/admin/

# 5. Restart OpenLiteSpeed
systemctl restart lsws
```

### Quick Fix Commands (Run these in order):

```bash
# 1. Ensure backend is running
cd /usr/local/lsws/Example/html/ota24hours/backend
pm2 restart ota-backend
pm2 status

# 2. Rebuild and deploy frontend
cd /usr/local/lsws/Example/html/ota24hours/frontend
npm run build --prod
cp -rf dist/* /usr/local/lsws/Example/html/

# 3. Rebuild and deploy admin
cd /usr/local/lsws/Example/html/ota24hours/admin
npm run build --prod
mkdir -p /usr/local/lsws/Example/html/admin
cp -rf dist/* /usr/local/lsws/Example/html/admin/

# 4. Fix permissions
chown -R nobody:nogroup /usr/local/lsws/Example/html/
chmod -R 755 /usr/local/lsws/Example/html/

# 5. Generate SSL certificates (if needed)
systemctl stop lsws
certbot certonly --standalone -d ota24hours.com -d www.ota24hours.com --email admin@ota24hours.com --agree-tos --non-interactive
certbot certonly --standalone -d admin.ota24hours.com --email admin@ota24hours.com --agree-tos --non-interactive  
certbot certonly --standalone -d api.ota24hours.com --email admin@ota24hours.com --agree-tos --non-interactive
systemctl start lsws

# 6. Restart all services
systemctl restart lsws
pm2 restart all
```

### Issue: OpenLiteSpeed WebAdmin Not Loading (https://148.230.101.50:7080)

**Possible Causes & Solutions:**

1. **OpenLiteSpeed Not Running**
```bash
# Check service status
systemctl status lsws

# If not running, start it
systemctl start lsws

# Enable auto-start
systemctl enable lsws
```

2. **Port 7080 Blocked by Firewall**
```bash
# Check if port is open
ufw status | grep 7080

# Open port 7080
ufw allow 7080/tcp

# Check if port is listening
netstat -tlnp | grep :7080
```

3. **Hostinger-Specific Configuration**
```bash
# Hostinger might use different paths or configs
# Check if OpenLiteSpeed is pre-configured
ls -la /usr/local/lsws/

# Check for custom admin port
grep -r "7080\|8080\|9080" /usr/local/lsws/conf/

# Check Hostinger control panel for OpenLiteSpeed section
```

4. **Alternative Access Methods**
- Try `http://148.230.101.50:7080` (without HTTPS)
- Try `http://148.230.101.50:8080` (common alternative)
- Check Hostinger control panel for direct OpenLiteSpeed access
- SSH into server and configure manually

5. **Reset OpenLiteSpeed Admin Password (Most Common Solution)**
```bash
# Reset admin credentials - this will prompt for new username/password
sudo /usr/local/lsws/admin/misc/admpass.sh

# Alternative method if above doesn't work
cd /usr/local/lsws/admin/misc/
sudo ./admpass.sh

# Check admin configuration file
sudo cat /usr/local/lsws/admin/conf/admin_config.conf
```

**During password reset, you'll be prompted for:**
- Admin username (recommend: `admin`)
- Admin password (create a strong password)
- Confirm password

**Common Hostinger default credentials to try:**
- `admin` / `admin`
- `admin` / `password`
- `root` / `123456`
- Check your Hostinger control panel for custom credentials

6. **Check Admin Configuration**
- Login to your Hostinger account
- Go to VPS management
- Look for "OpenLiteSpeed" or "Web Server" section
- There might be a direct link to the admin panel

### Issue: Virtual Host Not Loading
1. Check OpenLiteSpeed error logs: `/usr/local/lsws/logs/error.log`
2. Verify domain mapping in **Listeners**
3. Restart OpenLiteSpeed: `systemctl restart lsws`

### Issue: API Not Responding
1. Check PM2 status: `pm2 status`
2. Check PM2 logs: `pm2 logs ota-backend`
3. Verify proxy rules in API virtual host

### Issue: SSL Certificate Problems
1. Check certificate files exist: `ls -la /etc/letsencrypt/live/`
2. Verify SSL configuration in virtual hosts
3. Test renewal: `certbot renew --dry-run`

### Issue: Database Connection Failed
1. Test connection: `mysql -u ota_user -p travel_log`
2. Check MySQL status: `systemctl status mysql`
3. Verify credentials in `.env.production`

---

## 📞 Support Commands

```bash
# Service management
systemctl status lsws mysql
pm2 status
pm2 logs ota-backend

# Health check
/usr/local/lsws/Example/html/ota24hours/healthcheck.sh

# View logs
tail -f /usr/local/lsws/logs/error.log
tail -f /usr/local/lsws/logs/access.log

# Restart services
systemctl restart lsws
pm2 restart ota-backend

# SSL management
certbot certificates
certbot renew --dry-run
```

---

## 🎉 Congratulations!

Your OTA24Hours travel platform is now successfully deployed on Hostinger VPS with OpenLiteSpeed!

**Access URLs:**
- **User Platform**: https://ota24hours.com
- **Admin Panel**: https://admin.ota24hours.com (super_admin / admin@123)
- **API Endpoint**: https://api.ota24hours.com
- **OpenLiteSpeed WebAdmin**: https://YOUR_VPS_IP:7080

Your platform is now live and ready for business operations!