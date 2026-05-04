# Implementation Plan - E-Commerce Platform

## Overview
This document outlines the complete implementation strategy for building the production-grade e-commerce platform feature-by-feature.

---

## Phase 1: Backend Foundation ✅ COMPLETED

### Step 1: Project Setup & Configuration ✅
- [x] Create folder structure (modular architecture)
- [x] Create package.json with dependencies
- [x] Create .env with all required variables
- [x] Create .gitignore
- [x] Setup Express app (app.js)
- [x] Create server entry point (server.js)

### Step 2: Database & Configuration ✅
- [x] MongoDB connection setup (db.js)
- [x] Environment configuration (env.js)
- [x] Application constants (constants.js)
- [x] Structured logging (logger.js)

### Step 3: Middleware & Error Handling ✅
- [x] Centralized error handler (error.middleware.js)
- [x] Rate limiting (rateLimit.middleware.js)
- [x] Auth middleware skeleton (auth.middleware.js)
- [x] Role-based authorization (role.middleware.js)
- [x] Async handler wrapper
- [x] Custom API error class

### Step 4: Documentation ✅
- [x] Architecture documentation (ARCHITECTURE.md)
- [x] Setup guide (SETUP.md)
- [x] API documentation (API.md)
- [x] README.md

---

## Phase 2: Authentication Module (Next)

### Timeline: 2-3 hours
### Difficulty: Medium

### Step 1: User Model
**File**: `server/src/modules/auth/auth.model.js`

**Implement:**
```
User Schema:
- email (String, unique, required, lowercase)
- password (String, required, minlength: 8)
- firstName (String, required)
- lastName (String, required)
- role (Enum: 'user', 'admin', default: 'user')
- avatar (String, optional)
- isActive (Boolean, default: true)
- lastLogin (Date)
- createdAt, updatedAt (automatic)
```

**Requirements:**
- Add pre-save hook to hash password with bcrypt
- Add `comparePassword` method for login verification
- Add `toJSON` method to exclude password field
- Create indexes on email and role

**Real-world pattern:**
```javascript
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

---

### Step 2: Input Validation Schemas
**File**: `server/src/modules/auth/auth.validation.js`

**Implement:**
- `registerSchema`: email, password, firstName, lastName
- `loginSchema`: email, password
- `refreshTokenSchema`: token
- Password validation: min 8 chars, uppercase, lowercase, number, special char

**Example pattern:**
```javascript
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(PASSWORD_REGEX).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required()
});
```

---

### Step 3: Authentication Service
**File**: `server/src/modules/auth/auth.service.js`

**Implement:**
- `register(email, password, firstName, lastName)` - Create new user
- `login(email, password)` - Verify credentials and return JWT
- `generateToken(userId, role)` - Create JWT token
- `verifyToken(token)` - Decode and validate JWT
- `refreshToken(token)` - Create new token from old one

**Business Logic Rules:**
1. Check if user already exists before registering
2. Verify password matches criteria
3. Generate JWT with 7-day expiration
4. Include userId and role in JWT payload
5. Return user data (without password)

**Real-world pattern:**
```javascript
async register(email, password, firstName, lastName) {
  // 1. Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email already exists');
  }

  // 2. Create new user
  const user = new User({
    email: email.toLowerCase(),
    password,
    firstName,
    lastName
  });

  await user.save();

  // 3. Return user without password
  return user.toJSON();
}

async login(email, password) {
  // 1. Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // 2. Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // 3. Generate token
  const token = this.generateToken(user._id, user.role);

  // 4. Update last login
  user.lastLogin = new Date();
  await user.save();

  return { token, user: user.toJSON() };
}
```

---

### Step 4: Authentication Controller
**File**: `server/src/modules/auth/auth.controller.js`

**Implement:**
- `register(req, res)` - Handle registration request
- `login(req, res)` - Handle login request
- `logout(req, res)` - Clear session (for frontend to clear JWT)
- `getCurrentUser(req, res)` - Return authenticated user
- `refreshToken(req, res)` - Generate new JWT

**Key Points:**
- Use `asyncHandler` wrapper to catch errors
- Validate request body using Joi schema
- Return proper HTTP status codes
- Include JWT in response (client stores in localStorage)

---

### Step 5: Authentication Routes
**File**: `server/src/modules/auth/auth.routes.js`

**Implement:**
```javascript
POST   /auth/register    - Public
POST   /auth/login       - Public (with rate limiting)
POST   /auth/logout      - Protected (requires JWT)
GET    /auth/me          - Protected (requires JWT)
POST   /auth/refresh     - Public (with token validation)
```

**Integration in app.js:**
```javascript
import authRoutes from './modules/auth/auth.routes.js';
apiRouter.use('/auth', authRoutes);
```

---

### Step 6: JWT Middleware Implementation
**File**: `server/src/middleware/auth.middleware.js`

**Implement:**
```javascript
// Extract token from Authorization header
// Verify token signature
// Decode token and extract userId
// Fetch user from database
// Attach user to req.user
// Handle token expiration
```

**Usage Pattern:**
```javascript
router.get('/auth/me', authenticate, getCurrentUser);
```

---

### Testing Authentication

**Test Cases:**
1. ✓ Register with valid credentials
2. ✓ Register with existing email (409 Conflict)
3. ✓ Register with weak password
4. ✓ Login with correct credentials
5. ✓ Login with wrong password (401)
6. ✓ Get current user with valid token
7. ✓ Get current user with invalid token (401)
8. ✓ Refresh token with valid token
9. ✓ Rate limiting on login (5 attempts/15 min)

**Using curl:**
```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Secure123!","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Secure123!"}'

# Get current user
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## Phase 3: Product Module

### Timeline: 2-3 hours
### Difficulty: Medium

### Step 1: Product Model
```
Product Schema:
- name (String, required)
- description (String)
- price (Number, required)
- discountPrice (Number, optional)
- category (String, required)
- image (String, Cloudinary URL)
- images (Array of Cloudinary URLs)
- stock (Number, required, default: 0)
- rating (Number, default: 0, min: 0, max: 5)
- reviews (Array of Review objects)
- sku (String, unique, optional)
- createdAt, updatedAt
```

### Step 2: Product Service
- CRUD operations (create, read, update, delete)
- Search with keyword matching
- Filter by category, price range
- Pagination
- Sorting by price, rating, date

### Step 3: Product Routes
```
GET    /products                 - Public (list with filters)
GET    /products/:id            - Public (get details)
POST   /products                - Admin only (create)
PUT    /products/:id            - Admin only (update)
DELETE /products/:id            - Admin only (delete)
```

### Step 4: Features
- Image upload to Cloudinary
- Multiple product images
- Search & filtering
- Pagination (default: 20 items/page)
- Sorting (by price, rating, date)
- Stock management

---

## Phase 4: Order Module

### Timeline: 3 hours
### Difficulty: Medium-High

### Step 1: Order Model
```
Order Schema:
- userId (ObjectId, ref: User)
- items [{
    productId: ObjectId,
    quantity: Number,
    price: Number (at time of purchase)
  }]
- totalAmount (Number)
- status (Enum: pending, processing, shipped, delivered, cancelled)
- paymentStatus (Enum: pending, completed, failed)
- paymentMethod (String: razorpay, stripe, cod)
- shippingAddress (String)
- notes (String, optional)
- createdAt, updatedAt
```

### Step 2: Order Service
- Create order from cart items
- Get user orders (with pagination)
- Get all orders (admin)
- Update order status (admin)
- Cancel order

### Step 3: Order Routes
```
POST   /orders                  - Protected (create)
GET    /orders                  - Protected (user orders)
GET    /orders/:id              - Protected (order details)
PUT    /orders/:id/cancel       - Protected (cancel order)
GET    /admin/orders            - Admin only (all orders)
PUT    /admin/orders/:id/status - Admin only (update status)
```

---

## Phase 5: Payment Integration

### Timeline: 3-4 hours
### Difficulty: High

### Step 1: Razorpay Setup
- Create Razorpay account
- Get API keys
- Understand webhook events

### Step 2: Payment Service
- Create Razorpay order
- Verify payment signature
- Update order payment status
- Handle webhook events

### Step 3: Payment Routes
```
POST   /payments/razorpay/order      - Protected
POST   /payments/razorpay/verify     - Protected
POST   /payments/webhook             - Public (Razorpay)
```

### Step 4: Flow
1. User creates order (status: pending, paymentStatus: pending)
2. Frontend creates Razorpay order
3. User completes payment
4. Razorpay sends webhook notification
5. Server verifies payment signature
6. Update order to paid
7. Return success to frontend

---

## Phase 6: Frontend Setup

### Timeline: 2 hours
### Difficulty: Low

### Step 1: Vite + React Setup
```bash
npm create vite@latest client -- --template react
cd client && npm install
```

### Step 2: Redux Toolkit Setup
- Create Redux store
- Create auth slice
- Create cart slice
- Create product slice

### Step 3: API Client
- Setup axios instance
- Add JWT token to headers
- Handle 401 responses

### Step 4: Project Structure
```
client/src/
├── app/
│   └── store.js              # Redux store
├── features/
│   ├── auth/
│   │   ├── authSlice.js
│   │   └── authAPI.js
│   ├── cart/
│   │   ├── cartSlice.js
│   │   └── cartUtils.js
│   └── product/
│       ├── productSlice.js
│       └── productAPI.js
├── pages/
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── CartItem.jsx
│   └── ProtectedRoute.jsx
└── services/
    └── apiClient.js
```

---

## Phase 7: Frontend Features

### Authentication UI
- Login page
- Register page
- Protected routes
- User dashboard

### Product UI
- Product listing with filters
- Product details page
- Search functionality
- Pagination

### Cart UI
- Add to cart
- Remove from cart
- Update quantity
- Cart summary
- Persistent cart (localStorage)

### Checkout & Payment
- Checkout form
- Address entry
- Payment method selection
- Razorpay integration

### Admin Dashboard
- Product management
- Order management
- User management
- Dashboard analytics

---

## Phase 8: Advanced Features

### Timeline: 2-3 hours
### Difficulty: Medium

### Features to Implement
1. **Image Upload** - Cloudinary integration
2. **Caching** - Redis for products, users
3. **Email Service** - Order notifications
4. **Reviews & Ratings** - User reviews on products
5. **Wishlist** - Save favorites
6. **Coupon System** - Discount codes
7. **Analytics** - Dashboard stats
8. **Search Optimization** - Elasticsearch (optional)

---

## Database Indexing Strategy

```javascript
// User
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Product
db.products.createIndex({ category: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ name: "text", description: "text" })

// Order
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ createdAt: -1 })
```

---

## Testing Strategy

### Unit Tests (Jest)
- Service business logic
- Utility functions
- Model validations

### Integration Tests (Supertest)
- API endpoints
- Authentication flows
- Payment verification

### Example Test:
```javascript
describe('Auth Service', () => {
  test('should register user with valid data', async () => {
    const user = await authService.register(
      'user@test.com',
      'SecurePass123!',
      'John',
      'Doe'
    );
    expect(user.email).toBe('user@test.com');
  });

  test('should throw error if email exists', async () => {
    await expect(
      authService.register('user@test.com', 'Pass123!', 'John', 'Doe')
    ).rejects.toThrow('Email already exists');
  });
});
```

---

## Security Checklist

### Authentication & Authorization
- [x] Password hashing (bcrypt)
- [x] JWT-based auth
- [x] Role-based access control
- [ ] Rate limiting on login
- [ ] 2FA (optional)

### Input Validation
- [ ] All endpoints validate input
- [ ] Sanitize user input
- [ ] File upload validation

### API Security
- [x] CORS configured
- [x] Helmet security headers
- [x] Rate limiting
- [ ] HTTPS in production
- [ ] API key for webhooks

### Database
- [x] Mongoose prevents injection
- [ ] Encrypt sensitive fields
- [ ] Regular backups

### Monitoring
- [ ] Error logging (Sentry)
- [ ] Request logging
- [ ] Database monitoring

---

## Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time | < 200ms |
| Product List Page Load | < 1s |
| Search Results | < 500ms |
| Payment Verification | < 1s |
| Database Query | < 50ms |
| Page Load (Frontend) | < 2s |

---

## Deployment Checklist

### Backend
- [ ] All environment variables set
- [ ] MongoDB production URI configured
- [ ] Proper error handling
- [ ] Logging enabled
- [ ] Rate limiting enabled
- [ ] CORS whitelist configured
- [ ] JWT secret is strong
- [ ] Webhook URLs configured

### Frontend
- [ ] API URL points to production
- [ ] Build optimized (`npm run build`)
- [ ] Environment variables configured
- [ ] Error tracking enabled

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Database monitoring
- [ ] Server health checks

---

## Git Workflow

### Commit Messages
```
feat: add authentication system
fix: resolve JWT token expiration bug
docs: update API documentation
refactor: improve error handling
test: add unit tests for auth service
```

### Branch Naming
```
feature/authentication
feature/product-management
bugfix/jwt-validation
docs/api-documentation
```

---

## Estimated Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Foundation | 2 hours | ✅ Complete |
| Phase 2: Authentication | 3 hours | ⏳ Next |
| Phase 3: Products | 2 hours | 📋 Planned |
| Phase 4: Orders | 3 hours | 📋 Planned |
| Phase 5: Payments | 3 hours | 📋 Planned |
| Phase 6: Frontend Setup | 2 hours | 📋 Planned |
| Phase 7: Frontend Features | 5 hours | 📋 Planned |
| Phase 8: Advanced Features | 3 hours | 📋 Planned |
| **Total** | **23 hours** | |

---

## Key Principles to Follow

1. **Test as you go** - Write tests for each feature
2. **Documentation** - Update docs with each change
3. **Code review** - Get feedback on PRs
4. **Performance first** - Profile before optimizing
5. **Security always** - Never compromise on security
6. **Keep it simple** - YAGNI principle
7. **Refactor constantly** - Clean code is maintainable code
8. **Monitor everything** - Logs, metrics, errors

---

**This is a living document. Update as features are completed.**
