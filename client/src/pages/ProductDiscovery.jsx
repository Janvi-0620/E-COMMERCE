import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import Navbar from '../components/Navbar';
import CartDrawer from '../features/cart/CartDrawer';
import ProductFilter from '../features/products/ProductFilter';
import ProductCard from '../features/products/ProductCard';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

const ProductDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Categories list
  const categories = ['Watches', 'Audio', 'Gadgets', 'Accessories'];

  // Real API Hook
  const { products, isLoading, error } = useProducts({
    search: searchQuery,
    category: activeCategory,
    sort: sortOrder
  });

  // Demo Fallback Data (If API is empty)
  const demoProducts = [
    {
      id: '1',
      name: 'Classic Chronograph',
      category: 'Watches',
      price: 1250,
      ratings: { average: 4.8 },
      isFeatured: true,
      images: [{ url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400&h=500' }]
    },
    {
      id: '2',
      name: 'Pro Wireless Headphones',
      category: 'Audio',
      price: 349,
      ratings: { average: 4.9 },
      images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=500' }]
    },
    {
      id: '3',
      name: 'Minimalist Wallet',
      category: 'Accessories',
      price: 89,
      ratings: { average: 4.5 },
      images: [{ url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400&h=500' }]
    },
    {
      id: '4',
      name: 'Smart Desk Lamp',
      category: 'Gadgets',
      price: 199,
      ratings: { average: 4.7 },
      images: [{ url: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=400&h=500' }]
    }
  ];

  const displayProducts = (products && products.length > 0) ? products : demoProducts;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <CartDrawer />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-indigo-400 text-xs font-black uppercase tracking-widest mb-8 border border-white/10">
                <Sparkles className="w-4 h-4" />
                New Collection 2026
              </div>
              <h1 className="text-6xl sm:text-8xl font-black text-white leading-[1] tracking-tighter mb-8">
                Defining the <br />
                <span className="text-indigo-500 italic">Future</span> of Luxe.
              </h1>
              <p className="text-gray-400 text-lg sm:text-xl font-medium max-w-2xl mb-12 leading-relaxed">
                Experience the intersection of high-end craftsmanship and next-gen technology. 
                Our curated collection is designed for those who demand excellence.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2rem] font-black text-lg flex items-center gap-3 transition-all active:scale-95 shadow-2xl shadow-indigo-500/20">
                  Shop Collection
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-8">
                  <div className="text-white">
                    <p className="text-2xl font-black">40+</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Premium Products</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="text-white">
                    <p className="text-2xl font-black">12k+</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Members</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-indigo-600 rounded-[4rem] rotate-6 opacity-20 blur-3xl" />
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800" 
                  alt="Featured Product" 
                  className="w-full h-full object-cover rounded-[3rem] shadow-2xl relative z-10"
                />
                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl z-20 hidden sm:block">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Growth</p>
                      <p className="text-xl font-black text-gray-900">+24%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Authentic</p>
                      <p className="text-xl font-black text-gray-900">Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ProductFilter 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 py-20">
        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100 flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {isLoading ? (
            new Array(8).fill(0).map((_, i) => (
              <div key={`discovery-skeleton-${i}`} className="animate-pulse bg-gray-100 aspect-[4/5] rounded-[3rem]" />
            ))
          ) : (
            displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductDiscovery;
