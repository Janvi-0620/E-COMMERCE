# Backend Setup Guide

## Step-by-Step Backend Setup

### 1. Prerequisites

Ensure you have:
- Node.js v16+ installed
- MongoDB (local or MongoDB Atlas account)
- npm or yarn
- Git

### 2. Initial Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from root)
cp ../.env .env
```

### 3. Environment Configuration

Edit `server/.env` and update:

```
MONGODB_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Note**: For MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_db?retryWrites=true&w=majority
```

### 4. MongoDB Setup

#### Local MongoDB
```bash
# On Windows (assuming MongoDB installed)
mongod

# On Mac (using Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

#### MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add it to `.env` file

### 5. Start Development Server

```bash
# Start with hot-reload (using nodemon)
npm run dev

# Expected output:
# ✅ MongoDB Connected: localhost
# 🚀 E-Commerce API Server Started
# Port: 5000
# API URL: http://localhost:5000
```

### 6. Test Health Check

```bash
curl http://localhost:5000/health

# Expected response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-...",
  "uptime": 12.345
}
```

---

## Project Structure Explained

### `/config` - Configuration Layer

**db.js**
- Manages MongoDB connection
- Handles retries and connection pooling
- Graceful error handling

**env.js**
- Loads and validates environment variables
- Fails fast if required vars missing
- Provides typed config object

**constants.js**
- Centralized constants (roles, statuses, HTTP codes)
- Prevents magic strings scattered across code
- Easy to maintain

### `/middleware` - Cross-Cutting Concerns

**error.middleware.js**
- Centralized error handler (catches all errors)
- Transforms errors into consistent JSON responses
- Handles specific error types (MongoDB, JWT, validation)

**rateLimit.middleware.js**
- Prevents brute-force attacks
- Different limits for different endpoints
- Configurable per endpoint

**auth.middleware.js** (coming next)
- JWT verification
- Protected routes
- User extraction from token

**role.middleware.js** (coming next)
- Role-based access control
- Admin-only route protection

### `/modules` - Feature-Based Modules

Each module is self-contained:

```
modules/auth/
├── auth.controller.js     # HTTP handlers
├── auth.service.js        # Business logic
├── auth.routes.js         # Endpoint definitions
├── auth.model.js          # Mongoose schema
├── auth.validation.js     # Input validation
└── auth.middleware.js     # Auth-specific middleware
```

**Why this structure?**
- One developer can own one module
- Easy to test independently
- Reusable across projects
- Scales to microservices

### `/services` - Shared Services

Global services used across modules:

```
services/
├── email.service.js       # Send emails
├── payment.service.js     # Payment gateway integration
├── cloudinary.service.js  # Image upload
└── cache.service.js       # Caching layer
```

### `/utils` - Helper Functions

```
utils/
├── logger.js              # Structured logging
├── apiFeatures.js         # Pagination, filtering, sorting
├── validators.js          # Joi schemas
└── formatters.js          # Data formatting
```

### `/jobs` - Background Tasks

```
jobs/
├── email.job.js           # Send emails async
├── payment.job.js         # Process payments
└── notification.job.js    # Send notifications
```

---

## Key Design Decisions

### 1. Module-Based Architecture

**Why not MVC?**
- MVC doesn't scale well as codebase grows
- Hard to find related code (models in one folder, controllers in another)
- Difficult to extract into microservices later

**Why modules?**
- Feature ownership (one module = one concern)
- Everything related to a feature is together
- Easy to refactor, test, and deploy
- Scales to microservices naturally

### 2. Centralized Error Handling

**Why?**
- Consistent error responses across API
- Single point to modify error format
- Easy to add logging, monitoring
- Reduces code duplication

**How?**
```javascript
// All async errors are caught by error middleware
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage in routes:
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  // If error occurs, it's automatically caught and formatted
}));
```

### 3. Rate Limiting

**Why?**
- Prevent brute-force attacks on login
- Protect against DOS attacks
- Protect payment endpoints

**Implementation:**
- Login: 5 attempts per 15 minutes
- API: 100 requests per 15 minutes
- Upload: 20 uploads per hour

### 4. JWT Authentication

**Why JWT?**
- Stateless (no session storage needed)
- Scales horizontally (multiple servers)
- Standard in microservices
- Works with mobile apps

**How?**
1. User logs in with email/password
2. Server verifies password and creates JWT
3. Client stores JWT in localStorage
4. Client sends JWT in Authorization header
5. Server verifies JWT on protected routes

### 5. MongoDB + Mongoose

**Why Mongoose?**
- Schema validation before database
- Automatic type casting
- Query helpers and virtuals
- Hook support (before/after operations)

**Indexing:**
- Always index `_id` (automatic)
- Index `email` (unique login)
- Index `category` (filtering)
- Index `createdAt` (sorting)

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John"
  },
  "message": "User created successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Status Codes
- `200` - OK (GET, PUT successful)
- `201` - Created (POST successful)
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid JWT)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate key)
- `500` - Internal Server Error

---

## Logging

Logs are written to:
- **Console** - Real-time debugging
- **File** - `/logs/YYYY-MM-DD.log` - Persistent records

Example log:
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "message": "POST /api/v1/auth/login - 200 (45ms)"
}
```

---

## Next Steps

After backend setup:

1. **Create Auth Module** - Implement registration, login, JWT
2. **Create Product Module** - CRUD operations, search, filter
3. **Create Order Module** - Order creation, tracking
4. **Integrate Payment** - Razorpay/Stripe
5. **Build Frontend** - React + Redux setup

---

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
mongod  # Start MongoDB locally
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in .env or kill process using port 5000
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### JWT Secret Error
```
Error: jwt malformed
```
**Solution**: Set JWT_SECRET in .env file (>20 characters recommended)

---

## Performance Tips

1. **Enable MongoDB Compression**
   - Add `?compressors=snappy` to connection string

2. **Use Connection Pooling**
   - Defaults: maxPoolSize: 10, minPoolSize: 5

3. **Index Frequently Queried Fields**
   - Email, category, createdAt

4. **Use Lean Queries**
   ```javascript
   // For read-only queries, use lean()
   const products = await Product.find().lean();
   ```

5. **Pagination Always**
   - Never return all documents at once
   - Default limit: 20 items

---

## Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong, random string
- [ ] Set `NODE_ENV=production`
- [ ] Use `HTTPS` (not HTTP)
- [ ] Enable CORS only for your frontend domain
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Enable MongoDB authentication
- [ ] Use environment variables (never hardcode secrets)
- [ ] Setup rate limiting
- [ ] Enable logging and monitoring
- [ ] Regular security updates (`npm audit fix`)

---

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:5000/health

# Upcoming: Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ecommerce.com","password":"Admin@123456"}'
```

### Using Postman
1. Download [Postman](https://www.postman.com/)
2. Import the API collection (coming soon)
3. Test endpoints directly

---

**Backend setup complete! Ready to build authentication module next.**
