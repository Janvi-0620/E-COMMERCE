import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { useAuthStore } from './useAuthStore';

const MOCK_OTP = '123456';

const OTPVerification = ({ onVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const { verifyOTP, isLoading, error, clearError } = useAuthStore();
  const [timer, setTimer] = useState(60);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);
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
      console.error('OTP error:', err);
    }
  };

  // Auto-fill the mock OTP
  const handleAutoFill = () => {
    setOtp(MOCK_OTP.split(''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-3">Two-Factor Auth</h2>
        <p className="text-gray-500 font-medium text-base">Enter the 6-digit verification code.</p>
      </div>

      {/* Mock OTP Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-5 bg-indigo-50 rounded-3xl border-2 border-indigo-100"
      >
        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3">
          🔧 Demo Mode — No real email sent
        </p>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-gray-500 text-xs font-bold mb-1">Your verification code is:</p>
            <p className="text-4xl font-black text-indigo-600 tracking-[0.4em]">{MOCK_OTP}</p>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            className="flex flex-col items-center gap-1 p-4 bg-white rounded-2xl border border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all group"
          >
            {copied ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <Copy className="w-6 h-6 text-indigo-400 group-hover:text-white" />
            )}
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-white">
              {copied ? 'Filled!' : 'Auto-fill'}
            </span>
          </button>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between gap-2">
          {otp.map((data, index) => (
            <input
              key={`otp-${index}`}
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 text-center"
          >
            {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={isLoading || otp.join('').length !== 6}
          className="w-full bg-gray-900 hover:bg-indigo-600 disabled:bg-gray-100 disabled:text-gray-400 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 shadow-2xl shadow-gray-200 transition-all active:scale-[0.98] group"
        >
          {isLoading ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Verify &amp; Enter
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-sm font-bold text-gray-400">
            Didn&apos;t receive the code?{' '}
            <button
              type="button"
              disabled={timer > 0}
              className="text-indigo-600 hover:underline disabled:opacity-40 disabled:no-underline font-black"
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
