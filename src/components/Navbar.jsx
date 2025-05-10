
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './navbar/MobileMenu';
import ChatPanel from './navbar/ChatPanel';
import DesktopNav from './navbar/DesktopNav';
import NotificationIcon from './navbar/NotificationIcon';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState(false);
  const { theme } = useTheme();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleChat = () => setChatOpen(!chatOpen);

  const hasVipAccess = user?.membershipLevel === 'vip' || user?.membershipLevel === 'vvip';

  useEffect(() => {
    if (user?.role === 'admin' && window.location.pathname === '/') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.role === 'moderator' && window.location.pathname === '/') {
      navigate('/moderator', { replace: true });
    }
  }, [user, navigate]);

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
          <NotificationIcon newMessage={newMessage} />
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

        {/* Desktop Navigation */}
        <DesktopNav 
          user={user} 
          hasVipAccess={hasVipAccess} 
          toggleChat={toggleChat} 
          newMessage={newMessage}
          theme={theme}
        />

        {/* Desktop User Menu & Buttons */}
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
              <span className="h-4 w-4 mr-2" />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          {(user?.role === 'user' || user?.role === 'moderator') && (
            <NotificationIcon newMessage={newMessage} />
          )}
          <button className="text-gray-700 dark:text-gray-300" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={toggleMobileMenu} 
        user={user} 
        handleLogout={handleLogout}
        hasVipAccess={hasVipAccess} 
      />

      {/* Chat Panel */}
      <ChatPanel 
        isOpen={chatOpen} 
        chats={chats} 
        setNewMessage={setNewMessage} 
      />
    </nav>
  );
};

export default Navbar;
