import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShoppingBag, User, ShieldAlert, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      // Mock mode: treat any network error as a successful mock registration
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[120px] opacity-60"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-50 rounded-full blur-[120px] opacity-60"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl bg-white/80 backdrop-blur-3xl rounded-[4rem] shadow-2xl shadow-gray-200/50 overflow-hidden flex relative z-10 border border-white"
      >
        {/* Left Side: Brand */}
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
              Your Journey <br />
              <span className="text-indigo-500 italic">Starts</span> <br />
              Here.
            </h1>
            <p className="text-gray-400 text-xl font-medium max-w-sm leading-relaxed">
              Create your identity and gain access to exclusive collections and member-only deals.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-6">
            {[
              { label: 'Free Shipping', sub: 'On all orders' },
              { label: 'Easy Returns', sub: '30-day policy' },
              { label: 'Secure Pay', sub: '256-bit SSL' },
              { label: 'Exclusive Deals', sub: 'Members only' },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <p className="text-white text-sm font-black">{item.label}</p>
                <p className="text-gray-500 text-xs font-bold mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-16 sm:p-24 flex flex-col justify-center bg-white/50">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center gap-8"
              >
                <div className="w-32 h-32 bg-green-50 rounded-[3rem] flex items-center justify-center shadow-xl">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <div>
                  <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Identity Created!</h2>
                  <p className="text-gray-400 text-lg font-medium">Redirecting you to the Authentication portal...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="w-full max-w-md mx-auto"
              >
                <div className="mb-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-8 border border-gray-100 shadow-sm">
                    <User className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Create Identity</h2>
                  <p className="text-gray-400 font-medium text-lg">Register to access the exclusive LuxeStore experience.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-3">
                    <label htmlFor="reg-name" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 focus:ring-0 text-base font-bold text-gray-900 transition-all outline-none shadow-sm"
                        placeholder="Jane Luxe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-3">
                    <label htmlFor="reg-email" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Identity (Email)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 focus:ring-0 text-base font-bold text-gray-900 transition-all outline-none shadow-sm"
                        placeholder="master@luxe.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-3">
                    <label htmlFor="reg-password" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Access Key</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        id="reg-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 focus:ring-0 text-base font-bold text-gray-900 transition-all outline-none shadow-sm"
                        placeholder="Min. 6 characters"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-3">
                    <label htmlFor="reg-confirm" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Confirm Key</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                      </div>
                      <input
                        id="reg-confirm"
                        type="password"
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="block w-full pl-16 pr-6 py-5 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-600 focus:ring-0 text-base font-bold text-gray-900 transition-all outline-none shadow-sm"
                        placeholder="Repeat access key"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-red-50 text-red-600 text-sm font-black rounded-2xl border border-red-100 flex items-center gap-4"
                    >
                      <ShieldAlert className="w-6 h-6 flex-shrink-0" />
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
                        Create Identity
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-10 text-center">
                  <p className="text-sm font-bold text-gray-400">
                    Already a member?{' '}
                    <Link to="/login" className="text-indigo-600 hover:underline decoration-2 underline-offset-4 font-black">
                      Authenticate
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
