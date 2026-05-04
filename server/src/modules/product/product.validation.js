// ============================================
// Product Validation Schemas
// ============================================
// Joi validation schemas for product endpoints

import Joi from 'joi';

/**
 * Product creation/update schema
 */
export const productSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(2000),
  price: Joi.number().required().min(0),
  category: Joi.string().required(),
  brand: Joi.string().required(),
  stock: Joi.number().min(0),
  isFeatured: Joi.boolean(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      publicId: Joi.string().required()
    })
  )
});

/**
 * Query parameters validation for listing
 */
export const productQuerySchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1).max(100),
  search: Joi.string().allow(''),
  category: Joi.string().allow(''),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  sort: Joi.string().valid('newest', 'price-low', 'price-high', 'rating')
});

/**
 * Middleware factory for request validation
 */
export const validateProduct = (schema) => {
  return (req, res, next) => {
    const target = req.method === 'GET' ? req.query : req.body;
    const { error, value } = schema.validate(target, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    if (req.method === 'GET') {
      req.query = value;
    } else {
      req.body = value;
    }
    next();
  };
};
