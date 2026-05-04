// ============================================
// Product Service
// ============================================
// Business logic for products with Redis caching

import Product from './product.model.js';
import cache from '../../utils/cache.js';
import { ApiError } from '../../middleware/error.middleware.js';
import { HTTP_STATUS } from '../../config/constants.js';
import logger from '../../utils/logger.js';
import env from '../../config/env.js';
import { ALL_MOCK_PRODUCTS } from './mockProducts.js';

class ProductService {
  /**
   * Get all products with filtering, search and pagination
   */
  static async getAllProducts(queryParams) {
    // Return mock data in development mode if database is unavailable
    if (env.server.mockMode) {
      const { 
        page = 1, 
        limit = 20, 
        search, 
        category, 
        minPrice, 
        maxPrice, 
        sort = 'newest' 
      } = queryParams;

      logger.warn('Serving mock product data');
      
      let filteredProducts = ALL_MOCK_PRODUCTS;

      if (category) {
        filteredProducts = ALL_MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }

      const total = filteredProducts.length;
      const pages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

      return {
        products: paginatedProducts,
        pagination: { total, page, limit, pages }
      };
    }

    const { 
      page = 1, 
      limit = 20, 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sort = 'newest' 
    } = queryParams;

    // 1. Create unique cache key based on query params
    const cacheKey = `products:${JSON.stringify(queryParams)}`;
    const cachedData = await cache.get(cacheKey);

    if (cachedData) {
      logger.debug('Product list served from cache');
      return cachedData;
    }

    // 2. Build query
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // 3. Build sort options
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') sortOptions = { price: 1 };
    if (sort === 'price-high') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { 'ratings.average': -1 };

    // 4. Execute query with projection (Performance: skip description for list view)
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find(query, { description: 0 }) // Optimization: Projection
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    const result = {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };

    // 5. Store in cache (TTL: 1 hour)
    await cache.set(cacheKey, result, 3600);

    return result;
  }

  /**
   * Get product by ID
   */
  static async getProductById(id) {
    // Return mock data in development mode if database is unavailable
    if (env.server.mockMode) {
      logger.warn(`Serving mock product data for ID: ${id}`);
      const product = ALL_MOCK_PRODUCTS.find(p => p.id === id || p._id === id);
      if (!product) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
      }
      return product;
    }

    const cacheKey = `product:${id}`;
    const cachedProduct = await cache.get(cacheKey);

    if (cachedProduct) return cachedProduct;

    const product = await Product.findById(id);
    if (!product || !product.isActive) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
    }

    await cache.set(cacheKey, product, 3600);
    return product;
  }

  /**
   * Create new product (Admin Only)
   */
  static async createProduct(productData) {
    const product = await Product.create(productData);
    
    // Invalidate product list caches
    await cache.delPattern('products:*');
    
    return product;
  }

  /**
   * Update product (Admin Only)
   */
  static async updateProduct(id, updateData) {
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
    }

    // Invalidate caches
    await cache.del(`product:${id}`);
    await cache.delPattern('products:*');

    return product;
  }

  /**
   * Delete product (Admin Only - Soft Delete)
   */
  static async deleteProduct(id) {
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
    }

    // Invalidate caches
    await cache.del(`product:${id}`);
    await cache.delPattern('products:*');

    return true;
  }
}

export default ProductService;
