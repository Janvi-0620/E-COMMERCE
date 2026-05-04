// ============================================
// Order Model
// ============================================
// Stores customer orders with item details and status

import mongoose from 'mongoose';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '../../config/constants.js';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(PAYMENT_METHODS)
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    paymentStatus: {
      type: String,
      required: true,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING
    },
    orderStatus: {
      type: String,
      required: true,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING
    },
    paidAt: Date,
    deliveredAt: Date
  },
  {
    timestamps: true
  }
);

// Indexes for performance
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
