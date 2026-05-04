// ============================================
// Express App Setup
// ============================================
// Configures Express server with middleware, routes, and error handling

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import env from './config/env.js';
import { 
  errorHandler, 
  notFoundHandler 
} from './middleware/error.middleware.js';
import rateLimitMiddleware from './middleware/rateLimit.middleware.js';
import logger from './utils/logger.js';

// Import route modules
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/product/product.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import userRoutes from './modules/user/user.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import paymentRoutes from './modules/payment/payment.routes.js';

const app = express();

// ============================================
// SECURITY & CORS
// ============================================

// Set security HTTP headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: env.server.frontendUrl,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature']
}));

// Payment routes (registered before JSON parsing for webhooks)
app.use(`${env.server.apiPrefix}/payments`, paymentRoutes);

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

// Parse JSON requests
app.use(express.json({ limit: '50mb' }));

// Parse URL-encoded requests
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============================================
// LOGGING MIDDLEWARE
// ============================================

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
});

// ============================================
// RATE LIMITING MIDDLEWARE
// ============================================

app.use(`${env.server.apiPrefix}/auth/login`, rateLimitMiddleware.loginLimit);
app.use(`${env.server.apiPrefix}/`, rateLimitMiddleware.apiLimit);

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// ============================================
// API ROUTES
// ============================================

const apiRouter = express.Router();

// Auth routes
apiRouter.use('/auth', authRoutes);

// Product routes
apiRouter.use('/products', productRoutes);

// Order routes
apiRouter.use('/orders', orderRoutes);

// User routes
apiRouter.use('/users', userRoutes);

// Cart routes
apiRouter.use('/cart', cartRoutes);

app.use(env.server.apiPrefix, apiRouter);

// ============================================
// 404 HANDLER
// ============================================

app.use(notFoundHandler);

// ============================================
// ERROR HANDLING MIDDLEWARE (MUST BE LAST)
// ============================================

app.use(errorHandler);

export default app;
