// ============================================
// Payment Service
// ============================================
// Logic for processing payments with Stripe

import Stripe from 'stripe';
import env from '../../config/env.js';
import Order from '../order/order.model.js';
import { ApiError } from '../../middleware/error.middleware.js';
import { HTTP_STATUS } from '../../config/constants.js';
import logger from '../../utils/logger.js';

const stripe = new Stripe(env.payment.stripe.secretKey || 'sk_test_placeholder');

class PaymentService {
  /**
   * Create a Stripe Payment Intent
   */
  static async createPaymentIntent(orderId, userId) {
    // 1. Fetch order and verify ownership
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
    }

    if (order.user.toString() !== userId.toString()) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Unauthorized access to order');
    }

    // 2. Create Payment Intent
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100), // Stripe expects cents
        currency: 'usd',
        metadata: {
          orderId: order._id.toString(),
          userId: userId.toString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      logger.error('Stripe Payment Intent Creation Failed', error);
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Payment initialization failed');
    }
  }

  /**
   * Handle Stripe Webhooks
   */
  static async handleWebhook(signature, rawBody) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        env.payment.stripe.webhookSecret || 'whsec_placeholder'
      );
    } catch (err) {
      logger.error('Webhook signature verification failed', err);
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await this.handlePaymentSuccess(paymentIntent);
        break;
      
      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        await this.handlePaymentFailure(failedIntent);
        break;

      default:
        logger.info(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  /**
   * Update order on payment success
   */
  static async handlePaymentSuccess(paymentIntent) {
    const { orderId } = paymentIntent.metadata;
    
    const order = await Order.findById(orderId);
    if (!order) {
      logger.error(`Order ${orderId} not found during webhook processing`);
      return;
    }

    order.paymentStatus = 'PAID';
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: paymentIntent.receipt_email
    };
    order.paidAt = new Date();
    
    await order.save();
    logger.info(`✅ Order ${orderId} marked as PAID via webhook`);
  }

  /**
   * Update order on payment failure
   */
  static async handlePaymentFailure(paymentIntent) {
    const { orderId } = paymentIntent.metadata;
    
    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = 'FAILED';
      await order.save();
      logger.warn(`❌ Order ${orderId} marked as FAILED via webhook`);
    }
  }
}

export default PaymentService;
