import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { XCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CancelSubscription = () => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className={`flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : ''}`}>
        <div className={`glass-card rounded-xl p-10 text-center ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Subscription Cancelled</h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Your subscription upgrade was cancelled. No changes have been made to your account.<br />
            If this was a mistake, you can try again at any time.
          </p>
          <Link
            to="/upgrade"
            className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            Back to Upgrade
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CancelSubscription;
