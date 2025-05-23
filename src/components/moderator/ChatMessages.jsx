
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import MessageItem from '../MessageItem';

const ChatMessages = ({ 
  messages, 
  loading, 
  handleFlagMessage, 
  handleDeleteMessage,
  messageEndRef, 
  hasMoreMessages,
  loadMoreMessages,
  isLoadingMore,
  typingUsers,
  connectionStatus
}) => {
  const { theme } = useTheme();

  // Connection status indicator
  const renderConnectionStatus = () => {
    if (connectionStatus === 'connected') {
      return (
        <div className="text-center py-1 bg-green-500 text-white text-xs font-medium rounded-b-lg animate-fade-in">
          Connected
        </div>
      );
    } else if (connectionStatus === 'connecting') {
      return (
        <div className="text-center py-1 bg-yellow-500 text-white text-xs font-medium rounded-b-lg animate-fade-in">
          Connecting...
        </div>
      );
    } else if (connectionStatus === 'disconnected' || connectionStatus === 'error') {
      return (
        <div className="text-center py-1 bg-red-500 text-white text-xs font-medium rounded-b-lg animate-fade-in">
          {connectionStatus === 'error' ? 'Connection Error' : 'Disconnected'}
        </div>
      );
    }
    return null;
  };

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
    <div className="space-y-4">
      {/* Connection status */}
      {renderConnectionStatus()}
      
      {/* Load more button */}
      {hasMoreMessages && (
        <div className="text-center my-2">
          <button
            onClick={loadMoreMessages}
            disabled={isLoadingMore}
            className={`px-4 py-1 text-xs rounded-full ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            {isLoadingMore ? (
              <span className="inline-block h-3 w-3 rounded-full border-2 border-current border-r-transparent animate-spin mr-1"></span>
            ) : null}
            {isLoadingMore ? 'Loading...' : 'Load older messages'}
          </button>
        </div>
      )}
      
      {/* Messages */}
      <div className="space-y-6">
        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message} 
            onFlag={handleFlagMessage ? () => handleFlagMessage(message.id) : null}
            onDelete={handleDeleteMessage ? () => handleDeleteMessage(message.id) : null}
          />
        ))}
      </div>
      
      {/* Typing indicator */}
      {typingUsers && typingUsers.size > 0 && (
        <div className={`px-4 py-2 rounded-lg w-auto inline-block ${
          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span className="text-xs">Someone is typing...</span>
          </div>
        </div>
      )}
      
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatMessages;
