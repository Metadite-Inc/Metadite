
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatPanel from './ChatPanel';

const NotificationIcon = ({ newMessage }) => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, sender: 'Moderator', message: 'Hello! How can I assist you?', timestamp: '10:30 AM' },
    { id: 2, sender: 'You', message: 'I need help with my subscription.', timestamp: '10:32 AM' },
    { id: 3, sender: 'Moderator', message: 'Sure! Let me check that for you.', timestamp: '10:35 AM' },
  ]);

  const toggleChat = () => setChatOpen(!chatOpen);
  
  const handleMarkAsRead = () => {
    setChatOpen(false);
    if (newMessage) {
      // Pass this function up to parent component to handle the state change
      return;
    }
  };

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
      <ChatPanel 
        isOpen={chatOpen} 
        chats={chats} 
        setNewMessage={handleMarkAsRead} 
      />
    </>
  );
};

export default NotificationIcon;
