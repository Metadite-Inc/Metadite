
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const MobileMenu = ({ isOpen, onClose, user, handleLogout, hasVipAccess }) => {
  const { theme } = useTheme();
  
  if (!isOpen) return null;

  return (
    <div className={`md:hidden glass-card animate-slide-down absolute top-16 left-0 w-full py-4 px-6 flex flex-col space-y-4 bg-white ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90'}`}>
      {user?.role === 'moderator' ? (
        <>
          <Link to="/moderator" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={onClose}>Moderator</Link>
          {user && (
            <Link to="/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={onClose}>Dashboard</Link>
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
              <Link to="/" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={onClose}>Home</Link>
              <Link to="/models" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={onClose}>Models</Link>
              {!user && (
                <Link to="/upgrade" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={onClose}>Pricing</Link>
              )}
              {user?.role === 'regular' && (
                <Link to="/chat" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={onClose}>Chat</Link>
              )}
              {hasVipAccess && (
                <Link to="/vip-content" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={onClose}>VIP Content</Link>
              )}
              {user && (
                <Link to="/cart" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={onClose}>Cart</Link>
              )}
            </>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={onClose}>Admin</Link>
          )}
          {user && (
            <Link to="/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={onClose}>Dashboard</Link>
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
              onClick={onClose}
            >
              Login
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default MobileMenu;
