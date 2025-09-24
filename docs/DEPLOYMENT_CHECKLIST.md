# 🚀 OTA24Hours Server Deployment Checklist

## Pre-Deployment Requirements

### ✅ Server Specifications
- [ ] VPS/Dedicated server with Ubuntu 20.04+ or CentOS 8+
- [ ] Minimum 4GB RAM (8GB recommended for production)
- [ ] Minimum 50GB SSD storage
- [ ] 2+ CPU cores
- [ ] Root or sudo access

### ✅ Domain Setup
- [ ] Purchase domain: `ota24hours.com`
- [ ] Configure DNS records:
  - [ ] A record: `@` → Server IP
  - [ ] A record: `admin` → Server IP  
  - [ ] A record: `api` → Server IP
  - [ ] CNAME record: `www` → `ota24hours.com`

### ✅ Required Information
- [ ] Server IP address: `_______________`
- [ ] MySQL root password: `_______________`
- [ ] Email for SSL certificates: `_______________`
- [ ] Secure JWT secret (32+ characters): `_______________`
- [ ] Database password: `_______________`

---

## 📋 Step 1: Server Initial Setup

### 1.1 Connect to Server
```bash
ssh root@YOUR_SERVER_IP
# or
ssh user@YOUR_SERVER_IP
```

### 1.2 Run Server Setup Script
```bash
# Upload server-setup.sh to your server, then:
chmod +x server-setup.sh
./server-setup.sh
```

**Manual verification:**
- [ ] Node.js installed and working: `node --version`
- [ ] MySQL installed: `sudo systemctl status mysql`
- [ ] Nginx installed: `sudo systemctl status nginx`
- [ ] PM2 installed: `pm2 --version`

---

## 📋 Step 2: Database Configuration

### 2.1 Secure MySQL Installation
```bash
sudo mysql_secure_installation
```
- [ ] Set root password
- [ ] Remove anonymous users: Yes
- [ ] Disallow root login remotely: Yes  
- [ ] Remove test database: Yes
- [ ] Reload privilege tables: Yes

### 2.2 Create Database and User
```bash
# Edit the setup script first:
nano /tmp/mysql_setup.sql
# Change CHANGE_THIS_PASSWORD to your secure password

# Run the setup:
sudo mysql < /tmp/mysql_setup.sql
```

**Verification:**
```bash
mysql -u ota_user -p travel_log
# Should connect successfully
```

- [ ] Database `travel_log` created
- [ ] User `ota_user` created with proper permissions

---

## 📋 Step 3: Upload Application Files

### 3.1 Choose Upload Method

**Option A: Direct Upload (SCP/SFTP)**
```bash
# From your local machine:
scp -r E:\OTA24Hours\travel-backend-main user@server:/var/www/ota24hours/backend
scp -r E:\OTA24Hours\tours-kerala-main user@server:/var/www/ota24hours/frontend  
scp -r E:\OTA24Hours\tours-kerala-admin-main user@server:/var/www/ota24hours/admin
```

**Option B: Git Repository**
```bash
# On server:
cd /var/www/ota24hours
git clone YOUR_BACKEND_REPO backend
git clone YOUR_FRONTEND_REPO frontend
git clone YOUR_ADMIN_REPO admin
```

**Option C: FTP/SFTP Client**
- Use FileZilla, WinSCP, or similar
- Upload to respective directories

**Verification:**
- [ ] Backend files in `/var/www/ota24hours/backend`
- [ ] Frontend files in `/var/www/ota24hours/frontend`
- [ ] Admin files in `/var/www/ota24hours/admin`

---

## 📋 Step 4: Configure Applications

### 4.1 Backend Configuration
```bash
cd /var/www/ota24hours/backend

# Install dependencies
npm install --production

# Create production environment file
cp .env .env.production
nano .env.production
```

**Update .env.production with:**
- [ ] `DB_PASSWORD=your_database_password`
- [ ] `JWT_SECRET=your_32_character_jwt_secret`
- [ ] `FRONTEND_URL=https://ota24hours.com`
- [ ] `ADMIN_URL=https://admin.ota24hours.com`

### 4.2 Frontend Configuration
```bash
cd /var/www/ota24hours/frontend

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
  // ... other settings
};
```

### 4.3 Admin Configuration
```bash
cd /var/www/ota24hours/admin

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
  // ... other settings
};
```

---

## 📋 Step 5: Build Applications

### 5.1 Build Frontend Applications
```bash
# Build user frontend
cd /var/www/ota24hours/frontend
npm run build

# Build admin frontend
cd /var/www/ota24hours/admin
npm run build
```

**Verification:**
- [ ] Frontend build created in `frontend/dist/`
- [ ] Admin build created in `admin/dist/`

### 5.2 Setup Backend PM2
```bash
cd /var/www/ota24hours/backend

# Copy ecosystem config
cp /path/to/ecosystem.config.js .

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
```

**Verification:**
- [ ] PM2 process running: `pm2 status`
- [ ] Backend accessible locally: `curl http://localhost:5000/health`

---

## 📋 Step 6: SSL Certificate Setup

### 6.1 Generate SSL Certificates
```bash
# Upload and run SSL setup script
chmod +x ssl-setup.sh
sudo ./ssl-setup.sh
```

**Manual SSL setup if script fails:**
```bash
sudo certbot --nginx -d ota24hours.com -d www.ota24hours.com
sudo certbot --nginx -d admin.ota24hours.com  
sudo certbot --nginx -d api.ota24hours.com
```

**Verification:**
- [ ] SSL certificates generated for all domains
- [ ] Auto-renewal configured

---

## 📋 Step 7: Nginx Configuration

### 7.1 Create Nginx Virtual Hosts
```bash
# Create configuration files (copy from deployment guide)
sudo nano /etc/nginx/sites-available/ota24hours.com
sudo nano /etc/nginx/sites-available/admin.ota24hours.com
sudo nano /etc/nginx/sites-available/api.ota24hours.com

# Enable sites
sudo ln -s /etc/nginx/sites-available/ota24hours.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin.ota24hours.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.ota24hours.com /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

**Verification:**
- [ ] Nginx config test passes: `sudo nginx -t`
- [ ] All sites enabled in `/etc/nginx/sites-enabled/`

---

## 📋 Step 8: Security Configuration

### 8.1 Configure Firewall
```bash
sudo ufw enable
sudo ufw status
```

### 8.2 Setup Log Rotation
```bash
sudo nano /etc/logrotate.d/ota24hours
# Add logrotate configuration from guide
```

**Verification:**
- [ ] Firewall enabled and configured
- [ ] Log rotation configured

---

## 📋 Step 9: Final Testing

### 9.1 Health Check
```bash
cd /var/www/ota24hours
./healthcheck.sh
```

### 9.2 Manual Verification
- [ ] Main site accessible: `https://ota24hours.com`
- [ ] Admin panel accessible: `https://admin.ota24hours.com`
- [ ] API responding: `https://api.ota24hours.com/health`
- [ ] SSL certificates valid (no browser warnings)
- [ ] Admin login working with: `super_admin` / `admin@123`

### 9.3 Performance Test
```bash
# Test API response
curl -I https://api.ota24hours.com/health

# Test frontend loading
curl -I https://ota24hours.com

# Check PM2 status
pm2 monit
```

---

## 📋 Step 10: Backup & Monitoring Setup

### 10.1 Configure Database Backups
```bash
# Edit backup script
nano /var/backups/ota24hours/backup.sh
# Update password

# Add to crontab
sudo crontab -e
# Add: 0 2 * * * /var/backups/ota24hours/backup.sh
```

### 10.2 Setup Monitoring
```bash
# Create monitoring cron job
crontab -e
# Add: */5 * * * * /var/www/ota24hours/healthcheck.sh >> /var/log/ota24hours/health.log
```

**Verification:**
- [ ] Backup script configured and tested
- [ ] Health monitoring scheduled

---

## 🎯 Post-Deployment Checklist

### ✅ Functionality Tests
- [ ] User registration works
- [ ] User login works  
- [ ] Admin login works (`super_admin` / `admin@123`)
- [ ] Property creation works (admin)
- [ ] Booking flow works (frontend)
- [ ] File uploads work
- [ ] Email notifications work (if configured)

### ✅ Performance Tests
- [ ] Site loads in < 3 seconds
- [ ] API responses in < 500ms
- [ ] No memory leaks in PM2 monitoring
- [ ] Database queries optimized

### ✅ Security Tests  
- [ ] HTTPS enforced on all domains
- [ ] Admin panel restricted access
- [ ] API rate limiting active
- [ ] Database access restricted to localhost
- [ ] File upload restrictions in place

---

## 🚨 Troubleshooting Common Issues

### Issue: "502 Bad Gateway"
```bash
# Check PM2 process
pm2 status
pm2 logs ota-backend

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Issue: Database Connection Failed
```bash
# Test database connection
mysql -u ota_user -p travel_log

# Check MySQL status
sudo systemctl status mysql
```

### Issue: SSL Certificate Problems
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew --dry-run
```

### Issue: Frontend Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

---

## 📞 Support Commands Reference

```bash
# Service status
sudo systemctl status nginx mysql
pm2 status

# View logs  
pm2 logs ota-backend
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/mysql/error.log

# Restart services
pm2 restart ota-backend
sudo systemctl restart nginx mysql

# Health check
/var/www/ota24hours/healthcheck.sh

# Deployment
/var/www/ota24hours/deploy.sh all
```

---

## ✅ Final Verification

**All systems should be:**
- [ ] ✅ Backend API running on PM2
- [ ] ✅ Frontend built and served by Nginx
- [ ] ✅ Admin panel built and served by Nginx  
- [ ] ✅ SSL certificates active and valid
- [ ] ✅ Database connected and populated
- [ ] ✅ All domains resolving correctly
- [ ] ✅ Security measures in place
- [ ] ✅ Monitoring and backups configured

**🎉 Congratulations! Your OTA24Hours platform is now live!**

**Access URLs:**
- User Platform: https://ota24hours.com
- Admin Panel: https://admin.ota24hours.com  
- API Endpoint: https://api.ota24hours.com

---

**📧 Need Help?**
If you encounter any issues during deployment, check the troubleshooting section above or review the detailed deployment guide in `SERVER_DEPLOYMENT_GUIDE.md`.