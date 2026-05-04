import React from 'react';
import { ShoppingBag, User, Menu } from 'lucide-react';
import { useCartStore } from '../features/cart/useCartStore';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/useAuthStore';

const Navbar = () => {
  const { toggleCart, getTotalItems } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] glass-morphism border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button className="lg:hidden p-3 hover:bg-gray-100/50 rounded-2xl transition-colors">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gray-900 rounded-[1.25rem] flex items-center justify-center shadow-2xl group-hover:bg-indigo-600 transition-all duration-500 group-hover:rotate-[10deg]">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                Luxe<span className="text-indigo-600">Store</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors">Discover</Link>
            <span className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors cursor-not-allowed">Collections</span>
            <span className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors cursor-not-allowed">Trending</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={handleProfileClick}
              className="p-2.5 hover:bg-gray-100 rounded-2xl transition-all group relative"
            >
              <User className={`w-6 h-6 ${isAuthenticated ? 'text-indigo-600' : 'text-gray-600'} group-hover:text-indigo-600`} />
              {isAuthenticated && <span className="absolute bottom-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />}
            </button>
            
            <button 
              onClick={toggleCart}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl transition-all shadow-xl shadow-gray-200 hover:shadow-indigo-200 group relative"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-bold text-sm hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
