import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, ShoppingCart, Heart, User, Home, MessageCircle, Baby } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import useUnreadCount from '../hooks/useUnreadCount';
import { useMemo, useState } from 'react';
import { newsletterApi } from '../lib/api/newsletter_api';

const Footer = () => {
  const { user } = useAuth();
  const { unreadData } = useUnreadCount();
  const { cartItems } = useCart();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Memoize the cart item count calculation
  const cartItemCount = useMemo(() => (cartItems || []).reduce((total, item) => total + item.quantity, 0), [cartItems]);

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    setIsSubscribing(true);
    try {
      await newsletterApi.subscribeToNewsletter(email.trim());
      setEmail(''); // Clear the input after successful subscription
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubscribing(false);
    }
  };
  return (
    <>
      <footer className="bg-gradient-to-r from-metadite-dark to-metadite-primary text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <img src="/logo.png" alt="Metadite" className="w-32 h-auto" />
              <span className="px-4 hidden md:block text-2xl font-bold bg-gradient-to-r from-metadite-primary to-metadite-secondary bg-clip-text text-transparent">Metadite</span>
              {/* Logo Text for Mobile */}
              <span className="px-5 md:hidden text-xl font-bold bg-gradient-to-r from-metadite-primary to-metadite-secondary bg-clip-text text-transparent">Metadite</span>
              <p className="text-gray-300">Premium model content platform with exclusive access to your favorite models.</p>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-white hover:text-metadite-accent transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-metadite-accent transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-metadite-accent transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-metadite-accent transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/models" className="text-gray-300 hover:text-white transition-colors">Models</Link></li>
                {/*<li><Link to="/vip-content" className="text-gray-300 hover:text-white transition-colors">VIP Content</Link></li>*/}
                <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login / Sign Up</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Support</h4>
              <ul className="space-y-2">
                <li><a href="Help" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="Contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="FAQ" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
                <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Newsletter</h4>
              <p className="text-gray-300">Subscribe to receive updates and special offers.</p>
              <form onSubmit={handleNewsletterSubscribe} className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 rounded-l-md text-gray-800 w-full focus:outline-none"
                  required
                />
                <button 
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-metadite-accent hover:bg-opacity-90 transition-colors px-4 py-2 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
          
          <div className="pb-10 border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Metadite. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      {(!user || (user && user.role === 'user')) && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center py-2 z-50">
          <Link to="/models" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-metadite-primary transition-colors">
            <Baby className="h-6 w-6" />
            <span className="text-xs mt-1 text-[10px]">Dolls</span>
          </Link>
          {/*<Link to="/chat" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-metadite-primary transition-colors">
            <div className="relative">
              <MessageCircle className="h-6 w-6" />
              {unreadData.total_unread > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 h-5 min-w-[20px] flex items-center justify-center">
                  {unreadData.total_unread}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 text-[10px]">Messages</span>
          </Link>*/}
          <Link to="/cart" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-metadite-primary transition-colors">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
            <span className="text-xs mt-1 text-[10px]">Cart</span>
          </Link>
          <Link to="/dashboard?tab=favorites" className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-metadite-primary transition-colors">
            <Heart className="h-6 w-6" />
            <span className="text-xs mt-1 text-[10px]">Favorites</span>
          </Link>
          <Link 
            to={user ? "/dashboard" : "/login"} 
            className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-metadite-primary transition-colors"
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1 text-[10px]">Me</span>
          </Link>
        </div>
      )}
    </>
  );
};

export default Footer;
