import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShoppingBag, Github, Chrome } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/useAuthStore';
import OTPVerification from '../features/auth/OTPVerification';

import { Mail, Lock, ArrowRight, ShoppingBag, Github, Chrome, ShieldAlert } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../features/auth/useAuthStore';
import OTPVerification from '../features/auth/OTPVerification';

const Login = () => {
  const navigate = useNavigate();
  const { login, requiresTwoFactor, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (result && result.success) {
        navigate(email.toLowerCase().includes('admin') ? '/admin' : '/');
      }
    } catch (err) {
      // Error handled in store
    }
  };

  const handleVerified = () => {
    navigate(email.toLowerCase().includes('admin') ? '/admin' : '/');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[120px] opacity-60" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-violet-50 rounded-full blur-[120px] opacity-60" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl bg-white/80 backdrop-blur-3xl rounded-[4rem] shadow-2xl shadow-gray-200/50 overflow-hidden flex relative z-10 border border-white"
      >
        {/* Left Side: Brand Experience */}
        <div className="hidden lg:flex w-1/2 bg-gray-900 p-24 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-4 text-white mb-20 group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:bg-indigo-600 transition-all duration-500 group-hover:rotate-12">
                <ShoppingBag className="w-8 h-8 text-gray-900 group-hover:text-white" />
              </div>
              <span className="text-3xl font-black tracking-tighter uppercase">Luxe<span className="opacity-40">Store</span></span>
            </Link>
            
            <h1 className="text-7xl font-black text-white leading-[0.95] tracking-tighter mb-10">
              The Art of <br />
              <span className="text-indigo-500 italic">Authentic</span> <br />
              Living.
            </h1>
            <p className="text-gray-400 text-xl font-medium max-w-sm leading-relaxed">
              Secure access to your personal collection and exclusive member benefits.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6">
            <div className="flex -space-x-6">
              {[1, 2, 3, 4].map(i => (
                <img 
                  key={i}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} 
                  className="w-16 h-16 rounded-[1.5rem] border-4 border-gray-900 bg-gray-800"
                  alt="User"
                />
              ))}
            </div>
            <div>
              <p className="text-white text-lg font-black tracking-tight">Join the Elite</p>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Verified Community</p>
            </div>
          </div>
        </div>

        {/* Right Side: Identity Auth */}
        <div className="w-full lg:w-1/2 p-16 sm:p-24 flex flex-col justify-center bg-white/50">
          <AnimatePresence mode="wait">
            {!requiresTwoFactor ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="w-full max-w-md mx-auto"
              >
                <div className="mb-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 border border-gray-100 shadow-sm">
                    <Lock className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Authentication</h2>
                  <p className="text-gray-400 font-medium text-lg">Enter your credentials to proceed to the secure zone.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Identity (Email)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-16 pr-6 py-6 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 focus:ring-0 text-base font-bold text-gray-900 transition-all outline-none shadow-sm"
                        placeholder="master@luxe.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Access Key</label>
                      <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Reset Key</button>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-16 pr-6 py-6 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 focus:ring-0 text-base font-bold text-gray-900 transition-all outline-none shadow-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-red-50 text-red-600 text-sm font-black rounded-2xl border border-red-100 flex items-center gap-4"
                    >
                      <ShieldAlert className="w-6 h-6" />
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gray-900 hover:bg-indigo-600 text-white py-7 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-gray-200 transition-all active:scale-[0.98] group"
                  >
                    {isLoading ? (
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Grant Access
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-16 text-center">
                  <p className="text-sm font-bold text-gray-400">
                    Not a member? {' '}
                    <Link to="/register" className="text-indigo-600 hover:underline decoration-2 underline-offset-4 font-black">Register Identity</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <OTPVerification onVerified={handleVerified} />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
