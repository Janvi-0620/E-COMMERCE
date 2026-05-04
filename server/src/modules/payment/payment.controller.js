// ============================================
// Payment Controller
// ============================================
// HTTP handlers for payments and webhooks

import PaymentService from './payment.service.js';
import { HTTP_STATUS } from '../../config/constants.js';

/**
 * Create Payment Intent for an order
 */
export const createPaymentIntent = async (req, res) => {
  const { orderId } = req.body;
  const result = await PaymentService.createPaymentIntent(orderId, req.user._id);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result
  });
};

/**
 * Stripe Webhook Handler
 */
export const handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const result = await PaymentService.handleWebhook(signature, req.body);
  
  res.status(HTTP_STATUS.OK).json(result);
};
