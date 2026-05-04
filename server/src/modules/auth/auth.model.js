// ============================================
// User Model
// ============================================
// MongoDB User schema with password hashing and 2FA support

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_ROLES } from '../../config/constants.js';
import env from '../../config/env.js';

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false // Don't include password in queries by default
    },

    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters']
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters']
    },

    // Role & Access
    role: {
      type: String,
      enum: [USER_ROLES.USER, USER_ROLES.ADMIN],
      default: USER_ROLES.USER
    },

    // Two-Factor Authentication (2FA)
    isTwoFactorEnabled: {
      type: Boolean,
      default: true // Enabled by default for security
    },

    twoFactorSecret: {
      // For TOTP (Time-based OTP) - optional for future use
      type: String,
      select: false
    },

    otpCode: {
      // Current OTP code (email-based)
      type: String,
      select: false
    },

    otpExpiresAt: {
      // When the OTP expires
      type: Date,
      select: false
    },

    otpAttempts: {
      // Track failed OTP attempts (prevent brute force)
      type: Number,
      default: 0,
      select: false
    },

    otpAttemptsLockedUntil: {
      // Lock account temporarily after too many attempts
      type: Date,
      select: false
    },

    lastOtpSentAt: {
      // Prevent OTP spam (rate limiting)
      type: Date,
      select: false
    },

    emailVerified: {
      // Track if user has verified their email
      type: Boolean,
      default: false
    },

    // Profile Information
    avatar: {
      type: String,
      default: null
    },

    phone: {
      type: String,
      default: null
    },

    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },

    isLocked: {
      type: Boolean,
      default: false
    },

    // Login History
    lastLogin: {
      type: Date,
      default: null
    },

    lastLoginAttempt: {
      type: Date,
      default: null
    },

    loginAttempts: {
      type: Number,
      default: 0
    },

    loginAttemptsLockedUntil: {
      type: Date,
      default: null
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      // Exclude sensitive fields when converting to JSON
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.otpCode;
        delete ret.otpExpiresAt;
        delete ret.twoFactorSecret;
        delete ret.otpAttempts;
        delete ret.otpAttemptsLockedUntil;
        delete ret.lastOtpSentAt;
        delete ret.loginAttempts;
        delete ret.loginAttemptsLockedUntil;
        return ret;
      }
    }
  }
);

// ============================================
// INDEXES
// ============================================

// Unique email index
userSchema.index({ email: 1 }, { unique: true });

// Query optimization
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// ============================================
// MIDDLEWARE (HOOKS)
// ============================================

// Hash password before saving (only if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(env.security.bcryptRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt timestamp
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Compare password with hashed password
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check if OTP has expired
 * @returns {boolean}
 */
userSchema.methods.isOtpExpired = function () {
  if (!this.otpExpiresAt) return true;
  return new Date() > this.otpExpiresAt;
};

/**
 * Check if account is locked due to OTP attempts
 * @returns {boolean}
 */
userSchema.methods.isOtpLocked = function () {
  if (!this.otpAttemptsLockedUntil) return false;
  return new Date() < this.otpAttemptsLockedUntil;
};

/**
 * Check if account is locked due to login attempts
 * @returns {boolean}
 */
userSchema.methods.isLoginLocked = function () {
  if (!this.loginAttemptsLockedUntil) return false;
  return new Date() < this.loginAttemptsLockedUntil;
};

/**
 * Reset OTP attempts
 */
userSchema.methods.resetOtpAttempts = function () {
  this.otpAttempts = 0;
  this.otpAttemptsLockedUntil = null;
};

/**
 * Increment OTP attempts
 * @param {number} maxAttempts - Maximum allowed attempts
 * @param {number} lockDurationMinutes - How long to lock account
 */
userSchema.methods.incrementOtpAttempts = function (maxAttempts = 5, lockDurationMinutes = 15) {
  this.otpAttempts = (this.otpAttempts || 0) + 1;

  if (this.otpAttempts >= maxAttempts) {
    this.otpAttemptsLockedUntil = new Date(Date.now() + lockDurationMinutes * 60 * 1000);
  }
};

/**
 * Reset login attempts
 */
userSchema.methods.resetLoginAttempts = function () {
  this.loginAttempts = 0;
  this.loginAttemptsLockedUntil = null;
};

/**
 * Increment login attempts
 * @param {number} maxAttempts - Maximum allowed attempts
 * @param {number} lockDurationMinutes - How long to lock account
 */
userSchema.methods.incrementLoginAttempts = function (maxAttempts = 5, lockDurationMinutes = 15) {
  this.loginAttempts = (this.loginAttempts || 0) + 1;

  if (this.loginAttempts >= maxAttempts) {
    this.loginAttemptsLockedUntil = new Date(Date.now() + lockDurationMinutes * 60 * 1000);
  }
};

/**
 * Get user full name
 * @returns {string}
 */
userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

/**
 * Convert to JSON with minimal fields
 * @returns {object}
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otpCode;
  delete obj.otpExpiresAt;
  delete obj.twoFactorSecret;
  delete obj.otpAttempts;
  delete obj.otpAttemptsLockedUntil;
  delete obj.lastOtpSentAt;
  delete obj.loginAttempts;
  delete obj.loginAttemptsLockedUntil;
  return obj;
};

// ============================================
// CREATE & EXPORT MODEL
// ============================================

const User = mongoose.model('User', userSchema);

export default User;
