// ============================================
// Product Model
// ============================================
// MongoDB Product schema with indexing and validation

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      index: true
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true }
      }
    ],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ============================================
// INDEXES
// ============================================

// Text index for search functionality
productSchema.index(
  { name: 'text', description: 'text', category: 'text' },
  { weights: { name: 10, category: 5, description: 1 } }
);

// Compound index for filtering
productSchema.index({ category: 1, price: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
