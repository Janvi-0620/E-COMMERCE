// ============================================
// Auth Validation Schemas
// ============================================
// Joi validation schemas for authentication endpoints

import Joi from 'joi';

// Password strength requirements
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ============================================
// VALIDATION SCHEMAS
// ============================================

/**
 * Register validation schema
 * - email: valid email format
 * - password: min 8 chars, uppercase, lowercase, number, special char
 * - firstName, lastName: 2-50 characters
 */
export const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .pattern(PASSWORD_PATTERN)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),

  firstName: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name must not exceed 50 characters',
      'any.required': 'First name is required'
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name must not exceed 50 characters',
      'any.required': 'Last name is required'
    })
});

/**
 * Login validation schema
 */
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

/**
 * OTP verification schema
 */
export const verifyOtpSchema = Joi.object({
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers',
      'any.required': 'OTP is required'
    })
});

/**
 * Resend OTP schema
 */
export const resendOTPSchema = Joi.object({
  // No fields required - just validates empty body
});

/**
 * Refresh token schema
 */
export const refreshTokenSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'Token is required'
    })
});

/**
 * Toggle 2FA schema
 */
export const toggle2faSchema = Joi.object({
  enable: Joi.boolean()
    .required()
    .messages({
      'any.required': 'Enable flag is required'
    })
});

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

/**
 * Generic validation middleware factory
 * @param {Joi.Schema} schema - Joi schema to validate against
 * @returns {Function} Middleware function
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Collect all errors, not just first
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    req.body = value;
    next();
  };
};

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const schema = Joi.string().email();
  return !schema.validate(email).error;
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return PASSWORD_PATTERN.test(password) && password.length >= 8;
};

/**
 * Get password requirements text
 * @returns {string}
 */
export const getPasswordRequirements = () => {
  return `Password must contain:
  - At least 8 characters
  - One uppercase letter (A-Z)
  - One lowercase letter (a-z)
  - One number (0-9)
  - One special character (@$!%*?&)`;
};
