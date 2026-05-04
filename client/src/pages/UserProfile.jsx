import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  CreditCard, 
  Shield, 
  LogOut, 
  Camera, 
  ChevronRight,
  Clock,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const orders = [
    { id: '#LX-99283', date: 'Oct 24, 2023', total: '$1,250', status: 'Delivered', items: 1 },
    { id: '#LX-99102', date: 'Sep 12, 2023', total: '$349', status: 'Shipped', items: 2 },
  ];

  const sidebarItems = [
    { id: 'profile', name: 'Profile Info', icon: User },
    { id: 'orders', name: 'My Orders', icon: Package },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'security', name: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 p-10 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600 to-violet-700" />
              
              <div className="relative inline-block mt-4 mb-8">
                <div className="w-36 h-36 bg-white rounded-[2.5rem] p-1.5 shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full bg-indigo-50 rounded-[2rem] overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-3.5 bg-indigo-600 text-white rounded-2xl shadow-xl border-4 border-white hover:bg-indigo-700 transition-all z-20 active:scale-90">
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Felix Henderson</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em]">Verified Member</p>
                </div>
              </div>
              
              <div className="mt-12 pt-10 border-t border-gray-50 space-y-3">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-6 py-5 rounded-[1.5rem] font-bold transition-all duration-300 ${
                      activeTab === item.id 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-2' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
                      <span className="text-sm tracking-tight">{item.name}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeTab === item.id ? 'translate-x-0' : '-translate-x-4 opacity-0'}`} />
                  </button>
                ))}
              </div>

              <button className="w-full mt-10 flex items-center justify-center gap-3 px-6 py-5 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 rounded-[1.5rem] transition-all border-2 border-transparent hover:border-red-100">
                <LogOut className="w-5 h-5" />
                Logout Account
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <section className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 p-12 lg:p-16"
                >
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">Profile Details</h3>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <Settings className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label htmlFor="firstName" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">First Name</label>
                      <input id="firstName" type="text" className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:ring-0 focus:border-indigo-600 focus:bg-white transition-all font-bold text-gray-700 shadow-sm" defaultValue="Felix" />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="lastName" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Last Name</label>
                      <input id="lastName" type="text" className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:ring-0 focus:border-indigo-600 focus:bg-white transition-all font-bold text-gray-700 shadow-sm" defaultValue="Henderson" />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Email Address</label>
                      <input id="email" type="email" className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:ring-0 focus:border-indigo-600 focus:bg-white transition-all font-bold text-gray-700 shadow-sm" defaultValue="felix@luxemail.com" />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label htmlFor="bio" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Short Bio</label>
                      <textarea id="bio" className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:ring-0 focus:border-indigo-600 focus:bg-white transition-all font-bold text-gray-700 h-40 resize-none shadow-sm" defaultValue="Tech enthusiast and watch collector." />
                    </div>
                  </div>

                  <div className="mt-16 flex gap-4">
                    <button className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-100 transition-all active:scale-95">
                      Save Profile Updates
                    </button>
                    <button className="hidden sm:block bg-gray-50 hover:bg-gray-100 text-gray-600 px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all">
                      Discard Changes
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between px-4">
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter">My Orders</h3>
                    <div className="px-6 py-2 bg-white rounded-full border border-gray-100 text-sm font-black text-gray-400 uppercase tracking-widest">
                      {orders.length} TOTAL
                    </div>
                  </div>
                  
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                      <div className="p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                          <div className="w-20 h-20 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-indigo-600 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                            <Package className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-xl font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">{order.id}</p>
                            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">{order.date} • {order.items} Items Purchased</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-10">
                          <div className="text-right">
                            <p className="text-2xl font-black text-gray-900">{order.total}</p>
                            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mt-2 justify-end ${
                              order.status === 'Delivered' ? 'text-green-600' : 'text-indigo-600'
                            }`}>
                              {order.status === 'Delivered' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                              {order.status}
                            </div>
                          </div>
                          <button className="p-5 bg-gray-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90">
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
