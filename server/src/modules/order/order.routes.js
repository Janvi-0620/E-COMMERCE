// ============================================
// Order Routes
// ============================================
// API routes for order management

import express from 'express';
import * as orderController from './order.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.post('/', orderController.placeOrder);
router.get('/myorders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

export default router;
