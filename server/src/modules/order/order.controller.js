// ============================================
// Order Controller
// ============================================
// HTTP handlers for order module

import OrderService from './order.service.js';
import { HTTP_STATUS } from '../../config/constants.js';

export const placeOrder = async (req, res) => {
  const order = await OrderService.placeOrder(req.user._id, req.body);
  res.status(HTTP_STATUS.CREATED).json({ success: true, data: order });
};

export const getOrderById = async (req, res) => {
  const order = await OrderService.getOrderById(req.params.id, req.user._id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: order });
};

export const getMyOrders = async (req, res) => {
  const orders = await OrderService.getMyOrders(req.user._id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: orders });
};
