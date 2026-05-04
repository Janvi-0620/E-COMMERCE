import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  Plus, 
  Search, 
  ArrowUpRight,
  ArrowDownRight,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Revenue', value: '$128,430', change: '+12.5%', isUp: true, icon: BarChart3 },
    { title: 'Active Orders', value: '432', change: '+8.2%', isUp: true, icon: ShoppingBag },
    { title: 'Total Products', value: '1,240', change: '-2.4%', isUp: false, icon: Package },
    { title: 'New Customers', value: '84', change: '+15.3%', isUp: true, icon: Users },
  ];

  const recentOrders = [
    { id: '#ORD-7721', customer: 'Alex Rivera', product: 'Classic Chronograph', amount: '$1,250', status: 'Delivered' },
    { id: '#ORD-7722', customer: 'Sarah Chen', product: 'Pro Wireless Headphones', amount: '$349', status: 'Processing' },
    { id: '#ORD-7723', customer: 'James Wilson', product: 'Minimalist Wallet', amount: '$89', status: 'Shipped' },
    { id: '#ORD-7724', customer: 'Elena Rodriguez', product: 'Smart Desk Lamp', amount: '$199', status: 'Pending' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-600';
      case 'Processing': return 'bg-blue-50 text-blue-600';
      case 'Shipped': return 'bg-indigo-50 text-indigo-600';
      default: return 'bg-yellow-50 text-yellow-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col hidden lg:flex shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">
              Luxe<span className="text-indigo-600">Admin</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { id: 'overview', name: 'Overview', icon: LayoutDashboard },
            { id: 'products', name: 'Products', icon: Package },
            { id: 'orders', name: 'Orders', icon: ShoppingBag },
            { id: 'customers', name: 'Customers', icon: Users },
            { id: 'analytics', name: 'Analytics', icon: BarChart3 },
            { id: 'settings', name: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] font-bold transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-2' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm tracking-tight">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-[2rem] relative overflow-hidden shadow-2xl shadow-indigo-100">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-2">System Status</p>
              <p className="text-sm font-bold text-white mb-5 leading-relaxed">Your store is performing 15% better than last month.</p>
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Full Report
              </button>
            </div>
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 h-24 flex items-center justify-between px-10">
          <div className="flex items-center gap-5 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 w-full max-w-lg focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search orders, products, customers..." 
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 w-full placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-8">
            <button className="relative p-3 hover:bg-gray-50 rounded-2xl transition-all group">
              <Bell className="w-6 h-6 text-gray-400 group-hover:text-indigo-600" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
            </button>
            <div className="h-10 w-px bg-gray-100" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 tracking-tight">Admin Master</p>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5">Super User</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-lg ring-4 ring-gray-50">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Business Overview</h2>
              <p className="text-gray-500 font-medium mt-2 text-base">Real-time performance metrics and recent activities.</p>
            </div>
            <div className="flex gap-4">
              <button className="bg-white border-2 border-gray-100 text-gray-600 px-6 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:bg-gray-50 transition-all">
                Export Data
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-indigo-100 transition-all active:scale-95">
                <Plus className="w-5 h-5" />
                Add New Product
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-14 h-14 bg-gray-50 rounded-[1.25rem] flex items-center justify-center group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-xl group-hover:shadow-indigo-100">
                    <stat.icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl ${
                    stat.isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {stat.isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {stat.change}
                  </div>
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.title}</p>
                  <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-gray-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 ease-out" />
              </motion.div>
            ))}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-10 flex items-center justify-between border-b border-gray-50">
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter">Live Transactions</h3>
                <button className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] hover:underline decoration-2 underline-offset-4">Browse All Orders</button>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full">
                  <thead>
                    <tr className="text-left bg-gray-50/50">
                      <th className="pl-10 pr-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Reference</th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Name</th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Selection</th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery State</th>
                      <th className="pl-6 pr-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map((order, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors group cursor-default">
                        <td className="pl-10 pr-6 py-6 text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{order.id}</td>
                        <td className="px-6 py-6 text-sm font-bold text-gray-600">{order.customer}</td>
                        <td className="px-6 py-6 text-sm font-medium text-gray-400">{order.product}</td>
                        <td className="px-6 py-6">
                          <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="pl-6 pr-10 py-6 text-sm font-black text-gray-900 text-right">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-10 flex flex-col">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-10">Best Sellers</h3>
              <div className="space-y-8 flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-5 group cursor-pointer">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={`https://images.unsplash.com/photo-152${i}592094714-0f0654e20314?auto=format&fit=crop&q=80&w=100&h=100`} 
                        alt="Product" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors">Premium Collection Vol {i}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-1 h-1 bg-green-500 rounded-full" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">1.2k+ Unit Sales</p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900">$1,250</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-5 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 font-bold hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600 transition-all">
                Download Sales Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
