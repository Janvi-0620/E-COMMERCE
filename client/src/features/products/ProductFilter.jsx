import React from 'react';
import { Search, SlidersHorizontal, ChevronDown, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductFilter = ({ 
  categories, 
  activeCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange,
  sortOrder,
  onSortChange
}) => {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-[6rem] z-40 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Categories Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            <div className="p-3 bg-gray-50 rounded-2xl mr-2">
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat === 'All' ? '' : cat)}
                className={`relative px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  (activeCategory === cat || (cat === 'All' && !activeCategory))
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {(activeCategory === cat || (cat === 'All' && !activeCategory)) && (
                  <motion.div 
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 max-w-2xl">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search collection..."
                className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all text-sm font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative group w-full sm:w-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-gray-900 hover:border-indigo-600 transition-all shadow-sm">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                {sortOrder.replace('-', ' ')}
                <ChevronDown className="w-4 h-4 text-gray-300 group-hover:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-50 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 transform translate-y-2 group-hover:translate-y-0">
                <div className="px-6 py-2 mb-2 border-b border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort Collection</p>
                </div>
                {[
                  { label: 'Recently Added', value: 'newest' },
                  { label: 'Price: Lowest First', value: 'price-low' },
                  { label: 'Price: Highest First', value: 'price-high' },
                  { label: 'Customer Rating', value: 'rating' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onSortChange(option.value)}
                    className={`w-full text-left px-6 py-3 text-xs font-bold transition-all flex items-center justify-between ${
                      sortOrder === option.value 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {option.label}
                    {sortOrder === option.value && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
