
import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileNavButtonsProps {
  user: any;
  userRole?: string;
  newMessage: boolean;
  toggleMobileMenu: () => void;
}

const MobileNavButtons: React.FC<MobileNavButtonsProps> = ({
  user,
  userRole,
  newMessage,
  toggleMobileMenu,
}) => {
  const navigate = useNavigate();

  return (
    <div className="md:hidden flex items-center space-x-4">
      {(userRole === 'user' || userRole === 'moderator') && (
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
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
};

export default MobileNavButtons;
