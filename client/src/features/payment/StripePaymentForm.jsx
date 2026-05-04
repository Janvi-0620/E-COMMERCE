import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, ArrowRight } from 'lucide-react';

const StripePaymentForm = ({ totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL is usually used for redirect-based payments
        return_url: `${window.location.origin}/order-success`,
      },
      redirect: 'if_required'
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Total to Pay</p>
            <p className="text-2xl font-black text-gray-900">${totalAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secure Payment</p>
          <p className="text-sm font-bold text-gray-600">Encrypted by Stripe</p>
        </div>
      </div>

      <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-sm font-bold"
        >
          <AlertCircle className="w-4 h-4" />
          {message}
        </motion.div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Pay Now
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};

export default StripePaymentForm;
