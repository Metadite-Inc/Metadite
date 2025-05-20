import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';
import { createStripeSubscriptionSession } from '../lib/api/payment_api';
import { loadStripe } from '@stripe/stripe-js';

const SubscriptionCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const tierLevel = location.state?.tierLevel;
  const priceId = location.state?.priceId;

  useEffect(() => {
    const startSubscription = async () => {
      if (!tierLevel || !priceId) {
        toast.error('Missing subscription plan info.');
        navigate('/upgrade');
        return;
      }
      try {
        const data = {
          tier: tierLevel,
          priceId,
          success_url: window.location.origin + '/success-subscription',
          cancel_url: window.location.origin + '/cancel-subscription',
        };
        const result = await createStripeSubscriptionSession(data);
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        if (!stripe) throw new Error('Stripe.js failed to load');
        const { error } = await stripe.redirectToCheckout({ sessionId: result.id });
        if (error) {
          toast.error('Stripe redirect failed', { description: error.message });
        }
      } catch (err) {
        toast.error('Subscription failed', { description: err.message });
        navigate('/upgrade');
      }
    };
    startSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className={`flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : ''}`}>
        <div className={`glass-card rounded-xl p-10 text-center ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Processing your subscription...</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Please wait while we redirect you to the secure payment page.
          </p>
          <div className="animate-spin h-8 w-8 border-4 border-metadite-primary border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionCheckout;
