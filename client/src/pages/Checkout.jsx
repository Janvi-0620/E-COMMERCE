import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../features/cart/useCartStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../features/payment/StripePaymentForm';
import axios from 'axios';

// Replace with your real publishable key from Stripe Dashboard
const stripePromise = loadStripe('pk_test_placeholder');

const steps = [
  { id: 'shipping', title: 'Shipping', icon: Truck },
  { id: 'review', title: 'Review', icon: ShoppingBag },
  { id: 'payment', title: 'Payment', icon: CreditCard }
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [clientSecret, setClientSecret] = useState('');

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!shippingData.address || !shippingData.city) {
        alert('Please fill in shipping details');
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Create Payment Intent on the server
      try {
        // 1. First create the order (placeholder for real API call)
        // const { data } = await axios.post('/api/v1/orders', { ... });
        // const orderId = data.data._id;

        // 2. Create Payment Intent
        // const { data: paymentData } = await axios.post('/api/v1/payments/create-intent', { orderId });
        // setClientSecret(paymentData.data.clientSecret);
        
        // Mocking for now to show UI
        setClientSecret('pi_test_secret_placeholder');
        setCurrentStep(2);
      } catch (err) {
        alert('Failed to initialize payment');
      }
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    alert('Payment Successful!');
    clearCart();
    navigate('/order-success');
  };

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#4f46e5',
      borderRadius: '16px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (items.length === 0 && currentStep < 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black text-gray-900">Your cart is empty</h2>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 text-indigo-600 font-bold hover:underline"
        >
          Go back to shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  idx <= currentStep ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-200 text-gray-400'
                }`}>
                  {idx < currentStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={`absolute -bottom-7 text-xs font-bold whitespace-nowrap uppercase tracking-wider ${
                  idx <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-500 ${
                  idx < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-black text-gray-900">Shipping Details</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
                        placeholder="123 Luxury Ave"
                        value={shippingData.address}
                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          required
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
                          placeholder="New York"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code</label>
                        <input
                          type="text"
                          required
                          className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500"
                          placeholder="10001"
                          value={shippingData.postalCode}
                          onChange={(e) => setShippingData({...shippingData, postalCode: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-black text-gray-900">Review Order</h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <img src={item.images[0]?.url} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-black text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-indigo-50 rounded-2xl space-y-2">
                    <div className="flex justify-between font-medium text-indigo-900">
                      <span>Shipping to:</span>
                      <span className="font-bold">{shippingData.address}, {shippingData.city}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-indigo-900 pt-2 border-t border-indigo-100">
                      <span>Total Amount:</span>
                      <span>${getTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && clientSecret && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Elements stripe={stripePromise} options={options}>
                    <StripePaymentForm 
                      totalAmount={getTotalPrice()} 
                      onSuccess={handlePaymentSuccess} 
                    />
                  </Elements>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="mt-12 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 font-bold px-6 py-3 rounded-2xl transition-all ${
                  currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              
              {currentStep < 2 && (
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-200 transition-all active:scale-95"
                >
                  {currentStep === 1 ? 'Go to Payment' : 'Next Step'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
