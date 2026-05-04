// ============================================
// Rate Limiting Middleware
// ============================================
// Prevents abuse by limiting requests per IP address

import rateLimit from 'express-rate-limit';
import { RATE_LIMIT, HTTP_STATUS } from '../config/constants.js';

// Store for in-memory rate limiting (production should use Redis)
const requestLog = new Map();

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message,
    statusCode: HTTP_STATUS.BAD_REQUEST,
    standardHeaders: true, // Return rate limit info in RateLimit-* headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
    keyGenerator: (req) => {
      // Use IP address as key (works behind proxies with trust proxy setting)
      return req.ip || req.connection.remoteAddress;
    },
    handler: (req, res) => {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: message || 'Too many requests, please try again later'
      });
    },
    skip: (req) => {
      // Skip rate limiting for health check
      return req.path === '/health';
    }
  });
};

export default {
  // Strict rate limiting for login attempts
  loginLimit: createRateLimiter(
    RATE_LIMIT.LOGIN_ATTEMPTS.windowMs,
    RATE_LIMIT.LOGIN_ATTEMPTS.max,
    RATE_LIMIT.LOGIN_ATTEMPTS.message
  ),

  // General API rate limiting
  apiLimit: createRateLimiter(
    RATE_LIMIT.API_GENERAL.windowMs,
    RATE_LIMIT.API_GENERAL.max,
    RATE_LIMIT.API_GENERAL.message
  ),

  // Product upload rate limiting
  uploadLimit: createRateLimiter(
    RATE_LIMIT.PRODUCT_UPLOAD.windowMs,
    RATE_LIMIT.PRODUCT_UPLOAD.max,
    RATE_LIMIT.PRODUCT_UPLOAD.message
  )
};
