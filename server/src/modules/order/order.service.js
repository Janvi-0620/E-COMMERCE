// ============================================
// Order Service
// ============================================
// Business logic for order processing with transactions

import mongoose from 'mongoose';
import Order from './order.model.js';
import Product from '../product/product.model.js';
import CartService from '../cart/cart.service.js';
import { ApiError } from '../../middleware/error.middleware.js';
import { HTTP_STATUS } from '../../config/constants.js';
import logger from '../../utils/logger.js';

class OrderService {
  /**
   * Place a new order with atomic stock reduction
   */
  static async placeOrder(userId, orderData) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { orderItems, shippingAddress, paymentMethod } = orderData;

      if (!orderItems || orderItems.length === 0) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'No order items');
      }

      // 1. Verify stock and calculate prices
      let itemsPrice = 0;
      const verifiedItems = [];

      for (const item of orderItems) {
        const product = await Product.findById(item.product).session(session);
        
        if (!product || !product.isActive) {
          throw new ApiError(HTTP_STATUS.NOT_FOUND, `Product not found: ${item.name}`);
        }

        if (product.stock < item.quantity) {
          throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Insufficient stock for: ${product.name}`);
        }

        // Reduce stock
        product.stock -= item.quantity;
        await product.save({ session });

        const itemTotal = product.price * item.quantity;
        itemsPrice += itemTotal;

        verifiedItems.push({
          product: product._id,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          quantity: item.quantity
        });
      }

      // 2. Calculate tax and shipping
      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      // 3. Create order
      const order = await Order.create([{
        user: userId,
        orderItems: verifiedItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      }], { session });

      // 4. Clear cart
      await CartService.clearCart(userId);

      // 5. Commit transaction
      await session.commitTransaction();
      session.endSession();

      logger.info(`Order placed successfully: ${order[0]._id}`);
      return order[0];

    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();
      session.endSession();
      logger.error('Order placement failed - Transaction rolled back', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId, userId) {
    const order = await Order.findById(orderId).populate('user', 'name email');
    
    if (!order) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Order not found');
    }

    // Check if the order belongs to the user
    if (order.user._id.toString() !== userId.toString()) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Not authorized to view this order');
    }

    return order;
  }

  /**
   * Get user's orders
   */
  static async getMyOrders(userId) {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
  }
}

export default OrderService;
