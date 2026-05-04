// ============================================
// Error Handling Middleware
// ============================================
// Centralized error handling for all routes and async operations

import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import logger from '../utils/logger.js';

// ============================================
// CUSTOM ERROR CLASS
// ============================================

export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// ============================================
// ASYNC HANDLER WRAPPER
// ============================================

// Wraps async route handlers to catch errors
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_ERROR;
  err.message = err.message || ERROR_MESSAGES.INTERNAL_ERROR;

  // Handle specific error types
  switch (true) {
    // MongoDB Cast Error (invalid ID format)
    case err.name === 'CastError': {
      const message = `Invalid ${err.path}: ${err.value}`;
      err = new ApiError(HTTP_STATUS.BAD_REQUEST, message);
      break;
    }

    // MongoDB Duplicate Key Error
    case err.code === 11000: {
      const field = Object.keys(err.keyValue)[0];
      const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      err = new ApiError(HTTP_STATUS.CONFLICT, message);
      break;
    }

    // Mongoose Validation Error
    case err.name === 'ValidationError': {
      const messages = Object.values(err.errors).map(e => e.message);
      err = new ApiError(HTTP_STATUS.BAD_REQUEST, messages.join(', '));
      break;
    }

    // JWT Errors
    case err.name === 'JsonWebTokenError': {
      err = new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
      break;
    }

    case err.name === 'TokenExpiredError': {
      err = new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Token expired');
      break;
    }
  }

  // Log error
  logger.error('Error:', {
    statusCode: err.statusCode,
    message: err.message,
    url: req.originalUrl,
    method: req.method,
    stack: err.stack
  });

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// ============================================
// 404 NOT FOUND HANDLER
// ============================================

export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};
