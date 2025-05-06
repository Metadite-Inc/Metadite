
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  user: any;
  userRole?: string;
  hasVipAccess: boolean;
  handleLogout: () => void;
  theme?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  mobileMenuOpen,
  toggleMobileMenu,
  user,
  userRole,
  hasVipAccess,
  handleLogout,
  theme
}) => {
  if (!mobileMenuOpen) return null;

  return (
    <div className="md:hidden glass-card animate-slide-down absolute top-16 left-0 w-full py-4 px-6 flex flex-col space-y-4 bg-white dark:bg-gray-800 z-50">
      {userRole === 'moderator' ? (
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
          {userRole !== 'admin' && (
            <>
              <Link to="/" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Home</Link>
              <Link to="/models" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Models</Link>
              {!user && (
                <Link to="/upgrade" className="text-gray-800 dark:text-gray-200 hover:text-metadite-primary transition-colors py-2" onClick={toggleMobileMenu}>Pricing</Link>
              )}
              {userRole === 'regular' && (
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
          {userRole === 'admin' && (
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
  );
};

export default MobileMenu;
