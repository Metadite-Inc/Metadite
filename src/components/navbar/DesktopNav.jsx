
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import NotificationIcon from './NotificationIcon';

const DesktopNav = ({ user, hasVipAccess, newMessage, theme }) => {
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
                <NotificationIcon newMessage={newMessage} />
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
