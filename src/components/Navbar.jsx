
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import Logo from './navbar/Logo';
import NotificationPanel from './navbar/NotificationPanel';
import MobileMenu from './navbar/MobileMenu';
import DesktopNav from './navbar/DesktopNav';
import MobileNavButtons from './navbar/MobileNavButtons';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleChat = () => setChatOpen(!chatOpen);

  const hasVipAccess = user?.membershipLevel === 'vip' || user?.membershipLevel === 'vvip';

  // Admin redirect
  useEffect(() => {
    if (user?.role === 'admin' && window.location.pathname === '/') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  // Moderator redirect
  useEffect(() => {
    if (user?.role === 'moderator' && window.location.pathname === '/') {
      navigate('/moderator', { replace: true });
    }
  }, [user, navigate]);

  // Initialize sample chats
  useEffect(() => {
    setChats([
      { id: 1, sender: 'Moderator', message: 'Hello! How can I assist you?', timestamp: '10:30 AM' },
      { id: 2, sender: 'You', message: 'I need help with my subscription.', timestamp: '10:32 AM' },
    ]);
  }, []);

  // Simulate new message after delay
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

  // Handle scroll for navbar styling
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

  return (
    <nav
      className={`glass-nav fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-0' : 'py-0'
      }`}
      style={{ height: '74px' }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        {/* User notification button (top-right mobile) */}
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
        
        {/* Logo */}
        <Logo userRole={user?.role} />

        {/* Desktop Navigation */}
        <DesktopNav 
          user={user} 
          userRole={user?.role}
          hasVipAccess={hasVipAccess}
          toggleChat={toggleChat}
          newMessage={newMessage}
        />

        {/* Mobile Navigation Buttons */}
        <MobileNavButtons 
          user={user}
          userRole={user?.role}
          newMessage={newMessage}
          toggleMobileMenu={toggleMobileMenu}
        />
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        user={user}
        userRole={user?.role}
        hasVipAccess={hasVipAccess}
        handleLogout={handleLogout}
      />

      {/* Notification Panel */}
      {chatOpen && (
        <NotificationPanel 
          chatOpen={chatOpen}
          toggleChat={toggleChat}
          setNewMessage={setNewMessage}
          newMessage={newMessage}
          chats={chats}
        />
      )}
    </nav>
  );
};

export default Navbar;
