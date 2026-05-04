import express from 'express';
import * as authController from './auth.controller.js';
import { protect, protectTemp } from '../../middleware/auth.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  toggle2faSchema,
  refreshTokenSchema,
  resendOTPSchema,
  validateRequest
} from './auth.validation.js';

const router = express.Router();

// Public Routes
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', validateRequest(refreshTokenSchema), authController.refreshToken);

// 2FA Verification Routes (Requires TempToken/JWT)
router.post('/verify-otp', protectTemp, validateRequest(verifyOtpSchema), authController.verifyOTP);
router.post('/resend-otp', protectTemp, validateRequest(resendOTPSchema), authController.resendOTP);

// Protected Routes (Full Authentication Required)
router.get('/me', protect, authController.getCurrentUser);
router.post('/logout', protect, authController.logout);
router.put('/2fa/toggle', protect, validateRequest(toggle2faSchema), authController.toggle2FA);

export default router;