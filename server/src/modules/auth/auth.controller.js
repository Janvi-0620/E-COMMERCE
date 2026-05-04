// ============================================
// Auth Controller
// ============================================
// HTTP request handlers for authentication with 2FA

import { asyncHandler } from '../../middleware/error.middleware.js';
import authService from './auth.service.js';
import { HTTP_STATUS } from '../../config/constants.js';

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const user = await authService.register({
    email,
    password,
    firstName,
    lastName
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: user,
    message: 'Registration successful. Please check your email.'
  });
});

/**
 * POST /api/v1/auth/login
 * Step 1: Login with email and password
 * If 2FA enabled, returns tempToken to verify OTP
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  if (result.requiresTwoFactor) {
    // 2FA enabled: Return temp token to verify OTP
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        tempToken: result.tempToken,
        requiresTwoFactor: true,
        maskedEmail: result.maskedEmail
      },
      message: result.message
    });
  } else {
    // 2FA disabled: Return JWT immediately
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        token: result.token,
        user: result.user,
        requiresTwoFactor: false
      },
      message: result.message
    });
  }
});

/**
 * POST /api/v1/auth/verify-otp
 * Step 2: Verify OTP code
 * Returns JWT token on successful verification
 */
export const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const userId = req.user._id; // From temp token

  const result = await authService.verifyOTP(userId, otp);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      token: result.token,
      user: result.user
    },
    message: result.message
  });
});

/**
 * POST /api/v1/auth/resend-otp
 * Resend OTP to email
 */
export const resendOTP = asyncHandler(async (req, res) => {
  const userId = req.user._id; // From temp token

  const result = await authService.resendOTP(userId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      maskedEmail: result.maskedEmail
    },
    message: result.message
  });
});

/**
 * POST /api/v1/auth/logout
 * Logout user (JWT is cleared on frontend)
 */
export const logout = asyncHandler(async (req, res) => {
  const result = authService.logout();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: result.message
  });
});

/**
 * GET /api/v1/auth/me
 * Get current authenticated user
 * Protected route (requires valid JWT)
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await authService.getCurrentUser(userId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: user,
    message: 'User fetched successfully'
  });
});

/**
 * POST /api/v1/auth/refresh
 * Refresh JWT token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const result = await authService.refreshToken(token);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      token: result.token
    },
    message: result.message
  });
});

/**
 * PUT /api/v1/auth/2fa/toggle
 * Enable or disable 2FA for user
 * Protected route
 */
export const toggle2FA = asyncHandler(async (req, res) => {
  const { enable } = req.body;
  const userId = req.user._id;

  const result = await authService.toggle2FA(userId, enable);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      isTwoFactorEnabled: result.isTwoFactorEnabled
    },
    message: result.message
  });
});
