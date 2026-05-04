import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, ArrowRight, Heart } from 'lucide-react';
import { useCartStore } from '../../features/cart/useCartStore';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      onClick={() => navigate(`/product/${product.id}`)}
      whileHover={{ y: -12 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-gray-50 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
        <img
          src={product?.images?.[0]?.url || 'https://via.placeholder.com/400x500'}
          alt={product?.name || 'Product'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
          {product.isFeatured && (
            <div className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest shadow-xl">
              Featured
            </div>
          )}
          <button className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl hover:bg-red-500 hover:text-white transition-all active:scale-90">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={handleAddToCart}
          className="absolute bottom-8 left-8 right-8 bg-gray-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-indigo-600 shadow-2xl shadow-black/20"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Bag
        </button>
      </div>

      <div className="px-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">
              {product.category}
            </p>
            <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-current mr-1.5" />
            <span className="text-xs font-black text-yellow-700">{product?.ratings?.average || 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-black text-gray-900 tracking-tighter">
            ${product?.price?.toLocaleString() || '0'}
          </p>
          <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:rotate-45 transition-all duration-500">
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
