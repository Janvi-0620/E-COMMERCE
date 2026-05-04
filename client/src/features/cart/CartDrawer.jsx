import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from './useCartStore';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Your Cart</h2>
                <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full">
                  {items.length} Items
                </span>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-50 p-8 rounded-full mb-4">
                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Cart is empty</h3>
                  <p className="text-gray-500 mt-2 text-sm">Add some premium essentials to get started.</p>
                  <button
                    onClick={toggleCart}
                    className="mt-6 text-indigo-600 font-bold hover:underline"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.images[0]?.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-gray-900 leading-tight">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">{item.category}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                          >
                            <Plus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        </div>
                        <p className="font-black text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>${getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
