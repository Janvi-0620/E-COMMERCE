import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuthStore } from './useAuthStore';

const OTPVerification = ({ onVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const { verifyOTP, isLoading, error, clearError } = useAuthStore();
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;

    try {
      await verifyOTP(otpValue);
      onVerified();
    } catch (err) {
      // Error handled in store
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-100">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Two-Factor Authentication</h2>
        <p className="text-gray-500 font-medium">We've sent a 6-digit code to your email.</p>
        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-2 bg-indigo-50 inline-block px-3 py-1 rounded-full">
          Check console in Mock Mode
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between gap-2">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-16 sm:w-14 sm:h-20 text-center text-2xl font-black text-indigo-600 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-600 focus:ring-0 transition-all outline-none shadow-sm"
              disabled={isLoading}
            />
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 text-center animate-shake">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || otp.join('').length !== 6}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-indigo-100 transition-all active:scale-[0.98] group"
        >
          {isLoading ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Verify & Secure Login
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-sm font-bold text-gray-400">
            Didn't receive the code? {' '}
            <button 
              type="button"
              disabled={timer > 0}
              className="text-indigo-600 hover:underline disabled:opacity-50 disabled:no-underline"
              onClick={() => { setTimer(60); clearError(); }}
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default OTPVerification;
