// ============================================
// Product Controller
// ============================================
// HTTP handlers for product module

import ProductService from './product.service.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../config/constants.js';

/**
 * Get all products
 */
export const getAllProducts = async (req, res) => {
  const result = await ProductService.getAllProducts(req.query);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result
  });
};

/**
 * Get single product
 */
export const getProductById = async (req, res) => {
  const product = await ProductService.getProductById(req.params.id);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: product
  });
};

/**
 * Create product
 */
export const createProduct = async (req, res) => {
  const product = await ProductService.createProduct(req.body);
  
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: SUCCESS_MESSAGES.PRODUCT_CREATED,
    data: product
  });
};

/**
 * Update product
 */
export const updateProduct = async (req, res) => {
  const product = await ProductService.updateProduct(req.params.id, req.body);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.PRODUCT_UPDATED,
    data: product
  });
};

/**
 * Delete product
 */
export const deleteProduct = async (req, res) => {
  await ProductService.deleteProduct(req.params.id);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: SUCCESS_MESSAGES.PRODUCT_DELETED
  });
};
