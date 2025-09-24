# OTA24Hours Platform - Complete Deployment Guide
## Running Backend API and Admin Frontend Together

---

## Overview

This guide provides step-by-step instructions for deploying and running the OTA24Hours travel platform, which consists of:

1. **Travel Backend** (`travel-backend-main`) - Node.js/TypeScript REST API
2. **Tours Kerala Admin** (`tours-kerala-admin-main`) - Angular 19 admin dashboard

These applications work together to provide a complete travel booking management system.

---

## Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Disk Space**: Minimum 5GB free space
- **CPU**: Dual-core 2GHz minimum, Quad-core 3GHz+ recommended

### Required Software

#### 1. Node.js and npm
```bash
# Install Node.js v18+ or v20+ LTS
# Download from: https://nodejs.org/
# Verify installation:
node -v  # Should show v18+ or v20+
npm -v   # Should show v9+
```

#### 2. MySQL Database
```bash
# Install MySQL 8.0+ 
# Download from: https://dev.mysql.com/downloads/mysql/
# Or using package managers:

# Windows (using Chocolatey)
choco install mysql

# macOS (using Homebrew)
brew install mysql

# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
```

#### 3. Angular CLI
```bash
# Install Angular CLI globally
npm install -g @angular/cli@19

# Verify installation
ng version
```

#### 4. PM2 (Production Process Manager)
```bash
# Install PM2 globally for production deployment
npm install -g pm2
```

---

## Database Setup

### 1. Start MySQL Service
```bash
# Windows
net start mysql

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Create Database and User
```sql
# Connect to MySQL as root
mysql -u root -p

# Create database
CREATE DATABASE travel_log CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create dedicated user with secure password
CREATE USER 'travel_log'@'localhost' IDENTIFIED BY 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON travel_log.* TO 'travel_log'@'localhost';
FLUSH PRIVILEGES;

# Test the connection
mysql -u travel_log -p travel_log
```

### 3. Verify Database Connection
```bash
# Test connection with the new credentials
mysql -u travel_log -p travel_log -e "SELECT DATABASE();"
```

---

## Backend API Setup (travel-backend-main)

### 1. Navigate to Backend Directory
```bash
cd e:\OTA24Hours\travel-backend-main
```

### 2. Install Dependencies
```bash
# Install all required packages
npm install

# Fix any security vulnerabilities
npm audit fix

# Verify installation
npm list --depth=0
```

### 3. Environment Configuration

Create `.env` file in the backend root directory:

```bash
# Create .env file
# Copy the content below into .env file
```

**.env file content:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development
TZ=Asia/Kolkata

# Database Configuration (REPLACE WITH YOUR CREDENTIALS)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=travel_log
DB_PASSWORD=YourSecurePassword123!
DB_DATABASE=travel_log

# Security (GENERATE NEW SECRET - MINIMUM 32 CHARACTERS)
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters_long_123456789
JWT_EXPIRES_IN=24h

# File Storage
IMAGE_BASE_URL=http://localhost:5000/img
BASE_URL=http://localhost:5000
UPLOAD_PATH=./public

# Payment Gateway (REPLACE WITH YOUR RAZORPAY CREDENTIALS)
RAZOR_KEY_ID=your_razorpay_key_id
RAZOR_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Optional Configuration
PAGINATION_LIMIT=20
DEBUG=true
LOG_LEVEL=info
```

### 4. Update Source Code for Environment Variables

**CRITICAL SECURITY FIX**: Replace hardcoded credentials with environment variables.

Update `src/data_source/data_source.ts`:
```typescript
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME || "travel_log",
  password: process.env.DB_PASSWORD || "your_password",
  database: process.env.DB_DATABASE || "travel_log",
  synchronize: process.env.NODE_ENV === "development", // Only in development
  logging: process.env.NODE_ENV === "development",
  entities: [/* existing entities */]
});
```

Update `utils/jwt_utls.ts`:
```typescript
const tokenKey = process.env.JWT_SECRET || "fallback_secret_for_development_only";
```

### 5. Build and Start Backend

#### Development Mode
```bash
# Start in development mode with auto-reload
npm run dev

# The API will be available at: http://localhost:5000
```

#### Production Mode
```bash
# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.ts
pm2 save
pm2 startup

# Monitor the application
pm2 logs
pm2 status
```

### 6. Initialize Default Admin (First Time Only)
```bash
# After the backend is running, create default admin user
curl http://localhost:5000/init

# This creates admin user with:
# Username: admin
# Password: admin@123
```

### 7. Verify Backend is Running
```bash
# Test API endpoint
curl http://localhost:5000/

# Check API health (should return JSON response)
curl http://localhost:5000/admin/
```

---

## Frontend Admin Setup (tours-kerala-admin-main)

### 1. Navigate to Admin Directory
```bash
cd e:\OTA24Hours\tours-kerala-admin-main
```

### 2. Install Dependencies
```bash
# Install all required packages
npm install

# Fix security vulnerabilities
npm audit fix

# Verify Angular CLI version
ng version
```

### 3. Environment Configuration

Update `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  demo: 'saas',
  baseUrl: 'http://localhost:5000', // Point to local backend
  // Uncomment and add your Google Maps API key if needed
  // GOOGLE_MAPS_API_KEY: 'your-google-maps-api-key-here'
};
```

For production, update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  demo: 'saas',
  baseUrl: 'https://your-production-domain.com', // Your production API URL
  // GOOGLE_MAPS_API_KEY: 'your-production-google-maps-api-key'
};
```

### 4. Start Frontend Development Server
```bash
# Start Angular development server
ng serve

# The admin dashboard will be available at: http://localhost:4200
```

### 5. Build for Production
```bash
# Build for production
ng build --configuration production

# The built files will be in dist/ directory
# Deploy these files to your web server (Nginx, Apache, etc.)
```

---

## Running Both Applications Together

### 1. Development Environment

**Terminal 1 - Backend API:**
```bash
cd e:\OTA24Hours\travel-backend-main
npm run dev
# Backend running on http://localhost:5000
```

**Terminal 2 - Admin Frontend:**
```bash
cd e:\OTA24Hours\tours-kerala-admin-main
ng serve
# Frontend running on http://localhost:4200
```

### 2. Access the Applications

1. **Admin Dashboard**: http://localhost:4200
   - Login with: admin / admin@123
   - Manage users, bookings, properties, etc.

2. **API Endpoints**: http://localhost:5000
   - REST API for all backend operations
   - Available endpoints include:
     - `GET /admin/booking/list/{page}` - List bookings
     - `POST /admin/login` - Admin authentication
     - `GET /admin/category/list/{page}` - Category management
     - And many more...

### 3. Testing the Integration

1. **Login to Admin Dashboard**:
   - Go to http://localhost:4200
   - Enter credentials: admin / admin@123
   - Verify successful login

2. **Test API Communication**:
   - Navigate through admin dashboard
   - Check browser developer tools for API calls
   - Verify data is loading from http://localhost:5000

---

## Production Deployment

### 1. Backend Production Setup

#### Server Configuration (Ubuntu/CentOS)
```bash
# Install required software
sudo apt update
sudo apt install nginx mysql-server nodejs npm

# Install PM2 globally
sudo npm install -g pm2

# Create application user
sudo useradd -m -s /bin/bash ota24hours
sudo usermod -aG www-data ota24hours
```

#### Deploy Backend
```bash
# Copy application files to server
scp -r travel-backend-main/ user@your-server:/home/ota24hours/

# SSH to server and setup
ssh user@your-server
cd /home/ota24hours/travel-backend-main

# Install dependencies
npm install --production

# Create production .env file with production credentials
nano .env

# Build and start
npm run build
pm2 start ecosystem.config.ts
pm2 save
pm2 startup
```

#### Nginx Configuration for API
```nginx
# /etc/nginx/sites-available/ota24hours-api
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Frontend Production Setup

#### Build and Deploy
```bash
# Build for production
ng build --configuration production

# Copy dist files to web server
scp -r dist/* user@your-server:/var/www/html/admin/
```

#### Nginx Configuration for Frontend
```nginx
# /etc/nginx/sites-available/ota24hours-admin
server {
    listen 80;
    server_name admin.yourdomain.com;
    root /var/www/html/admin;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Enable Sites and Restart Nginx
```bash
sudo ln -s /etc/nginx/sites-available/ota24hours-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ota24hours-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Troubleshooting

### Common Backend Issues

#### 1. Database Connection Error
```bash
# Check MySQL service
sudo systemctl status mysql

# Verify credentials
mysql -u travel_log -p travel_log

# Check firewall (if applicable)
sudo ufw status
```

#### 2. Port Already in Use
```bash
# Find process using port 5000
netstat -tulpn | grep :5000
# or
lsof -i :5000

# Kill the process
kill -9 <process_id>
```

#### 3. Permission Errors
```bash
# Fix file permissions
chmod -R 755 travel-backend-main/
chown -R $USER:$USER travel-backend-main/
```

### Common Frontend Issues

#### 1. Angular CLI Not Found
```bash
# Install Angular CLI globally
npm install -g @angular/cli@19

# Verify installation
ng version
```

#### 2. Port 4200 Already in Use
```bash
# Start on different port
ng serve --port 4201

# Or kill existing process
lsof -ti:4200 | xargs kill -9
```

#### 3. API Connection Issues
- Verify backend is running on http://localhost:5000
- Check environment.ts has correct baseUrl
- Check browser console for CORS errors
- Verify firewall settings

### Production Issues

#### 1. SSL Certificate Setup
```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com
```

#### 2. PM2 Process Issues
```bash
# Check PM2 status
pm2 status

# Restart application
pm2 restart all

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

---

## Security Checklist

### Backend Security
- [ ] Environment variables configured (no hardcoded secrets)
- [ ] Database user has minimal required permissions
- [ ] JWT secret is minimum 32 characters long
- [ ] TypeORM synchronize disabled in production
- [ ] npm audit vulnerabilities fixed
- [ ] HTTPS enabled in production
- [ ] Firewall configured (only necessary ports open)

### Frontend Security
- [ ] Production build used (no development mode)
- [ ] HTTPS enabled
- [ ] Security headers configured in Nginx
- [ ] Content Security Policy (CSP) implemented
- [ ] No sensitive data in localStorage

### Database Security
- [ ] Strong passwords used
- [ ] Database user permissions limited
- [ ] Regular backups configured
- [ ] Database accessible only from application server

---

## Monitoring and Maintenance

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# Check application logs
pm2 logs travel-backend

# System resource monitoring
htop
df -h
free -m
```

### Database Maintenance
```sql
-- Regular database maintenance
OPTIMIZE TABLE booking;
OPTIMIZE TABLE property;
OPTIMIZE TABLE user;

-- Check database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'travel_log';
```

### Backup Strategy
```bash
# Database backup
mysqldump -u travel_log -p travel_log > backup_$(date +%Y%m%d_%H%M%S).sql

# Application backup
tar -czf backup_app_$(date +%Y%m%d_%H%M%S).tar.gz travel-backend-main/

# Automated backup script (add to crontab)
# 0 2 * * * /path/to/backup-script.sh
```

---

## Performance Optimization

### Backend Optimization
- Enable gzip compression in Nginx
- Implement Redis caching for frequent queries
- Optimize database queries and add indexes
- Use connection pooling for database
- Implement rate limiting

### Frontend Optimization
- Enable browser caching
- Implement lazy loading for images
- Use OnPush change detection strategy
- Optimize bundle size with tree shaking
- Implement service worker for caching

---

## Support and Documentation

### Key URLs
- **Admin Dashboard**: http://localhost:4200 (development)
- **API Documentation**: http://localhost:5000 (development)
- **Database**: localhost:3306/travel_log

### Default Credentials
- **Admin User**: admin / admin@123 (change immediately)
- **Database**: travel_log / YourSecurePassword123!

### Useful Commands
```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
pm2 status          # Check PM2 processes
pm2 logs            # View application logs

# Frontend  
ng serve            # Start development server
ng build --prod     # Build for production
ng test             # Run tests
ng lint             # Run linting

# Database
mysql -u travel_log -p travel_log     # Connect to database
mysqldump -u travel_log -p travel_log # Backup database
```

---

## Next Steps

1. **Test the complete setup** by following all steps in this guide
2. **Customize the environment** configuration for your specific needs
3. **Set up monitoring** and alerting for production environment
4. **Implement backup strategies** for both database and application files
5. **Configure SSL certificates** for production deployment
6. **Review and update security settings** regularly

---

*This deployment guide was created on September 23, 2025. Please verify all steps in your specific environment and update configurations as needed.*