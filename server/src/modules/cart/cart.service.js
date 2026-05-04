// ============================================
// Cart Service
// ============================================
// Business logic for shopping cart with Redis persistence

import Cart from './cart.model.js';
import Product from '../product/product.model.js';
import cache from '../../utils/cache.js';
import { ApiError } from '../../middleware/error.middleware.js';
import { HTTP_STATUS } from '../../config/constants.js';

class CartService {
  /**
   * Get user cart (Check Redis first, fallback to DB)
   */
  static async getCart(userId) {
    const cacheKey = `cart:${userId}`;
    const cachedCart = await cache.get(cacheKey);

    if (cachedCart) return cachedCart;

    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    await cache.set(cacheKey, cart, 3600); // Cache for 1 hour
    return cart;
  }

  /**
   * Add item to cart
   */
  static async addToCart(userId, productId, quantity = 1) {
    // 1. Verify product exists and is in stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
    }

    if (product.stock < quantity) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Insufficient stock available');
    }

    // 2. Find or create cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // 3. Update items
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // 4. Invalidate cache and return populated cart
    await cache.del(`cart:${userId}`);
    return this.getCart(userId);
  }

  /**
   * Update item quantity
   */
  static async updateQuantity(userId, productId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Cart not found');

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not in cart');
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Verify stock
      const product = await Product.findById(productId);
      if (product.stock < quantity) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Insufficient stock');
      }
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cache.del(`cart:${userId}`);
    return this.getCart(userId);
  }

  /**
   * Clear cart
   */
  static async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    await cache.del(`cart:${userId}`);
    return { items: [] };
  }
}

export default CartService;
