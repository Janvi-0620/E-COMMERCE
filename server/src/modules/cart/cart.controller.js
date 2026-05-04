// ============================================
// Cart Controller
// ============================================
// HTTP handlers for cart module

import { asyncHandler } from '../../middleware/error.middleware.js';
import CartService from './cart.service.js';
import { HTTP_STATUS } from '../../config/constants.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await CartService.getCart(req.user._id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await CartService.addToCart(req.user._id, productId, quantity);
  res.status(HTTP_STATUS.OK).json({ success: true, data: cart });
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await CartService.updateQuantity(req.user._id, productId, quantity);
  res.status(HTTP_STATUS.OK).json({ success: true, data: cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  await CartService.clearCart(req.user._id);
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Cart cleared' });
});
