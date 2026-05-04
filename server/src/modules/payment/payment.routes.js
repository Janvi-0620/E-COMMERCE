// ============================================
// Payment Routes
// ============================================
// API routes for processing payments

import express from 'express';
import * as paymentController from './payment.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

/**
 * Webhook endpoint (Requires raw body for Stripe verification)
 * Note: This must be registered BEFORE global express.json() in app.js
 * or handled specifically in app.js
 */
router.post(
  '/webhook', 
  express.raw({ type: 'application/json' }), 
  paymentController.handleWebhook
);

/**
 * Protected routes
 */
router.post(
  '/create-intent', 
  protect, 
  paymentController.createPaymentIntent
);

export default router;
