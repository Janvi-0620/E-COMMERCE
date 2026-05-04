// ============================================
// Environment Configuration
// ============================================
// This file loads and validates environment variables
// Fails fast if required vars are missing

import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET'
];

// Validate required environment variables
const validateEnv = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

validateEnv();

console.log('--- Environment Variables ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('USE_MOCK_DATA:', process.env.USE_MOCK_DATA);
console.log('---------------------------');

export default {
  // Database
  mongodb: {
    uri: process.env.MONGODB_URI
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d'
  },

  // Server
  server: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    frontendUrl: process.env.FRONTEND_URL || '*',
    mockMode: process.env.USE_MOCK_DATA === 'true'
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || null
  },

  // Payment
  payment: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID,
      keySecret: process.env.RAZORPAY_KEY_SECRET
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    }
  },

  // Cloudinary
  cloudinary: {
    name: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },

  // Email
  email: {
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    senderEmail: process.env.SENDER_EMAIL
  },

  // Admin
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@ecommerce.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456'
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10
  },

  // Utilities
  isDev: () => process.env.NODE_ENV === 'development',
  isProd: () => process.env.NODE_ENV === 'production'
};
