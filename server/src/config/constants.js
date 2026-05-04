// ============================================
// Application Constants
// ============================================
// Centralized constants used across the application

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const PAYMENT_METHODS = {
  RAZORPAY: 'razorpay',
  STRIPE: 'stripe',
  CASH_ON_DELIVERY: 'cod'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_EXISTS: 'User already exists',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  INVALID_TOKEN: 'Invalid or expired token',
  PRODUCT_NOT_FOUND: 'Product not found',
  ORDER_NOT_FOUND: 'Order not found',
  INSUFFICIENT_STOCK: 'Insufficient stock available',
  INVALID_INPUT: 'Invalid input data',
  INTERNAL_ERROR: 'Internal server error'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  ORDER_CREATED: 'Order created successfully',
  PAYMENT_SUCCESS: 'Payment successful',
  PROFILE_UPDATED: 'Profile updated successfully'
};

export const CACHE_TTL = {
  PRODUCT_LIST: 3600, // 1 hour
  PRODUCT_DETAIL: 1800, // 30 minutes
  USER_PROFILE: 1800, // 30 minutes
  SEARCH_RESULTS: 600, // 10 minutes
  ORDER_LIST: 300 // 5 minutes
};

export const RATE_LIMIT = {
  LOGIN_ATTEMPTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login attempts, please try again later'
  },
  API_GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests, please try again later'
  },
  PRODUCT_UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: 'Too many uploads, please try again later'
  }
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5
};

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // Min 8 chars, upper, lower, number, special
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
};

export const JWT_ALGORITHMS = {
  ALGORITHM: 'HS256'
};

export const EMPTY_PAGE_LIMIT = {
  PRODUCTS: 0,
  ORDERS: 0
};
