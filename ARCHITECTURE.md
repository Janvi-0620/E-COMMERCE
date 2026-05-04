# E-Commerce Platform - System Architecture

## Overview
This is a production-grade, full-stack e-commerce platform with clean architecture principles, modular design, and enterprise-level best practices.

---

## Architecture Pattern: **Module-Based Clean Architecture**

### Why This Approach?

1. **Separation of Concerns**: Each feature (auth, product, order, etc.) is self-contained
2. **Scalability**: Add new features without affecting existing code (Open/Closed Principle)
3. **Testability**: Each module can be tested independently
4. **Maintainability**: Clear folder structure makes onboarding easier
5. **Reusability**: Shared utilities and services reduce code duplication

---

## Backend Architecture (Node.js + Express + MongoDB)

### Folder Structure Philosophy

```
server/
├── src/
│   ├── config/          → App-level configurations (DB, ENV, constants)
│   ├── modules/         → Feature-based modules (self-contained)
│   ├── middleware/      → Cross-cutting concerns (auth, error, rate-limit)
│   ├── services/        → Shared services (email, payment, cloudinary)
│   ├── utils/           → Helper functions (validators, formatters)
│   ├── jobs/            → Background jobs (async email, notifications)
│   ├── app.js           → Express app setup
│   └── server.js        → Entry point
```

### Module Structure Pattern

Each feature module follows this pattern:
```
modules/auth/
├── auth.controller.js    → HTTP request handlers
├── auth.service.js       → Business logic
├── auth.routes.js        → API endpoints
├── auth.model.js         → MongoDB schema
├── auth.validation.js    → Input validation
└── auth.middleware.js    → Module-specific middleware
```

**Why?** This ensures:
- **Cohesion**: Related code is grouped together
- **Low Coupling**: Modules depend on interfaces, not implementation
- **Easy Testing**: Mock dependencies easily
- **Feature Ownership**: One developer can own one module

### Request Flow (Example: Login)

```
HTTP POST /api/v1/auth/login
    ↓
Router (auth.routes.js)
    ↓
Controller (auth.controller.js) → Validate input
    ↓
Service (auth.service.js) → Business logic
    ↓
Model (auth.model.js) → Database query
    ↓
Return Response
    ↓
Error Middleware (if any error)
```

---

## Design Decisions & Best Practices

### 1. **Authentication & Security**
- **JWT Tokens**: Stateless, scalable, standard in microservices
- **Bcrypt Hashing**: Industry-standard password hashing (OWASP recommended)
- **Role-Based Access Control (RBAC)**: User, Admin roles with middleware protection
- **HTTP-Only Cookies**: Store JWT in httpOnly cookies (XSS protection)

### 2. **Data Validation**
- **Joi/express-validator**: Schema-based validation on controller layer
- **Mongoose Schemas**: Additional validation on model layer (defense in depth)
- **Fail Fast**: Validate input immediately, reject invalid requests

### 3. **Error Handling**
- **Centralized Error Handler**: Single middleware catches all errors
- **Structured Error Responses**: Consistent JSON format
- **HTTP Status Codes**: Proper codes (400, 401, 403, 404, 500)
- **Logging**: All errors logged for debugging

### 4. **Database**
- **MongoDB + Mongoose**: Flexible schema, good for fast iteration
- **Indexes**: Added on frequently queried fields (email, productId)
- **Lean Queries**: Use `.lean()` for read-only queries (performance)
- **Virtuals & Hooks**: Use Mongoose hooks for computed fields

### 5. **Caching Strategy**
- **Redis**: In-memory cache for frequently accessed data
  - Product list (1 hour TTL)
  - User profile (30 minutes TTL)
  - Search results (10 minutes TTL)
- **Cache Invalidation**: Clear cache on create/update/delete operations

### 6. **Rate Limiting & Security**
- **express-rate-limit**: Prevent brute-force attacks (5 attempts/15 min for login)
- **helmet**: Set security HTTP headers
- **CORS**: Restrict to known frontend origin
- **Input Sanitization**: Use sanitize-html to prevent injection attacks

### 7. **API Design**
- **RESTful Conventions**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **Versioning**: `/api/v1/` prefix for future backward compatibility
- **Pagination**: `/api/v1/products?page=1&limit=20`
- **Filtering & Sorting**: `/api/v1/products?category=electronics&sort=-price`
- **Consistent Response Format**:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Success message"
  }
  ```

### 8. **Environment Management**
- **.env File**: Never commit to git, use .env.example as template
- **Environment Validation**: Check required env vars at startup
- **Different Configs**: Dev, staging, production environments

---

## Frontend Architecture (React + Redux Toolkit)

### State Management Approach

**Why Redux Toolkit?**
- Centralized state for auth and cart (critical features)
- Easier to debug (Redux DevTools)
- Persist cart to localStorage
- Handle async API calls with thunks

### Feature-Based Redux Slices

```
features/
├── auth/
│   ├── authSlice.js      → State + reducers
│   └── authAPI.js        → Async thunks for API calls
├── cart/
│   ├── cartSlice.js      → State + reducers
│   └── cartUtils.js      → Utility functions
└── product/
    ├── productSlice.js   → State + reducers
    └── productAPI.js     → Async thunks
```

### Component Organization

```
components/          → Reusable UI components (Header, Button, etc.)
pages/              → Route-level page components
services/           → Axios API client setup
hooks/              → Custom React hooks (useCart, useAuth, etc.)
utils/              → Helpers (formatters, validators)
```

---

## API Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user (protected)
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Products
- `GET /api/v1/products` - List products (with pagination, filter, sort)
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product (admin only)
- `PUT /api/v1/products/:id` - Update product (admin only)
- `DELETE /api/v1/products/:id` - Delete product (admin only)

### Orders
- `POST /api/v1/orders` - Create order from cart (protected)
- `GET /api/v1/orders` - Get user orders (protected)
- `GET /api/v1/orders/:id` - Get order details (protected)
- `GET /api/v1/admin/orders` - Get all orders (admin only)
- `PUT /api/v1/admin/orders/:id/status` - Update order status (admin only)

### Payments
- `POST /api/v1/payments/razorpay/order` - Create Razorpay order
- `POST /api/v1/payments/razorpay/verify` - Verify payment
- `POST /api/v1/payments/webhook` - Payment webhook (Razorpay)

### Admin
- `GET /api/v1/admin/users` - Get all users
- `PUT /api/v1/admin/users/:id/role` - Update user role
- `GET /api/v1/admin/dashboard` - Dashboard stats

---

## Database Schema Overview

### User
```
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: Enum['user', 'admin'],
  avatar: String (Cloudinary URL),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```
{
  name: String,
  description: String,
  price: Number,
  discountPrice: Number (optional),
  category: String,
  image: String (Cloudinary URL),
  images: [String],
  stock: Number,
  rating: Number,
  reviews: [{
    userId: ObjectId,
    rating: Number,
    comment: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: Enum['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  paymentStatus: Enum['pending', 'completed', 'failed'],
  shippingAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Deployment Strategy

### Backend (Node.js + MongoDB)
1. Use **Docker** for containerization
2. Deploy to **AWS EC2** or **Railway** or **Heroku**
3. Use **MongoDB Atlas** for cloud database
4. Use **Redis** on cloud or locally for caching
5. Use **PM2** for process management in production

### Frontend (React)
1. Build: `npm run build` → static files
2. Deploy to **Vercel**, **Netlify**, or **AWS S3 + CloudFront**
3. Environment-specific API URLs

### Monitoring & Logging
- Use **Winston** or **Bunyan** for structured logging
- Use **Sentry** for error tracking
- Use **New Relic** or **DataDog** for APM

---

## Security Checklist

- [x] Use HTTPS/TLS in production
- [x] Implement CORS properly
- [x] Use bcrypt for password hashing
- [x] Implement rate limiting
- [x] Use environment variables for secrets
- [x] Validate and sanitize all user input
- [x] Use httpOnly cookies for JWT
- [x] Implement CSRF protection if using sessions
- [x] Add security headers (helmet.js)
- [x] Implement SQL injection protection (Mongoose handles this)
- [x] Log security events
- [x] Regular dependency updates

---

## Performance Optimizations

1. **Database**: Indexing, query optimization, pagination
2. **Caching**: Redis for frequently accessed data
3. **API Response**: Lean queries, selective field selection
4. **Frontend**: Code splitting, lazy loading, image optimization
5. **CDN**: Cloudinary for image delivery
6. **Compression**: gzip compression for responses
7. **Connection Pooling**: MongoDB connection pool management

---

## Next Steps

1. ✅ Create folder structure and .env
2. ✅ Create architecture documentation
3. → Set up Express + MongoDB connection
4. → Create base models and schemas
5. → Build Authentication module
6. → Build Product module
7. → Build Cart & Order modules
8. → Build Payment integration
9. → Setup Frontend with React + Redux
10. → Create Admin Dashboard

---

## Real-World Best Practices Applied

1. **DRY (Don't Repeat Yourself)**: Shared utils and middleware
2. **SOLID Principles**: Single responsibility per module
3. **Error Handling**: Centralized, structured error responses
4. **Logging**: All important operations logged
5. **Testing**: Setup for unit and integration tests
6. **Documentation**: Clear folder structure and comments
7. **Scalability**: Modular design, can scale to microservices
8. **Security**: Industry best practices implemented
9. **Performance**: Caching, indexing, pagination
10. **Maintainability**: Clear code, consistent patterns
