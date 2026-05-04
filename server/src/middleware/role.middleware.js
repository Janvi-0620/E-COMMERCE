// ============================================
// Role-Based Authorization Middleware
// ============================================
// Checks if user has required role for endpoint

import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import { ApiError } from './error.middleware.js';

// TODO: Implement role checking middleware
// - Check if req.user exists
// - Verify req.user.role matches required roles
// - Return 403 if insufficient permissions

export const authorize = (...roles) => {
  return (req, res, next) => {
    // TODO: Implementation
    if (!req.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN);
    }

    next();
  };
};

// Common authorization patterns
export const adminOnly = authorize('admin');
export const userOnly = authorize('user', 'admin');
