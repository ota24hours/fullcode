# Travel Backend - Quick Reference Guide

## 🚀 Quick Start Commands

### Development
```bash
# Start development server
npm run dev

# Build application  
npm run build

# Start production
npm start
```

### Administration
```bash
# Initialize default admin (one-time)
curl http://localhost:5000/init

# Check application status
pm2 status

# View logs
pm2 logs
```

## 📚 API Endpoints Overview

### User Authentication
```
POST /user/login                    # User login
POST /user/signup                   # User registration  
POST /user/verify                   # OTP verification
```

### Property Management
```
GET  /user/properties/list/:page    # Browse properties
POST /user/properties/create        # Add property (vendors)
GET  /user/properties/view/:id      # Property details
POST /user/properties/edit          # Update property
```

### Booking System
```
POST /user/booking/check_availability    # Check dates available
POST /user/booking/create_booking        # Create new booking
GET  /user/booking/list/:page            # User's bookings
GET  /user/booking/view/:id              # Booking details
POST /user/booking/complete_booking      # Update status
```

### Admin Operations  
```
GET  /admin/user/list/:page         # User management
GET  /admin/booking/list/:page      # All bookings
POST /admin/booking/change_status   # Update booking status
GET  /admin/property/list/:page     # Property management
```

## 🔑 Environment Variables (Required)

### Critical Configuration
```env
# Database
DB_USERNAME=travel_log
DB_PASSWORD=your_secure_password
DB_DATABASE=travel_log

# Security  
JWT_SECRET=your_32plus_character_secret

# Payment
RAZOR_KEY_ID=your_razorpay_key
RAZOR_KEY_SECRET=your_razorpay_secret

# File Storage
IMAGE_BASE_URL=https://yourdomain.com/img
```

## 🗃️ Database Schema Quick Reference

### Core Tables
```sql
-- User management
users                    # Customer and vendor accounts  
admin                    # Administrative accounts
user_select_categories   # User service preferences

-- Property system  
properties              # Main property listings
property_variants        # Different configurations per property
property_imgs           # Image galleries
pricing_variants        # Dynamic pricing models

-- Booking system
bookings                # Main booking records
booking_requests        # Booking workflow
booking_disputes        # Dispute management

-- Business logic
categories              # Service categories  
sub_categories          # Service subcategories
commission_payments     # Platform earnings
vendor_payments         # Vendor payouts
reviews                # User ratings
```

## 🛠️ Common Maintenance Tasks

### Log Management
```bash
# View recent application logs
pm2 logs --lines 100

# Monitor real-time logs  
pm2 logs --follow

# Restart application
pm2 restart all
```

### Database Maintenance
```sql
-- Check table sizes
SELECT 
    table_name,
    round(((data_length + index_length) / 1024 / 1024), 2) AS 'Size in MB'
FROM information_schema.tables 
WHERE table_schema = 'travel_log';

-- Monitor active connections
SHOW PROCESSLIST;

-- Check slow queries
SHOW VARIABLES LIKE 'slow_query_log%';
```

### File System Cleanup
```bash
# Check upload directory sizes
du -sh public/ excels/ pdfs/

# Clean up old log files (if not using logrotate)
find logs/ -name "*.log" -mtime +30 -delete
```

## 🔍 Debugging & Troubleshooting

### Application Not Starting
```bash
# Check Node.js version
node -v                 # Should be v18+ or v20+

# Check port availability  
netstat -an | find ":5000"

# Check environment variables
echo $NODE_ENV
echo $PORT
```

### Database Connection Issues
```bash
# Test database connection
mysql -u travel_log -p -h localhost travel_log

# Check MySQL service
# Windows: services.msc -> MySQL80
# Linux: sudo systemctl status mysql
```

### Performance Issues
```bash
# Monitor system resources
# Windows: Task Manager
# Linux: htop or top

# Check PM2 process status
pm2 monit

# Database performance
# MySQL: SHOW ENGINE INNODB STATUS;
```

## 🔒 Security Checklist

### Pre-Production Security
- [ ] All secrets moved to environment variables
- [ ] JWT secret is cryptographically secure (32+ chars)
- [ ] Database password changed from default  
- [ ] `npm audit` shows zero vulnerabilities
- [ ] TypeORM synchronize disabled (`false`)
- [ ] File upload validation implemented

### Runtime Security  
- [ ] HTTPS configured and enforced
- [ ] Security headers added (helmet.js)
- [ ] Rate limiting configured  
- [ ] Input validation on all endpoints
- [ ] Error messages sanitized
- [ ] File permissions properly set

## 📊 Monitoring & Health Checks

### Application Health
```bash
# Basic health check (implement this endpoint)
curl http://localhost:5000/health

# PM2 process monitoring
pm2 monit

# Check application logs for errors
pm2 logs | grep -i error
```

### Database Health
```sql
-- Connection count
SHOW STATUS LIKE 'Threads_connected';

-- Query performance  
SHOW STATUS LIKE 'Slow_queries';

-- Buffer pool efficiency
SHOW STATUS LIKE 'Innodb_buffer_pool%';
```

### Performance Metrics
```bash
# Response time testing
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/

# Memory usage
pm2 show 0

# Disk usage
df -h
```

## 💡 Development Tips

### Code Structure Guidelines
```typescript
// Controller pattern
export const controllerFunction = async (req: Request, res: Response) => {
  try {
    // 1. Validate input
    // 2. Business logic  
    // 3. Database operations
    // 4. Return response
    return toJson(res, { data: result });
  } catch (error) {
    return errorResponse(res, error);
  }
};

// Entity validation
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity()  
export class User {
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  name: string;
}
```

### TypeORM Best Practices
```typescript
// Use query builder for complex queries
const result = await AppDataSource.getRepository(Entity)
  .createQueryBuilder('e')  
  .leftJoinAndSelect('e.relation', 'r')
  .where('e.field = :value', { value })
  .getMany();

// Use transactions for multi-table operations
await AppDataSource.transaction(async manager => {
  await manager.save(entity1);
  await manager.save(entity2);  
});
```

### Error Handling Best Practices
```typescript
// Standardized error responses
class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Global error handler middleware
app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});
```

## 📞 Emergency Contacts & Resources

### Application Issues
- **Primary Developer**: [Contact needed]
- **System Administrator**: [Contact needed]  
- **Database Administrator**: [Contact needed]

### External Services
- **Razorpay Support**: https://razorpay.com/support/
- **Firebase Support**: https://firebase.google.com/support/
- **MySQL Community**: https://mysql.com/support/

### Useful Resources  
- **TypeORM Documentation**: https://typeorm.io/
- **Express.js Guide**: https://expressjs.com/
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices
- **MySQL Performance**: https://dev.mysql.com/doc/refman/8.0/en/optimization.html

---

**Quick Reference Version**: 1.0  
**Last Updated**: 2025-08-29  
**Print this page and keep handy for quick troubleshooting**
