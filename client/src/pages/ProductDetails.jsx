import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  ChevronLeft,
  Heart,
  Share2,
  Sparkles
} from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { useCartStore } from '../features/cart/useCartStore';
import Navbar from '../components/Navbar';
import CartDrawer from '../features/cart/CartDrawer';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, error: fetchError } = useProduct(id);
  const addItem = useCartStore((state) => state.addItem);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-100 rounded-full" />
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (fetchError && !product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-red-100">
          <ChevronLeft className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Product Not Found</h2>
        <p className="text-gray-500 mb-12 max-w-md font-medium">{fetchError}</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-gray-900 text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-2xl hover:bg-indigo-600 transition-all active:scale-95"
        >
          Back to Collection
        </button>
      </div>
    );
  }

  const productImages = product?.images || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <CartDrawer />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-32">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-gray-400 hover:text-indigo-600 font-black text-xs uppercase tracking-widest mb-12 transition-all group"
        >
          <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </div>
          Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left: Image Gallery */}
          <div className="space-y-8">
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden bg-gray-50 relative group shadow-2xl shadow-gray-200/50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  src={productImages[activeImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <div className="absolute top-10 left-10 inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl text-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-xl">
                <Sparkles className="w-4 h-4" />
                Limited Edition
              </div>

              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`absolute top-10 right-10 p-5 rounded-[1.75rem] backdrop-blur-xl shadow-2xl transition-all active:scale-90 ${
                  isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
              {productImages.map((img, idx) => (
                <button
                  key={`thumb-${img.url}-${idx}`}
                  onClick={() => setActiveImage(idx)}
                  className={`w-28 h-28 rounded-[2rem] overflow-hidden flex-shrink-0 border-4 transition-all duration-500 ${
                    activeImage === idx ? 'border-indigo-600 scale-110 shadow-2xl shadow-indigo-100' : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col py-6">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <span className="px-5 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl">
                  {product.category}
                </span>
                <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{product.brand}</span>
              </div>
              
              <h1 className="text-6xl sm:text-7xl font-black text-gray-900 leading-[1] mb-8 tracking-tighter">
                {product.name}
              </h1>

              <div className="flex items-center gap-8">
                <div className="flex items-center bg-yellow-50 px-5 py-2.5 rounded-2xl border border-yellow-100">
                  <Star className="w-5 h-5 text-yellow-500 fill-current mr-2.5" />
                  <span className="text-sm font-black text-yellow-700">{product.ratings?.average || 0}</span>
                </div>
                <span className="text-gray-400 font-bold text-sm border-b-2 border-gray-100 pb-1 cursor-pointer hover:text-indigo-600 hover:border-indigo-100 transition-all">
                  {product.ratings?.count || 0} Verified Reviews
                </span>
              </div>
            </div>

            <div className="mb-16">
              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-6xl font-black text-gray-900 tracking-tighter">
                  ${product.price?.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-gray-300 line-through">
                  ${(product.price * 1.2).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-500 leading-[2] text-xl font-medium max-w-xl">
                {product.description}
              </p>
            </div>

            {/* Interactive Controls */}
            <div className="space-y-12">
              <div className="flex flex-wrap items-center gap-12">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Quantity</p>
                  <div className="flex items-center bg-gray-50 p-3 rounded-[2rem] gap-6 border border-gray-100">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <span className="w-12 text-center text-2xl font-black text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all active:scale-95"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Availability</p>
                  <div className="h-20 flex items-center">
                    <span className={`flex items-center gap-4 font-black text-xs px-6 py-4 rounded-[1.5rem] border ${
                      (product.stock || 0) > 0 ? 'bg-green-50/50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${ (product.stock || 0) > 0 ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`} />
                      { (product.stock || 0) > 0 ? `${product.stock} Units in Warehouse` : 'Currently Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <button 
                  onClick={() => addItem(product, quantity)}
                  disabled={(product.stock || 0) === 0}
                  className="flex-1 bg-gray-900 hover:bg-indigo-600 disabled:bg-gray-200 text-white py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-5 shadow-2xl shadow-black/10 transition-all active:scale-[0.98] group"
                >
                  <ShoppingBag className="w-8 h-8 group-hover:-translate-y-1 transition-transform duration-300" />
                  Add to Shopping Bag
                </button>
                <button className="p-8 bg-white border-4 border-gray-50 rounded-[2.5rem] text-gray-300 hover:text-indigo-600 hover:border-indigo-50 transition-all active:scale-90">
                  <Share2 className="w-8 h-8" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-20 pt-16 border-t-2 border-gray-50 grid grid-cols-3 gap-10">
              {[
                { id: 'shield', icon: ShieldCheck, title: 'Lifetime', sub: 'Assurance' },
                { id: 'truck', icon: Truck, title: 'Priority', sub: 'Delivery' },
                { id: 'rotate', icon: RotateCcw, title: 'Flexible', sub: 'Exchange' }
              ].map((badge) => (
                <div key={badge.id} className="flex flex-col items-center text-center gap-4 group cursor-default">
                  <div className="p-6 bg-gray-50 rounded-[2rem] group-hover:bg-indigo-600 group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-500">
                    <badge.icon className="w-10 h-10 text-gray-400 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-1">{badge.title}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
