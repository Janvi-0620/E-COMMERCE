import jwt from 'jsonwebtoken';
import { ApiError } from './error.middleware.js';
import User from '../modules/auth/auth.model.js';
import env from '../config/env.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

/**
 * Base token verification logic
 */
const verifyUserToken = async (req, next, token, requiredType) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, env.jwt.secret);

    // Verify token type
    if (decoded.type !== requiredType) {
      const message = requiredType === 'ACCESS' 
        ? 'Full authentication required. Please complete 2FA verification.'
        : 'Invalid token type for this operation.';
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, message));
    }

    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'The user belonging to this token no longer exists.'));
    }

    if (!user.isActive) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User account is deactivated.'));
    }

    // Grant access
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN || 'Invalid or expired token'));
  }
};

/**
 * Middleware to protect routes with Full JWT verification (ACCESS type)
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Not authorized to access this route. Token missing.'));
  }

  await verifyUserToken(req, next, token, 'ACCESS');
};

/**
 * Middleware to protect 2FA routes with Temporary JWT verification (TEMP type)
 */
export const protectTemp = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication session expired. Please login again.'));
  }

  await verifyUserToken(req, next, token, 'TEMP');
};

/**
 * Middleware to restrict access based on user roles
 * @param {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};