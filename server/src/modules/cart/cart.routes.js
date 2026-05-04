// ============================================
// Cart Routes
// ============================================
// API routes for cart management

import express from 'express';
import * as cartController from './cart.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateQuantity);
router.delete('/clear', cartController.clearCart);

export default router;
