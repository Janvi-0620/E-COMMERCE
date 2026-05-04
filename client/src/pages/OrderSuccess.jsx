import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-12 text-center"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle className="w-12 h-12" />
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Order Confirmed!</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Your premium purchase has been secured. We've sent a confirmation email and will update you when your items ship.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="p-4 bg-gray-50 rounded-2xl text-left border border-gray-100">
              <ShoppingBag className="w-5 h-5 text-indigo-600 mb-2" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
              <p className="text-sm font-black text-gray-900">#LX-99283</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-left border border-gray-100">
              <Truck className="w-5 h-5 text-indigo-600 mb-2" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery</p>
              <p className="text-sm font-black text-gray-900">3-5 Days</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 transition-all active:scale-95"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-white text-gray-600 hover:bg-gray-50 py-4 rounded-2xl font-bold transition-all"
            >
              Track Order Status
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default OrderSuccess;
