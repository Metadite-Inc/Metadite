
import React from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationIcon = ({ newMessage }) => {
  const navigate = useNavigate();

  return (
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
  );
};

export default NotificationIcon;
