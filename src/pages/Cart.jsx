
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { items, clearCart, totalAmount, totalItems } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setIsClearing(true);
      try {
        await clearCart();
      } catch (error) {
        toast.error('Failed to clear cart');
      } finally {
        setIsClearing(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-24 pb-12 px-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
        <div className="container mx-auto max-w-6xl">
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Your Shopping Cart</h1>
          <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {totalItems > 0 
              ? `You have ${totalItems} item${totalItems === 1 ? '' : 's'} in your cart` 
              : 'Your cart is empty'}
          </p>
          
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className={`space-y-4 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button 
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                    disabled={isClearing}
                  >
                    {isClearing ? 'Clearing...' : 'Clear Cart'}
                  </button>
                  <Link 
                    to="/models"
                    className="text-metadite-primary hover:text-metadite-secondary transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className={`glass-card rounded-xl overflow-hidden transition-all duration-500 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
                    <h2 className="text-lg font-semibold">Order Summary</h2>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Subtotal ({totalItems} items)</span>
                        <span className="font-medium">
                          ${totalAmount.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Shipping</span>
                        <span className="font-medium">$Free</span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${(totalAmount).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Link
                        to="/checkout"
                        className="w-full flex items-center justify-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-3 px-4 rounded-md hover:opacity-90 transition-opacity"
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Link>
                    </div>
                    
                    <div className="mt-4 text-xs text-center text-gray-500">
                      By proceeding to checkout, you agree to our <Link to="/terms" className="text-metadite-primary">Terms</Link> and <Link to="/privacy" className="text-metadite-primary">Privacy Policy</Link>.
                    </div>
                  </div>
                </div>
                
                <div className="glass-card rounded-xl overflow-hidden mt-6 p-4">
                  <h3 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Accepted Payment Methods</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} rounded-md px-3 py-2 text-sm`}>Crypto</div>
                    <div className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} rounded-md px-3 py-2 text-sm`}>Credit/Debit Card</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`glass-card rounded-xl p-10 text-center transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <ShoppingBag className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
              <h2 className={`text-2xl font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Your cart is empty</h2>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link 
                to="/models"
                className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
              >
                Browse Models
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
