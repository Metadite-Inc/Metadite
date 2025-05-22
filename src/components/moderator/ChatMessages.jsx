
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import MessageItem from '../MessageItem';

const ChatMessages = ({ messages, loading, handleFlagMessage, messageEndRef }) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-metadite-primary mx-auto mb-2"></div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-6">
          <MessageSquare className={`h-10 w-10 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>No messages yet</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Start the conversation by sending a message.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message} 
          onFlag={() => handleFlagMessage(message.id)}
        />
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatMessages;
