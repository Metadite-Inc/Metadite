
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogIn, Menu, X, Bell, MessageSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const hasVipAccess = user?.membership_level === 'vip' || user?.membership_level === 'vvip';
  const hasPaidMembership = user?.membership_level !== 'free' && user?.membership_level;

  // Redirect admins and moderators away from regular navbar pages
  useEffect(() => {
    if (user?.role === 'admin' && location.pathname === '/') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    if (user?.role === 'moderator' && location.pathname === '/') {
      navigate('/moderator', { replace: true });
    }
  }, [user, navigate, location.pathname]);

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

  // Don't render for admin/moderator roles as they use StaffNavbar
  if (user?.role === 'admin' || user?.role === 'moderator') {
    return null;
  }

  return (
    <nav
      className={`glass-nav fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-0' : 'py-0'
      }`}
      style={{ height: '74px' }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        <Link
          to="/"
          className="flex items-center h-full"
        >
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
          <Link to="/" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Home</Link>
          <Link to="/models" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Models</Link>
          {!user && (
            <Link to="/upgrade" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Pricing</Link>
          )}
          {hasPaidMembership && (
            <Link to="/chat" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors flex items-center">
              Messages
            </Link>
          )}
          {hasVipAccess && (
            <Link to="/vip-content" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">VIP Content</Link>
          )}
          <ThemeToggle />
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {user?.role === "user" && (
                <Link to="/cart" className="text-gray-700 dark:text-gray-300 hover:text-metadite-primary transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              )}
              <UserMenu />
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              <LogIn className="h-4 w-4 mr-2" />
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
          <Link to="/" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Home</Link>
          <Link to="/models" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Models</Link>
          {!user && (
            <Link to="/upgrade" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Pricing</Link>
          )}
          {hasPaidMembership && (
            <Link to="/chat" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2 flex items-center" onClick={toggleMobileMenu}>
              Messages
            </Link>
          )}
          {hasVipAccess && (
            <Link to="/vip-content" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>VIP Content</Link>
          )}
          {user && (
            <Link to="/cart" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Cart</Link>
          )}
          {user && (
            <Link to="/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Dashboard</Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-center"
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