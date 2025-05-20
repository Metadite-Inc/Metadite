import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { XCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Cancel = () => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className={`flex-1 pt-24 pb-12 px-4 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-md animate-fade-in">
          <div className={`glass-card rounded-xl p-10 text-center ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Payment Cancelled</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Your payment was cancelled. You can try again or return to your cart to review your order.
            </p>
            <div className="space-y-4">
              <Link 
                to="/cart"
                className="block w-full bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-3 rounded-md hover:opacity-90 transition-opacity"
              >
                Return to Cart
              </Link>
              <Link 
                to="/"
                className={`block w-full border py-3 rounded-md transition-colors ${
                  theme === 'dark' 
                    ? 'border-gray-600 hover:bg-gray-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cancel;
