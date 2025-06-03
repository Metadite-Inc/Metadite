
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu, X, ShoppingCart, MessageSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import useUnreadCount from '../hooks/useUnreadCount';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { unreadData } = useUnreadCount();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    toggleMobileMenu();
  };

  // Add fallback for undefined cartItems
  const cartItemCount = (cartItems || []).reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/models', label: 'Models' },
    ...(user && user.membership_level !== 'free' ? [{ to: '/vip', label: 'VIP Content' }] : []),
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <nav
      className={`glass-nav fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-0' : 'py-0'
      }`}
      style={{ height: '74px' }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        <Link to="/" className="flex items-center h-full">
          <img
            src="/logo.png"
            alt="Metadite Logo"
            className="h-12 w-auto mr-2"
          />
          <span className="hidden md:block text-2xl font-bold bg-gradient-to-r from-metadite-primary to-metadite-secondary bg-clip-text text-transparent">
            Metadite
          </span>
          <span className="md:hidden text-xl font-bold bg-gradient-to-r from-metadite-primary to-metadite-secondary bg-clip-text text-transparent">
            Metadite
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors flex items-center"
              >
                <MessageSquare className="h-5 w-5 mr-1" />
                Messages
                {unreadData.total_unread > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {unreadData.total_unread}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="relative text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors flex items-center"
              >
                <ShoppingCart className="h-5 w-5 mr-1" />
                Cart
                {cartItemCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <UserMenu />
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          <button className="text-gray-700 dark:text-gray-300" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass-card animate-slide-down absolute top-16 left-0 w-full py-4 px-6 flex flex-col space-y-4 bg-white">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2"
              onClick={toggleMobileMenu}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2 flex items-center"
                onClick={toggleMobileMenu}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Messages
                {unreadData.total_unread > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {unreadData.total_unread}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2 flex items-center"
                onClick={toggleMobileMenu}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                {cartItemCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              onClick={toggleMobileMenu}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
