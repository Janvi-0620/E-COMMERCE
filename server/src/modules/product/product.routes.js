// ============================================
// Product Routes
// ============================================
// API routes for product module

import express from 'express';
import * as productController from './product.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { 
  productSchema, 
  productQuerySchema, 
  validateProduct 
} from './product.validation.js';
import { USER_ROLES } from '../../config/constants.js';

const router = express.Router();

/**
 * Public Routes
 */
router.get(
  '/', 
  validateProduct(productQuerySchema), 
  productController.getAllProducts
);

router.get(
  '/:id', 
  productController.getProductById
);

/**
 * Admin Only Routes
 */
router.post(
  '/', 
  protect, 
  authorize(USER_ROLES.ADMIN), 
  validateProduct(productSchema), 
  productController.createProduct
);

router.put(
  '/:id', 
  protect, 
  authorize(USER_ROLES.ADMIN), 
  validateProduct(productSchema), 
  productController.updateProduct
);

router.delete(
  '/:id', 
  protect, 
  authorize(USER_ROLES.ADMIN), 
  productController.deleteProduct
);

export default router;
