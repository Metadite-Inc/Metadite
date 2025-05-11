
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogIn, Menu, X, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleChat = () => setChatOpen(!chatOpen);

  const hasVipAccess = user?.membershipLevel === 'vip' || user?.membershipLevel === 'vvip';

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
    setChats([
      { id: 1, sender: 'Moderator', message: 'Hello! How can I assist you?', timestamp: '10:30 AM' },
      { id: 2, sender: 'You', message: 'I need help with my subscription.', timestamp: '10:32 AM' },
    ]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNewMessage(true);
      setChats((prevChats) => [
        ...prevChats,
        { id: 3, sender: 'Moderator', message: 'Sure! Let me check that for you.', timestamp: '10:35 AM' },
      ]);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout(); // Log the user out
    navigate('/'); // Redirect to the home page
    toggleMobileMenu(); // Close the mobile menu if it's open
  };

  return (
    <nav
      className={`glass-nav fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-0' : 'py-0'
      }`}
      style={{ height: '74px' }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        {user?.role === 'regular' && (
          <button
            onClick={() => navigate('/chat')}
            className="absolute top-2 right-4 p-2 text-gray-700 dark:text-gray-300 hover:text-metadite-primary transition-colors"
          >
            <Bell className="h-5 w-5" />
            {newMessage && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                1
              </span>
            )}
          </button>
        )}
        <Link
          to={user?.role === 'moderator' ? '/moderator' : '/'}
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
          {user?.role === 'moderator' ? (
            <>
              <Link to="/moderator" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Moderator</Link>
              <Link to="/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Dashboard</Link>
            </>
          ) : (
            <>
              {user?.role !== 'admin' && (
                <>
                  <Link to="/" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Home</Link>
                  <Link to="/models" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Models</Link>
                  {!user && (
                    <Link to="/upgrade" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Pricing</Link>
                  )}
                  {user?.role === 'regular' && (
                    <button
                      onClick={() => navigate('/chat')}
                      className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-metadite-primary transition-colors"
                    >
                      <Bell className="h-5 w-5" />
                      {newMessage && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">1</span>
                      )}
                    </button>
                  )}
                  {hasVipAccess && (
                    <Link to="/vip-content" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">VIP Content</Link>
                  )}
                </>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Admin</Link>
              )}
              <ThemeToggle />
            </>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {user?.role !== 'admin' && (
                <button
                  onClick={toggleChat}
                  className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-metadite-primary transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {newMessage && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      1
                    </span>
                  )}
                </button>
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
          {(user?.role === 'user' || user?.role === 'moderator') && (
            <button
              onClick={() => navigate('/chat')}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-metadite-primary transition-colors"
            >
              <Bell className="h-5 w-5" />
              {newMessage && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          )}
          <button className="text-gray-700 dark:text-gray-300" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden glass-card animate-slide-down absolute top-16 left-0 w-full py-4 px-6 flex flex-col space-y-4 bg-white">
          {user?.role === 'moderator' ? (
            <>
              <Link to="/moderator" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Moderator</Link>
              {user && (
                <Link to="/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Dashboard</Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {user?.role !== 'admin' && (
                <>
                  <Link to="/" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Home</Link>
                  <Link to="/models" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Models</Link>
                  {!user && (
                    <Link to="/upgrade" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Pricing</Link>
                  )}
                  {user?.role === 'regular' && (
                    <Link to="/chat" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Chat</Link>
                  )}
                  {hasVipAccess && (
                    <Link to="/vip-content" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>VIP Content</Link>
                  )}
                  {user && (
                    <Link to="/cart" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Cart</Link>
                  )}
                </>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Admin</Link>
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
            </>
          )}
        </div>
      )}

      {chatOpen && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-96 max-h-80 p-4 z-50">
          <h3 className="text-lg font-semibold mb-3">Chats</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {chats.map((chat) => (
              <div key={chat.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                <p className="text-sm font-medium">{chat.sender}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{chat.message}</p>
                <p className="text-xs text-gray-400">{chat.timestamp}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setNewMessage(false)}
            className="mt-3 w-full bg-metadite-primary text-white py-2 rounded-md hover:bg-metadite-secondary transition"
          >
            Mark as Read
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
