import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const Success = () => {
  const { theme } = useTheme();
  const { clearCart } = useCart();
  useEffect(() => {
    if (localStorage.getItem('cartShouldClear') === 'true') {
      clearCart();
      localStorage.removeItem('cartShouldClear');
    }
    // eslint-disable-next-line
  }, []);
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
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-500" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Order Confirmed!</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Thank you for your purchase. We've sent a confirmation email with your order details.
            </p>
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 mb-6`}>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Order number</div>
              <div className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>ORD-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
            <div className="space-y-4">
              <Link 
                to="/dashboard"
                className="block w-full bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-3 rounded-md hover:opacity-90 transition-opacity"
              >
                View Order Status
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

export default Success;
