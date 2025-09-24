# Travel Backend - Installation & Setup Checklist

## Pre-Installation Requirements

### System Requirements
- [ ] **Operating System**: Ubuntu 20.04+ / Windows Server 2019+ / macOS 12+
- [ ] **CPU**: Minimum 2 vCPUs, Recommended 4+ vCPUs  
- [ ] **Memory**: Minimum 2GB RAM, Recommended 4GB+ RAM
- [ ] **Storage**: Minimum 10GB, Recommended 50GB+ SSD
- [ ] **Network**: Stable internet connection for external API calls

### Required Software
- [ ] **Node.js**: v18.x or v20.x LTS (Current: v22.15.0 detected)
- [ ] **npm**: v9.x+ (Current: v10.9.2 detected)
- [ ] **MySQL**: v8.0+ or v5.7.8+ with JSON support
- [ ] **Git**: For source code management
- [ ] **PM2**: `npm install -g pm2` (for production)

## Installation Steps

### 1. Environment Setup
- [ ] Clone or extract the codebase to desired location
- [ ] Navigate to project directory: `cd e:\OTA24Hours\travel-backend-main`
- [ ] Verify Node.js version: `node -v` (should show v18+ or v20+)
- [ ] Verify npm version: `npm -v`

### 2. Database Setup
- [ ] **Install MySQL Server**
  ```sql
  -- Create database
  CREATE DATABASE travel_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  
  -- Create user (replace with secure password)
  CREATE USER 'travel_log'@'localhost' IDENTIFIED BY 'your_secure_password';
  GRANT ALL PRIVILEGES ON travel_log.* TO 'travel_log'@'localhost';
  FLUSH PRIVILEGES;
  ```

- [ ] **Test Database Connection**
  ```bash
  mysql -u travel_log -p travel_log
  ```

### 3. Application Configuration

#### 3.1 Environment Variables (CRITICAL)
- [ ] **Create .env file** from template:
  ```bash
  cp .env.example .env  # If template exists
  # OR create manually with content below
  ```

- [ ] **Configure .env file** with secure values:
  ```env
  # Server Configuration
  PORT=5000
  NODE_ENV=production
  TZ=Asia/Kolkata
  
  # Database Configuration (⚠️ CHANGE DEFAULT PASSWORD)
  DB_HOST=localhost
  DB_PORT=3306
  DB_USERNAME=travel_log
  DB_PASSWORD=your_secure_database_password
  DB_DATABASE=travel_log
  
  # Security (⚠️ GENERATE NEW SECRET)
  JWT_SECRET=your_secure_jwt_secret_minimum_32_characters
  JWT_EXPIRES_IN=24h
  
  # File Storage
  IMAGE_BASE_URL=https://yourdomain.com/img
  BASE_URL=https://yourdomain.com
  
  # Payment Gateway (⚠️ REPLACE TEST CREDENTIALS)
  RAZOR_KEY_ID=your_production_razorpay_key_id
  RAZOR_KEY_SECRET=your_production_razorpay_secret
  RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
  
  # Optional
  PAGINATION_LIMIT=20
  DEBUG=false
  ```

#### 3.2 Security Hardening (REQUIRED)
- [ ] **Move JWT Secret from Source Code**
  ```typescript
  // In utils/jwt_utls.ts, replace hardcoded secret:
  const tokenKey = process.env.JWT_SECRET || "fallback_secret";
  ```

- [ ] **Move Database Credentials from Source Code**
  ```typescript
  // In src/data_source/data_source.ts, replace hardcoded values:
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ```

- [ ] **Disable TypeORM Auto-Sync for Production**
  ```typescript
  // In data_source.ts
  synchronize: process.env.NODE_ENV !== 'production',
  ```

### 4. Dependency Installation
- [ ] **Install Node.js Dependencies**
  ```bash
  npm install
  ```

- [ ] **Fix Security Vulnerabilities**
  ```bash
  npm audit fix
  ```

- [ ] **Update Vulnerable Packages**
  ```bash
  npm update
  npm audit  # Verify fixes
  ```

### 5. Application Initialization

#### 5.1 Development Environment
- [ ] **Start Development Server**
  ```bash
  npm run dev
  ```

- [ ] **Initialize Default Admin** (One-time only)
  ```bash
  curl http://localhost:5000/init
  # OR visit: http://localhost:5000/init in browser
  ```

- [ ] **Test API Response**
  ```bash
  curl http://localhost:5000
  # Should serve static content or return valid response
  ```

#### 5.2 Production Environment
- [ ] **Build Application**
  ```bash
  npm run build
  ```

- [ ] **Start with PM2**
  ```bash
  pm2 start ecosystem.config.ts
  pm2 save
  pm2 startup  # Follow instructions for auto-start
  ```

- [ ] **Verify PM2 Status**
  ```bash
  pm2 status
  pm2 logs
  ```

### 6. External Service Configuration

#### 6.1 Razorpay Payment Gateway
- [ ] **Create Razorpay Account** (if not exists)
- [ ] **Generate API Keys** for production
- [ ] **Configure Webhook URL**: `https://yourdomain.com/razorpay/webhook`
- [ ] **Test Payment Flow** in staging environment

#### 6.2 Firebase Admin SDK (Optional)
- [ ] **Create Firebase Project** (if using push notifications)
- [ ] **Download Service Account Key**
- [ ] **Set Environment Variables**:
  ```env
  FIREBASE_PROJECT_ID=your_project_id
  FIREBASE_PRIVATE_KEY=your_private_key  
  FIREBASE_CLIENT_EMAIL=your_service_account_email
  ```

#### 6.3 File Storage Setup
- [ ] **Create Upload Directories**
  ```bash
  mkdir -p public/uploads
  mkdir -p excels  
  mkdir -p pdfs
  ```

- [ ] **Set Directory Permissions**
  ```bash
  chmod 755 public excels pdfs
  ```

- [ ] **Configure Static File Serving** (if using CDN)

### 7. Web Server Configuration (Production)

#### 7.1 Nginx Setup (Recommended)
- [ ] **Install Nginx**
  ```bash
  sudo apt update && sudo apt install nginx
  ```

- [ ] **Configure Reverse Proxy** 
  ```nginx
  # /etc/nginx/sites-available/travel-backend
  server {
      listen 80;
      server_name yourdomain.com;
      
      location / {
          proxy_pass http://localhost:5000;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
      
      # Static file serving
      location /img/ {
          alias /path/to/app/public/;
          expires 30d;
      }
  }
  ```

- [ ] **Enable Site and Restart Nginx**
  ```bash
  sudo ln -s /etc/nginx/sites-available/travel-backend /etc/nginx/sites-enabled/
  sudo nginx -t  # Test configuration
  sudo systemctl reload nginx
  ```

#### 7.2 SSL/TLS Setup
- [ ] **Install Certbot**
  ```bash
  sudo apt install certbot python3-certbot-nginx
  ```

- [ ] **Generate SSL Certificate**
  ```bash
  sudo certbot --nginx -d yourdomain.com
  ```

### 8. Monitoring & Logging Setup

#### 8.1 Application Monitoring
- [ ] **Configure PM2 Monitoring**
  ```bash
  pm2 install pm2-logrotate
  pm2 set pm2-logrotate:max_size 10M
  pm2 set pm2-logrotate:retain 30
  ```

- [ ] **Set up Health Check Endpoint** (requires code modification)
  ```typescript
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime() 
    });
  });
  ```

#### 8.2 Database Monitoring
- [ ] **Configure MySQL Slow Query Log**
  ```sql
  SET GLOBAL slow_query_log = 'ON';
  SET GLOBAL long_query_time = 2;
  SET GLOBAL slow_query_log_file = '/var/log/mysql/slow.log';
  ```

### 9. Security Validation

#### 9.1 Security Checklist
- [ ] **No hardcoded secrets in source code**
- [ ] **All .env files excluded from version control** (check .gitignore)
- [ ] **Database user has minimum required permissions**
- [ ] **JWT secret is cryptographically secure** (32+ characters)
- [ ] **File upload directory is not executable**
- [ ] **Error messages don't leak sensitive information**

#### 9.2 Network Security
- [ ] **Firewall configured** to allow only necessary ports (80, 443, 22)
- [ ] **Database port 3306** not exposed to external networks
- [ ] **Application port 5000** only accessible internally (behind reverse proxy)

### 10. Final Verification

#### 10.1 Smoke Tests
- [ ] **Application starts successfully**
  ```bash
  curl http://localhost:5000/health  # Should return 200 OK
  ```

- [ ] **Database connection working**
  ```bash
  # Check PM2 logs for database connection success
  pm2 logs --lines 50
  ```

- [ ] **Admin login functional**
  ```bash
  # Test admin authentication endpoint
  curl -X POST http://localhost:5000/admin/login \
    -H "Content-Type: application/json" \
    -d '{"user_name":"super_admin","password":"admin@123"}'
  ```

- [ ] **File upload working**
  ```bash
  # Test file upload endpoint (requires authentication)
  ```

#### 10.2 Performance Verification  
- [ ] **Memory usage acceptable** (`pm2 monit`)
- [ ] **Response times under 500ms** for basic endpoints
- [ ] **No memory leaks** during extended operation

## Post-Installation Tasks

### Immediate (Day 1)
- [ ] **Change default admin password** from "admin@123"
- [ ] **Test all critical API endpoints**
- [ ] **Verify payment gateway integration**
- [ ] **Set up basic monitoring alerts**

### Week 1
- [ ] **Implement proper logging**
- [ ] **Set up automated backups**
- [ ] **Create API documentation** 
- [ ] **Establish backup and recovery procedures**

### Month 1  
- [ ] **Implement comprehensive testing**
- [ ] **Performance optimization**
- [ ] **Security audit**
- [ ] **Documentation updates**

## Troubleshooting Guide

### Common Issues

#### 1. Database Connection Failed
```bash
# Check MySQL service
sudo systemctl status mysql

# Test connection manually
mysql -u travel_log -p -h localhost travel_log

# Check firewall
sudo ufw status
```

#### 2. PM2 Process Not Starting
```bash
# Check PM2 logs  
pm2 logs

# Restart specific process
pm2 restart 0

# Delete and recreate
pm2 delete all
pm2 start ecosystem.config.ts
```

#### 3. File Upload Issues
```bash
# Check directory permissions
ls -la public/
ls -la excels/
ls -la pdfs/

# Fix permissions if needed
chmod 755 public excels pdfs
```

#### 4. High Memory Usage
```bash
# Monitor memory usage
pm2 monit

# Check for memory leaks
ps aux | grep node
free -h
```

### Emergency Contacts
- **Development Team**: [Contact information needed]
- **Infrastructure Team**: [Contact information needed]  
- **Payment Gateway Support**: Razorpay support portal
- **Hosting Provider**: [Contact information needed]

---

**Checklist Version**: 1.0  
**Last Updated**: 2025-08-29  
**Created By**: Technical Analysis System  
**Review Required**: Every major deployment
