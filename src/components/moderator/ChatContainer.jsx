import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import MessageInput from './MessageInput';

const ChatContainer = React.memo(({
  selectedModel,
  messages,
  loading,
  handleFlagMessage,
  handleDeleteMessage,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleTyping,
  isUploading,
  isLoaded,
  typingUsers,
  connectionStatus,
  messageEndRef,
  hasMoreMessages,
  loadMoreMessages,
  isLoadingMore,
  handleScroll
}) => {
  const { theme } = useTheme();

  if (!selectedModel) {
    return (
      <div className={`glass-card rounded-xl p-2 sm:p-4 text-center h-[600px] flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : ''
      }`}>
        <div>
          <MessageSquare className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
          <h2 className={`text-2xl font-medium mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Select a Model</h2>
          <p className={`mb-6 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Choose a model from the list to view and respond to conversations from users interested in that model.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-xl overflow-hidden h-[600px] flex flex-col chat-container transition-opacity duration-300 ${
      theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : ''
    } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <ChatHeader 
        selectedModel={selectedModel} 
        connectionStatus={connectionStatus}
      />
      
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 chat-messages-container" onScroll={handleScroll}>
        <ChatMessages 
          messages={messages} 
          loading={loading} 
          handleFlagMessage={handleFlagMessage}
          handleDeleteMessage={handleDeleteMessage}
          messageEndRef={messageEndRef}
          hasMoreMessages={hasMoreMessages}
          loadMoreMessages={loadMoreMessages}
          isLoadingMore={isLoadingMore}
          typingUsers={typingUsers}
        />
      </div>
      
      <MessageInput 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        handleTyping={handleTyping}
        selectedModel={selectedModel}
        isUploading={isUploading}
        connectionStatus={connectionStatus}
      />
    </div>
  );
});

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer;
