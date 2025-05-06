
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Chat {
  id: string | number;
  sender: string;
  message: string;
  timestamp: string;
}

interface NotificationPanelProps {
  chatOpen: boolean;
  toggleChat: () => void;
  setNewMessage: (value: boolean) => void;
  newMessage: boolean;
  chats: Chat[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  chatOpen, 
  toggleChat, 
  setNewMessage, 
  newMessage, 
  chats 
}) => {
  return (
    <>
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
    </>
  );
};

export default NotificationPanel;
