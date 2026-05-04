# Quick Start - Get Server Running in 5 Minutes

## Prerequisites
- Node.js v16+ installed
- MongoDB (local or MongoDB Atlas account)

---

## Step 1: Navigate to Server Directory
```bash
cd "d:\e commerce\ecommerce-platform\server"
```

---

## Step 2: Install Dependencies
```bash
npm install
```

**Expected output:**
```
added 150 packages in 45s
```

---

## Step 3: Ensure MongoDB is Running

### Option A: Local MongoDB
```bash
mongod
```
You should see: `[initandlisten] waiting for connections on port 27017`

### Option B: MongoDB Atlas (Cloud)
1. Get connection string from MongoDB Atlas
2. Update `MONGODB_URI` in `.env` file
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_db
   ```

---

## Step 4: Start the Server
```bash
npm run dev
```

**Expected output:**
```
╔════════════════════════════════════════════╗
║     🚀 E-Commerce API Server Started      ║
╠════════════════════════════════════════════╣
║ Environment: DEVELOPMENT                   ║
║ Port: 5000                                 ║
║ API URL: http://localhost:5000             ║
║ API Prefix: /api/v1                        ║
╚════════════════════════════════════════════╝
```

---

## Step 5: Verify Server is Running
Open a new terminal and run:
```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "uptime": 12.345
}
```

✅ **Server is running!**

---

## What's Next?

### Option 1: Continue Building (Recommended)
The foundation is complete. Next phase is **Authentication**:
- User registration & login
- JWT token generation
- Protected routes
- Password hashing with bcrypt

See: [docs/IMPLEMENTATION.md](../docs/IMPLEMENTATION.md) for next steps

### Option 2: Explore the Code
Check out the well-organized codebase:
- `src/config/` - Configuration files
- `src/middleware/` - Middleware setup
- `src/app.js` - Express app setup
- `src/server.js` - Entry point

---

## Troubleshooting

### Error: `EADDRINUSE: address already in use :::5000`
Another process is using port 5000. Kill it:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Error: `MongooseError: Cannot connect`
MongoDB is not running. Start it:
```bash
mongod  # If local MongoDB
```

Or use MongoDB Atlas and update `MONGODB_URI` in `.env`

### Error: `Missing required environment variables`
.env file is missing or incomplete. Copy from root:
```bash
cp ../.env .env
```

---

## Available Scripts

```bash
npm run dev      # Start with auto-reload (nodemon)
npm start        # Start production server
npm test         # Run tests
npm run seed     # Seed database (coming soon)
```

---

## Project Files Overview

```
server/
├── src/
│   ├── config/           # Configuration (db, env, constants)
│   ├── middleware/       # Middleware (auth, error, rate-limit)
│   ├── modules/          # Feature modules (coming: auth, product, etc)
│   ├── utils/            # Utilities (logger, validators)
│   ├── app.js            # Express setup
│   └── server.js         # Entry point
│
├── package.json          # Dependencies
└── .env                  # Environment variables
```

---

## Next: Build Authentication

When ready, implement the authentication module:

```bash
# This will create user registration/login
# Files to implement:
# - server/src/modules/auth/auth.model.js
# - server/src/modules/auth/auth.service.js
# - server/src/modules/auth/auth.controller.js
# - server/src/modules/auth/auth.routes.js
```

See [IMPLEMENTATION.md](../docs/IMPLEMENTATION.md#phase-2-authentication-module) for details.

---

## Server Status Indicators

### ✅ Server is Healthy
```
MongoDB Connected: localhost
Server listening on port 5000
Health check: /health endpoint works
```

### ❌ Something is Wrong
1. Check MongoDB is running: `mongod`
2. Check .env file exists and is complete
3. Check port 5000 is not in use
4. Check Node version: `node --version` (should be v16+)

---

## Architecture Overview

```
Frontend (React) ←→ Backend API (Express)
                          ↓
                    Middleware Layer
                    (Auth, Error, Rate Limit)
                          ↓
                    Route Handlers
                    (Controllers)
                          ↓
                    Business Logic
                    (Services)
                          ↓
                    Database
                    (MongoDB)
```

---

## Key Endpoints (Coming Soon)

```
POST   /api/v1/auth/register    - Register user
POST   /api/v1/auth/login       - Login user
GET    /api/v1/auth/me          - Get current user
GET    /api/v1/products         - List products
GET    /api/v1/orders           - Get user orders
```

---

## Production Deployment

When deploying to production:

1. Change `JWT_SECRET` to a strong random string
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas (not local)
4. Use HTTPS (not HTTP)
5. Update `FRONTEND_URL` to your domain
6. Enable authentication and authorization
7. Set up monitoring and logging

See [docs/SETUP.md](../docs/SETUP.md) for detailed production checklist.

---

**Backend is ready! Let's build the authentication system next.** 🚀
