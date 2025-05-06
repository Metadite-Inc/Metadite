
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, LogIn } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import UserMenu from '../UserMenu';

interface DesktopNavProps {
  user: any;
  userRole?: string;
  hasVipAccess: boolean;
  toggleChat: () => void;
  newMessage: boolean;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ 
  user, 
  userRole, 
  hasVipAccess, 
  toggleChat, 
  newMessage 
}) => {
  return (
    <>
      <div className="hidden md:flex items-center space-x-8">
        {userRole === 'moderator' ? (
          <>
            <Link to="/moderator" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Moderator</Link>
            <Link to="/dashboard" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Dashboard</Link>
          </>
        ) : (
          <>
            {userRole !== 'admin' && (
              <>
                <Link to="/" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Home</Link>
                <Link to="/models" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Models</Link>
                {!user && (
                  <Link to="/upgrade" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Pricing</Link>
                )}
                {hasVipAccess && (
                  <Link to="/vip-content" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">VIP Content</Link>
                )}
              </>
            )}
            {userRole === 'admin' && (
              <Link to="/admin" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors">Admin</Link>
            )}
            <ThemeToggle />
          </>
        )}
      </div>

      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <>
            {userRole !== 'admin' && (
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
    </>
  );
};

export default DesktopNav;
