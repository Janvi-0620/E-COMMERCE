// ============================================
// Auth Service
// ============================================
// Business logic for authentication with 2FA

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from './auth.model.js';
import emailService from '../../services/email.service.js';
import { ApiError } from '../../middleware/error.middleware.js';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../config/constants.js';
import env from '../../config/env.js';
import logger from '../../utils/logger.js';

// ============================================
// OTP GENERATION & UTILITY
// ============================================

/**
 * Generate a 6-digit OTP code
 * @returns {string}
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @param {string} type - Token type ('ACCESS' or 'TEMP')
 * @param {string|number} expiresIn - Token expiration
 * @returns {string}
 */
const generateToken = (userId, role, type = 'ACCESS', expiresIn = env.jwt.expire) => {
  return jwt.sign(
    { userId, role, type },
    env.jwt.secret,
    { expiresIn, algorithm: 'HS256' }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object}
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret, { algorithms: ['HS256'] });
  } catch (error) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
  }
};

// ============================================
// AUTH SERVICE CLASS
// ============================================

class AuthService {
  /**
   * Register a new user
   * @param {object} userData - { email, password, firstName, lastName }
   * @returns {Promise<object>} User object (without sensitive fields)
   */
  async register(userData) {
    const { email, password, firstName, lastName } = userData;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Email already registered');
    }

    // 2. Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      isTwoFactorEnabled: true, // Default: 2FA enabled
      emailVerified: false // User hasn't verified email yet
    });

    // Save user (password is hashed in pre-save hook)
    await user.save();

    logger.info(`User registered: ${user.email}`);

    // 3. Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.firstName);
    } catch (error) {
      logger.error(`Failed to send welcome email to ${user.email}`, { error: error.message });
      // Don't fail registration if email fails
    }

    // 4. Return user without sensitive fields
    return user.toJSON();
  }

  /**
   * User login (Step 1: Email & Password)
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} { requiresTwoFactor: true, tempToken: string }
   */
  async login(email, password) {
    // 1. Validate input
    if (!email || !password) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Email and password required');
    }

    // 1. Find user by email (include password field)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +loginAttempts +loginAttemptsLockedUntil');

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // 3. Check if account is locked due to too many login attempts
    if (user.isLoginLocked()) {
      const remainingMinutes = Math.ceil(
        (user.loginAttemptsLockedUntil - new Date()) / (60 * 1000)
      );
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        `Account locked. Try again in ${remainingMinutes} minutes`
      );
    }

    // 4. Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      user.incrementLoginAttempts();
      await user.save();

      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // 5. Reset login attempts on successful password verification
    user.resetLoginAttempts();
    user.lastLoginAttempt = new Date();
    await user.save();

    // 6. If 2FA is enabled, send OTP
    if (user.isTwoFactorEnabled) {
      const otp = generateOTP();
      const otpExpiration = 10; // 10 minutes

      user.otpCode = otp;
      user.otpExpiresAt = new Date(Date.now() + otpExpiration * 60 * 1000);
      user.otpAttempts = 0;
      user.lastOtpSentAt = new Date();
      user.resetOtpAttempts(); // Clear previous attempts

      await user.save();

      // Send OTP via email
      try {
        await emailService.sendOTPVerification(
          user.email,
          user.firstName,
          otp,
          otpExpiration
        );
      } catch (error) {
        logger.error(`Failed to send OTP to ${user.email}`, { error: error.message });
        throw new ApiError(HTTP_STATUS.INTERNAL_ERROR, 'Failed to send OTP');
      }

      // Return temporary token (valid only for OTP verification)
      const tempToken = generateToken(user._id, user.role, 'TEMP', '15m');

      return {
        requiresTwoFactor: true,
        tempToken,
        message: `OTP sent to ${user.email}`,
        maskedEmail: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      };
    }

    // 7. If 2FA is disabled, return full JWT
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role, 'ACCESS');

    return {
      requiresTwoFactor: false,
      token,
      user: user.toJSON(),
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS
    };
  }

  /**
   * Verify OTP (Step 2: Two-Factor Authentication)
   * @param {string} userId - User ID (from tempToken)
   * @param {string} otp - OTP code entered by user
   * @returns {Promise<object>} { token: string, user: object }
   */
  async verifyOTP(userId, otp) {
    // 1. Validate input
    if (!userId || !otp) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'User ID and OTP required');
    }

    // 1. Find user
    const user = await User.findById(userId).select(
      '+otpCode +otpExpiresAt +otpAttempts +otpAttemptsLockedUntil'
    );

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid session');
    }

    // 3. Check if account is locked due to too many OTP attempts
    if (user.isOtpLocked()) {
      const remainingMinutes = Math.ceil(
        (user.otpAttemptsLockedUntil - new Date()) / (60 * 1000)
      );
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        `Too many failed attempts. Try again in ${remainingMinutes} minutes`
      );
    }

    // 4. Check if OTP has expired
    if (user.isOtpExpired()) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'OTP has expired');
    }

    // 5. Verify OTP
    if (user.otpCode !== otp.toString().trim()) {
      user.incrementOtpAttempts();
      await user.save();

      const remainingAttempts = 5 - user.otpAttempts;
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        `Invalid OTP. ${remainingAttempts} attempts remaining`
      );
    }

    // 6. OTP is valid - Clear OTP and mark email as verified
    user.resetOtpAttempts();
    user.otpCode = null;
    user.otpExpiresAt = null;
    user.emailVerified = true;
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User verified 2FA: ${user.email}`);

    // 7. Generate and return JWT token
    const token = generateToken(user._id, user.role, 'ACCESS');

    return {
      token,
      user: user.toJSON(),
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS
    };
  }

  /**
   * Resend OTP to user's email
   * @param {string} userId - User ID
   * @returns {Promise<object>}
   */
  async resendOTP(userId) {
    // 1. Find user
    const user = await User.findById(userId).select('+lastOtpSentAt');

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    // 2. Rate limiting: Check if OTP was sent too recently (prevent spam)
    if (user.lastOtpSentAt) {
      const secondsSinceLastOTP = (new Date() - user.lastOtpSentAt) / 1000;
      if (secondsSinceLastOTP < 60) { // Minimum 60 seconds between OTP requests
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          `Please wait ${Math.ceil(60 - secondsSinceLastOTP)} seconds before requesting a new OTP`
        );
      }
    }

    // 3. Generate new OTP
    const otp = generateOTP();
    const otpExpiration = 10; // 10 minutes

    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + otpExpiration * 60 * 1000);
    user.otpAttempts = 0;
    user.lastOtpSentAt = new Date();
    await user.save();

    // 4. Send OTP via email
    try {
      await emailService.sendOTPVerification(
        user.email,
        user.firstName,
        otp,
        otpExpiration
      );
    } catch (error) {
      logger.error(`Failed to resend OTP to ${user.email}`, { error: error.message });
      throw new ApiError(HTTP_STATUS.INTERNAL_ERROR, 'Failed to resend OTP');
    }

    return {
      message: `OTP resent to ${user.email}`,
      maskedEmail: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    };
  }

  /**
   * Get current authenticated user
   * @param {string} userId - User ID from JWT token
   * @returns {Promise<object>} User object
   */
  async getCurrentUser(userId) {
    const user = await User.findById(userId);

    if (!user || !user.isActive) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not found or inactive');
    }

    return user.toJSON();
  }

  /**
   * Logout user (frontend clears JWT)
   * @returns {object}
   */
  logout() {
    return {
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS
    };
  }

  /**
   * Refresh JWT token
   * @param {string} token - Current JWT token
   * @returns {Promise<object>} { token: string }
   */
  async refreshToken(token) {
    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Token required');
    }

    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User not found or inactive');
      }

      const newToken = generateToken(user._id, user.role, 'ACCESS');

      return {
        token: newToken,
        message: 'Token refreshed successfully'
      };
    } catch (error) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
    }
  }

  /**
   * Toggle 2FA for user
   * @param {string} userId - User ID
   * @param {boolean} enable - Enable or disable 2FA
   * @returns {Promise<object>}
   */
  async toggle2FA(userId, enable) {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    user.isTwoFactorEnabled = enable;
    await user.save();

    return {
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      message: `2FA has been ${enable ? 'enabled' : 'disabled'}`
    };
  }
}

export default new AuthService();
