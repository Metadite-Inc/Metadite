
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const DesktopNav = ({ user, hasVipAccess, toggleChat, newMessage, theme }) => {
  return (
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
  );
};

export default DesktopNav;
