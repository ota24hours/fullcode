# Travel Backend - Architecture Diagram

## System Architecture Overview

```
                                    TRAVEL BOOKING PLATFORM BACKEND
                                              (Node.js + TypeScript)

    ┌─────────────────────────────────────────────────────────────────────────────────────────┐
    │                                    CLIENT LAYER                                         │
    ├─────────────────────┬─────────────────────┬─────────────────────┬─────────────────────┤
    │   Web Applications  │   Mobile Apps       │   Admin Dashboard   │   Partner APIs      │
    │   (React/Angular)   │   (iOS/Android)     │   (Admin Panel)     │   (Third Party)     │
    └─────────────────────┴─────────────────────┴─────────────────────┴─────────────────────┘
                                              │
                                              ▼ HTTP/HTTPS (Port 80/443)
    ┌─────────────────────────────────────────────────────────────────────────────────────────┐
    │                                  LOAD BALANCER/PROXY                                    │
    │                               Nginx (Recommended)                                      │
    │                          • SSL Termination                                             │
    │                          • Static File Serving                                         │
    │                          • Rate Limiting                                               │
    └─────────────────────────────────────────────────────────────────────────────────────────┘
                                              │
                                              ▼ HTTP (Port 5000)
    ┌─────────────────────────────────────────────────────────────────────────────────────────┐
    │                                  APPLICATION SERVER                                     │
    │                                Node.js + Express.js                                    │
    │                                                                                         │
    │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
    │  │   MIDDLEWARE    │  │    ROUTES       │  │  CONTROLLERS    │  │   UTILITIES     │   │
    │  │                 │  │                 │  │                 │  │                 │   │
    │  │ • CORS          │  │ • /user/*       │  │ • User Mgmt     │  │ • JWT Utils     │   │
    │  │ • Auth Validation│  │ • /admin/*      │  │ • Property Mgmt │  │ • File Upload   │   │
    │  │ • File Upload   │  │ • /booking/*    │  │ • Booking Mgmt  │  │ • Password Hash │   │
    │  │ • Body Parser   │  │ • /category/*   │  │ • Payment Mgmt  │  │ • Validation    │   │
    │  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘   │
    │                                                                                         │
    │                              ▼ TypeORM (Database Abstraction)                          │
    └─────────────────────────────────────────────────────────────────────────────────────────┘
                                              │
                                              ▼ MySQL Connection
    ┌─────────────────────────────────────────────────────────────────────────────────────────┐
    │                                   DATA LAYER                                            │
    │                                  MySQL Database                                         │
    │                                                                                         │
    │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │
    │  │   USER DATA     │  │ PROPERTY DATA   │  │  BOOKING DATA   │  │ FINANCIAL DATA  │   │
    │  │                 │  │                 │  │                 │  │                 │   │
    │  │ • users         │  │ • properties    │  │ • bookings      │  │ • vendor_payment│   │
    │  │ • admin         │  │ • property_imgs │  │ • booking_req   │  │ • commission    │   │
    │  │ • user_docs     │  │ • variants      │  │ • booking_disp  │  │ • transactions  │   │
    │  │ • categories    │  │ • pricing       │  │ • reviews       │  │                 │   │
    │  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘   │
    └─────────────────────────────────────────────────────────────────────────────────────────┘
                                              │
                                              ▼ File System
    ┌─────────────────────────────────────────────────────────────────────────────────────────┐
    │                                  FILE STORAGE                                           │
    │                               Local File System                                         │
    │                                                                                         │
    │     /public/          /excels/            /pdfs/              /view/                    │
    │   Image Uploads    Excel Reports       PDF Documents      Static Web Files            │
    └─────────────────────────────────────────────────────────────────────────────────────────┘

                                    EXTERNAL SERVICES (API Integration)
    ┌─────────────────┐          ┌─────────────────┐          ┌─────────────────┐
    │   RAZORPAY      │          │   FIREBASE      │          │   CDN/STORAGE   │
    │                 │          │                 │          │                 │  
    │ • Payment       │◄────────►│ • Push Notify   │◄────────►│ • Image Delivery│
    │ • Webhooks      │          │ • FCM Tokens    │          │ • File Backup   │
    │ • Settlement    │          │ • Admin SDK     │          │ • Static Assets │
    └─────────────────┘          └─────────────────┘          └─────────────────┘
```

## Data Flow Diagram

```
                                  TYPICAL BOOKING FLOW

         User/Vendor                                                     Admin Panel
              │                                                              │
              ▼                                                              ▼
    ┌─────────────────┐                                           ┌─────────────────┐
    │  Authentication │                                           │ Admin Login     │
    │  POST /user     │                                           │ POST /admin     │
    └─────────────────┘                                           └─────────────────┘
              │                                                              │
              ▼                                                              ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐   ┌─────────────────┐
    │ Browse Properties│    │ Check Availability│   │ Create Booking │   │ Manage Bookings │
    │ GET /properties │    │ POST /booking/   │    │ POST /booking   │   │ GET /admin/     │
    │                 │    │ check_availability│   │ create_booking  │   │ booking/list    │
    └─────────────────┘    └─────────────────┘    └─────────────────┘   └─────────────────┘
              │                      │                       │                       │
              ▼                      ▼                       ▼                       ▼
    ┌─────────────────────────────────────────────────────────────────────────────────────────┐
    │                               DATABASE OPERATIONS                                        │
    │                                                                                         │
    │ SELECT properties    SELECT availability     INSERT booking      UPDATE booking_status  │  
    │ JOIN categories   ──▶ JOIN variants      ──▶ INSERT payment  ──▶ UPDATE vendor_payment │
    │ WHERE active=1       WHERE dates avail     INSERT commission   SELECT booking details │
    └─────────────────────────────────────────────────────────────────────────────────────────┘
              │                      │                       │                       │
              ▼                      ▼                       ▼                       ▼
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐   ┌─────────────────┐
    │ Property List   │    │ Availability    │    │ Payment Gateway │   │ Booking Status  │
    │ with Images     │    │ Response        │    │ (Razorpay)      │   │ Update          │
    └─────────────────┘    └─────────────────┘    └─────────────────┘   └─────────────────┘
```

## Entity Relationship Overview

```
                                CORE ENTITY RELATIONSHIPS

    User ──────┐                                         ┌────── Admin
               │                                         │
               ▼                                         ▼
    ┌─────────────────┐                        ┌─────────────────┐
    │      USER       │                        │      ADMIN      │ 
    │                 │                        │                 │
    │ • Profile Data  │                        │ • Credentials   │
    │ • Verification  │                        │ • Permissions   │  
    │ • Bank Details  │                        │ • Super Admin   │
    └─────────────────┘                        └─────────────────┘
               │                                         │
               ├─── Creates ────┐                       │ 
               │                ▼                       │ Manages
               │     ┌─────────────────┐                │
               │     │    PROPERTY     │◄───────────────┘
               │     │                 │
               │     │ • Multi-type    │ ┌─── Has Many ────┐
               │     │ • Variants      │ │                 ▼
               │     │ • Pricing       │ │    ┌─────────────────┐
               │     └─────────────────┘ │    │ PROPERTY_IMGS   │
               │                │        │    │ VARIANTS        │
               │ Books           │        │    │ PRICING         │  
               ▼                │        └────┤ CUSTOMIZABLE    │
    ┌─────────────────┐         │             └─────────────────┘
    │     BOOKING     │         │
    │                 │         │ Belongs To
    │ • Dates         │◄────────┘ 
    │ • Payment Info  │
    │ • Status        │         ┌─── Related To ─────┐
    │ • Calculations  │         │                    ▼
    └─────────────────┘         │         ┌─────────────────┐
               │                │         │    CATEGORY     │
               │ Can Have       │         │  SUB_CATEGORY   │
               ▼                │         │                 │
    ┌─────────────────┐         │         │ • Hierarchical  │
    │ BOOKING_DISPUTE │         │         │ • Customizable  │
    │ REVIEWS         │         │         └─────────────────┘
    │ COMMISSION      │         │                    │
    │ VENDOR_PAYMENT  │         └────────────────────┘
    └─────────────────┘              
```

## Technology Decision Rationale

### Why TypeORM + MySQL?
✅ **Advantages**:
- Rich relational data model support
- TypeScript integration  
- Active Record pattern familiarity
- MySQL performance and reliability

⚠️ **Considerations**:
- ORM overhead for complex queries
- MySQL scaling limitations vs NoSQL
- TypeORM learning curve for team

### Why Express.js Framework?
✅ **Advantages**:
- Mature ecosystem  
- Excellent middleware support
- Easy to understand and maintain
- Strong community support

⚠️ **Considerations**:
- Not opinionated (requires architectural decisions)
- Manual security configuration required
- Performance limitations vs Fastify

### Why JWT Authentication?
✅ **Advantages**:
- Stateless authentication
- Easy mobile app integration  
- No server-side session storage needed

⚠️ **Considerations**:
- Token revocation challenges
- No built-in refresh mechanism
- Security depends on secret management

## Risk Mitigation Strategy

| Risk Category | Current State | Target State | Timeline |
|---------------|---------------|--------------|----------|
| **Security** | High Risk | Low Risk | 2 weeks |
| **Stability** | Medium Risk | Low Risk | 4 weeks |  
| **Performance** | Medium Risk | Optimized | 8 weeks |
| **Scalability** | Limited | Cloud Ready | 12 weeks |
| **Maintainability** | Difficult | Well Documented | 6 weeks |

---

**Document Version**: 1.0  
**Architecture Review Date**: 2025-08-29  
**Next Review**: 2025-09-29 or after major changes
