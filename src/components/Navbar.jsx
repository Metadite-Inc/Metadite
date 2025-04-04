import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogIn, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Check if user has VIP access
  const hasVipAccess = user?.membershipLevel === 'vip' || user?.membershipLevel === 'vvip';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`glass-nav fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-metadite-primary to-metadite-secondary bg-clip-text text-transparent">Metadite</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {user?.role === 'moderator' ? (
            <>
              <Link to="/moderator" className="text-gray-800 hover:text-metadite-primary transition-colors">Moderator</Link>
              <Link to="/dashboard" className="text-gray-800 hover:text-metadite-primary transition-colors">Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-800 hover:text-metadite-primary transition-colors">Home</Link>
              <Link to="/models" className="text-gray-800 hover:text-metadite-primary transition-colors">Models</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-800 hover:text-metadite-primary transition-colors">Admin</Link>
              )}
              {hasVipAccess && (
                <Link to="/vip-content" className="text-gray-800 hover:text-metadite-primary transition-colors">VIP Content</Link>
              )}
            </>
          )}
        </div>
        
        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            user?.role === 'moderator' ? (
              <>
                <Link to="/dashboard" className="p-2 text-gray-700 hover:text-metadite-primary transition-colors">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/cart" className="relative p-2 text-gray-700 hover:text-metadite-primary transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-metadite-accent text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse-soft">2</span>
                </Link>
                <Link to="/dashboard" className="p-2 text-gray-700 hover:text-metadite-primary transition-colors">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  Logout
                </button>
              </>
            )
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
        
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card animate-slide-down absolute top-16 left-0 w-full py-4 px-6 flex flex-col space-y-4 bg-white">
          {user?.role === 'moderator' ? (
            <>
              <Link to="/moderator" className="text-gray-800 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Moderator</Link>
              <Link to="/dashboard" className="text-gray-800 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Dashboard</Link>
              <button
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                }}
                className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-800 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Home</Link>
              <Link to="/models" className="text-gray-800 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Models</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-800 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Admin</Link>
              )}
              {hasVipAccess && (
                <Link to="/vip-content" className="text-gray-800 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>VIP Content</Link>
              )}
              <Link to="/cart" className="text-gray-800 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Cart</Link>
              <Link to="/dashboard" className="text-gray-800 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Dashboard</Link>
              <button
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                }}
                className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
