# E-Commerce Platform

A production-grade, full-stack e-commerce platform built with **React**, **Node.js**, **Express**, and **MongoDB**. This project demonstrates enterprise-level software architecture, security best practices, and scalable system design.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Architecture](#architecture)
- [Development](#development)
- [Deployment](#deployment)

---

## 🎯 Project Overview

This is a complete e-commerce solution with:
- **User Authentication** (JWT-based, role-based access control)
- **Product Management** (CRUD, search, filter, pagination)
- **Shopping Cart** (Redux-managed, persistent state)
- **Order Processing** (creation, tracking, status management)
- **Payment Integration** (Razorpay/Stripe)
- **Admin Dashboard** (manage users, products, orders)
- **Security Features** (rate limiting, CORS, helmet, input validation)
- **Performance Optimization** (caching, indexing, pagination)

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: Joi
- **Security**: Helmet, CORS, express-rate-limit
- **Caching**: Redis (optional)
- **Logging**: Winston/custom logger

### Frontend
- **Library**: React (Vite)
- **State Management**: Redux Toolkit
- **Styling**: Bootstrap 5
- **HTTP Client**: Axios
- **Form Validation**: Joi/react-hook-form

### DevOps & Tools
- **Package Manager**: npm
- **Testing**: Jest, Supertest
- **Monitoring**: Winston (logging)
- **Error Tracking**: Sentry (optional)

---

## 📁 Directory Structure

```
ecommerce-platform/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── app/           # Redux store
│   │   ├── features/      # Redux slices (auth, cart, product)
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API client
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Helper functions
│   │   ├── styles/        # Global styles
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   │   ├── db.js      # MongoDB connection
│   │   │   ├── env.js     # Environment variables
│   │   │   └── constants.js # App constants
│   │   ├── modules/       # Feature modules (self-contained)
│   │   │   ├── auth/      # Authentication
│   │   │   ├── user/      # User management
│   │   │   ├── product/   # Product management
│   │   │   ├── cart/      # Cart logic
│   │   │   ├── order/     # Order processing
│   │   │   └── payment/   # Payment integration
│   │   ├── middleware/    # Cross-cutting concerns
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── rateLimit.middleware.js
│   │   ├── services/      # Shared services
│   │   │   ├── email.service.js
│   │   │   ├── payment.service.js
│   │   │   └── cloudinary.service.js
│   │   ├── utils/         # Helper functions
│   │   │   ├── apiFeatures.js
│   │   │   ├── logger.js
│   │   │   └── validators.js
│   │   ├── jobs/          # Background jobs
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Entry point
│   ├── tests/             # Jest tests
│   ├── package.json
│   └── .env
│
├── docs/                   # Documentation
│   ├── API.md             # API endpoints
│   ├── ARCHITECTURE.md    # System architecture
│   └── SETUP.md           # Setup guide
│
├── .env                    # Environment variables
├── docker-compose.yml     # Docker setup (optional)
├── ARCHITECTURE.md        # Architecture documentation
└── README.md              # This file

```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables**
   ```bash
   # Copy the .env file from root and update values
   cp ../.env .
   ```

3. **Start the server**
   ```bash
   npm run dev  # Development with nodemon
   npm start    # Production
   ```

4. **Expected output**
   ```
   ✅ MongoDB Connected: localhost
   🚀 E-Commerce API Server Started
   Port: 5000
   API URL: http://localhost:5000
   ```

### Frontend Setup (Next Phase)

1. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev  # Starts on http://localhost:5173
   ```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Response Format (Standard)
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message"
}
```

### Core Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user (protected)

#### Products
- `GET /products` - List products (with filters)
- `GET /products/:id` - Get product details
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

#### Orders
- `POST /orders` - Create order (protected)
- `GET /orders` - Get user orders (protected)
- `GET /admin/orders` - Get all orders (admin)

Full API documentation: [See docs/API.md](docs/API.md)

---

## ✨ Features

### Phase 1: Authentication ✅
- [x] JWT-based authentication
- [x] Password hashing (bcrypt)
- [x] Protected routes
- [x] Role-based access control (User/Admin)

### Phase 2: Products (In Progress)
- [ ] Product CRUD (admin)
- [ ] Product search & filtering
- [ ] Pagination & sorting
- [ ] Image upload (Cloudinary)

### Phase 3: Cart & Orders (Upcoming)
- [ ] Redux cart management
- [ ] Cart persistence
- [ ] Order creation
- [ ] Order history

### Phase 4: Payments (Upcoming)
- [ ] Razorpay integration
- [ ] Payment verification
- [ ] Success/failure handling

### Phase 5: Admin Dashboard (Upcoming)
- [ ] User management
- [ ] Product management
- [ ] Order management
- [ ] Dashboard analytics

---

## 🏛 Architecture

### Design Principles

1. **Clean Architecture** - Separation of concerns, modular design
2. **SOLID Principles** - Single responsibility, loose coupling
3. **DRY** - Don't repeat yourself, shared utilities
4. **Error Handling** - Centralized, structured error responses
5. **Security** - Best practices applied (OWASP)
6. **Scalability** - Can scale to microservices

### Request Flow

```
HTTP Request
    ↓
Router (modules/*/routes)
    ↓
Middleware (auth, validation, error handling)
    ↓
Controller (handle HTTP)
    ↓
Service (business logic)
    ↓
Model (database)
    ↓
Response
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

---

## 💻 Development

### Available Scripts (Backend)

```bash
npm run dev      # Start development server with hot reload
npm start        # Start production server
npm test         # Run tests
npm run seed     # Seed database with sample data
```

### Code Standards

- **ESLint** configuration (coming soon)
- **Prettier** formatting (coming soon)
- **Commits**: Conventional commits format
- **Testing**: Aim for >80% coverage

### Git Workflow

```bash
git checkout -b feature/feature-name
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin feature/feature-name
# Create Pull Request
```

---

## 🐳 Docker Setup (Optional)

### Run entire stack with Docker

```bash
docker-compose up -d
```

This starts:
- MongoDB (27017)
- Redis (6379)
- Backend API (5000)
- Frontend (5173)

---

## 📊 Database Schemas

### User Schema
```
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: Enum['user', 'admin'],
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```
{
  name: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  rating: Number,
  reviews: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```
{
  userId: ObjectId,
  items: Array,
  totalAmount: Number,
  status: Enum,
  paymentStatus: Enum,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ MongoDB injection prevention
- ✅ XSS protection

---

## 📈 Performance Optimizations

- Pagination on all list endpoints
- MongoDB indexing on frequently queried fields
- Redis caching (configurable TTL)
- Lean MongoDB queries for read-only operations
- Gzip compression
- Image optimization via Cloudinary

---

## 🧪 Testing

### Unit Tests
```bash
npm test -- auth.service.test.js
```

### Integration Tests
```bash
npm test -- auth.routes.test.js
```

---

## 🌐 Deployment

### Backend Deployment
1. Push to GitHub
2. Connect to railway.app or Heroku
3. Set environment variables
4. Deploy automatically

### Frontend Deployment
1. Build: `npm run build`
2. Deploy to Vercel/Netlify
3. Set API URL to production backend

---

## 📝 License

MIT License - feel free to use this project for learning and commercial purposes.

---

## 👨‍💻 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@ecommerce.com

---

## 🗺️ Roadmap

- [ ] Email verification
- [ ] Forgot password functionality
- [ ] Product reviews & ratings
- [ ] Wishlist feature
- [ ] Real-time notifications
- [ ] Order tracking with SMS
- [ ] Coupon/discount system
- [ ] Analytics dashboard
- [ ] Mobile app

---

**Built with ❤️ as a production-grade e-commerce platform.**
