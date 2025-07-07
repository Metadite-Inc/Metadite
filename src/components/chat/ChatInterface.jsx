import React, { useMemo } from 'react';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import MessageItem from '../MessageItem';
import { Textarea } from "@/components/ui/textarea";
import { Send } from 'lucide-react';

const ChatInterface = React.memo(({
  selectedRoom,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleTyping,
  handleDeleteMessage,
  handleScroll,
  loadMoreMessages,
  hasMoreMessages,
  isLoadingMore,
  typingUsers,
  connectionStatus,
  isUploading,
  messageEndRef,
  onBackToChatList,
  isMobile
}) => {
  const { theme } = useTheme();

  // NEW: Memoized sorted messages to prevent unnecessary re-sorting
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => a.id - b.id);
  }, [messages]);

  if (!selectedRoom) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
          <h2 className={`text-2xl font-medium mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            Select a conversation
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Choose a conversation from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col chat-container">
      {/* Header */}
      <div className={`p-2 sm:p-4 border-b flex items-center justify-between ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
      }`}>
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={onBackToChatList}
              className={`mr-3 p-1 rounded-full ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img
              src={selectedRoom.modelImage}
              alt={selectedRoom.modelName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/200?text=Model';
              }}
            />
          </div>
          <div>
            <h2 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
              {selectedRoom.modelName}
            </h2>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className={`relative w-3 h-3 rounded-full mr-2 ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500' :
            'bg-red-500'
          }`}>
            {connectionStatus === 'connecting' && (
              <span className="absolute inset-0 rounded-full bg-yellow-500 animate-ping opacity-75"></span>
            )}
          </div>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {connectionStatus === 'connected' ? 'Online' : 
             connectionStatus === 'connecting' ? 'Connecting...' :
             connectionStatus === 'error' ? 'Error' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 chat-messages-container" onScroll={handleScroll}>
        {hasMoreMessages && (
          <div className="text-center my-2">
            <button
              onClick={loadMoreMessages}
              disabled={isLoadingMore}
              className={`px-4 py-1 text-xs rounded-full transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:opacity-50' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50'
              }`}
            >
              {isLoadingMore ? (
                <>
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-current border-r-transparent animate-spin mr-1"></span>
                  Loading...
                </>
              ) : (
                'Load older messages'
              )}
            </button>
          </div>
        )}
        
        {messages.length > 0 ? (
          <div className="space-y-3">
            {sortedMessages.map((message) => (
              <div key={message.id} className="message-item">
                <MessageItem
                  message={message}
                  onDelete={message.sender_uuid === selectedRoom?.user?.uuid || message.sender_id === selectedRoom?.user?.uuid ? () => handleDeleteMessage(message.id) : null}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        )}
        
        {typingUsers && typingUsers.size > 0 && (
          <div className={`px-4 py-2 rounded-lg w-auto inline-block transition-all duration-300 typing-indicator ${
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

      {/* Message Input */}
      <div className={`p-2 sm:p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <div className="relative flex-1">
            <Textarea
              placeholder={connectionStatus === 'connected' 
                ? `Send a message about ${selectedRoom.modelName}...` 
                : '...'}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              disabled={connectionStatus !== 'connected'}
              className={`min-h-[48px] max-h-[120px] resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'border-gray-300 text-gray-900'
              } ${connectionStatus !== 'connected' ? 'opacity-70' : ''}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  const syntheticEvent = { preventDefault: () => {} };
                  handleSendMessage(syntheticEvent);
                }
              }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={!newMessage.trim() || isUploading || connectionStatus !== 'connected'}
            className="flex-shrink-0 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white p-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isUploading ? (
              <span className="inline-block h-5 w-5 rounded-full border-2 border-white border-r-transparent animate-spin"></span>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface; 