import React, { useCallback, useEffect, useRef, memo } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useChatStore } from '../../stores/chatStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import MessageItem from '../MessageItem';

// Memoized message list component
const MessageList = memo(({ messages, onDelete }: { 
  messages: any[], 
  onDelete: (messageId: string | number) => void 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No messages yet. Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="message-item">
          <MessageItem
            message={message}
            onDelete={onDelete}
          />
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
});

MessageList.displayName = 'MessageList';

// Memoized typing indicator
const TypingIndicator = memo(({ typingUsers }: { typingUsers: Set<string> }) => {
  if (typingUsers.size === 0) return null;

  return (
    <div className="flex justify-start p-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {typingUsers.size === 1 ? 'Someone is typing...' : `${typingUsers.size} people are typing...`}
        </p>
      </div>
    </div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';

// Memoized message input
const MessageInput = memo(({ 
  newMessage, 
  setNewMessage, 
  onSend, 
  disabled, 
  placeholder 
}: {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSend: () => void;
  disabled: boolean;
  placeholder: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  }, [onSend]);

  return (
    <div className="p-4 border-t dark:border-gray-700">
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[60px] max-h-32 resize-none"
            rows={1}
          />
        </div>
        <Button
          onClick={onSend}
          disabled={!newMessage.trim() || disabled}
          className="bg-metadite-primary hover:bg-metadite-secondary text-white"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';

// Main chat container component
const ChatContainer = memo(() => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // Get state and actions from the centralized store
  const {
    selectedRoom,
    messages,
    newMessage,
    loadingMessages,
    isUploading,
    connectionStatus,
    typingUsers,
    hasMoreMessages,
    isLoadingMore,
    setNewMessage,
    sendMessage,
    deleteMessage,
    loadMoreMessages,
    connectToRoom,
    disconnectFromRoom
  } = useChatStore();

  // Handle room selection
  useEffect(() => {
    if (selectedRoom) {
      connectToRoom(selectedRoom.id);
      return () => {
        disconnectFromRoom(selectedRoom.id);
      };
    }
  }, [selectedRoom, connectToRoom, disconnectFromRoom]);

  // Handle send message
  const handleSendMessage = useCallback(async () => {
    if (!selectedRoom || !newMessage.trim()) return;
    
    if (!user) {
      toast.error("Please login to send messages");
      return;
    }

    try {
      await sendMessage(newMessage, selectedRoom.id, selectedRoom.moderator_id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [selectedRoom, newMessage, user, sendMessage]);

  // Handle delete message
  const handleDeleteMessage = useCallback(async (messageId: string | number) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  }, [deleteMessage]);

  // Handle load more messages
  const handleLoadMore = useCallback(() => {
    if (selectedRoom && hasMoreMessages && !isLoadingMore) {
      loadMoreMessages(selectedRoom.id);
    }
  }, [selectedRoom, hasMoreMessages, isLoadingMore, loadMoreMessages]);

  // Handle scroll for loading more messages
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      handleLoadMore();
    }
  }, [hasMoreMessages, isLoadingMore, handleLoadMore]);

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
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {selectedRoom.doll?.image_url && (
            <img
              src={selectedRoom.doll.image_url}
              alt={selectedRoom.doll.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="font-medium">{selectedRoom.doll?.name || 'Chat'}</h3>
            <p className="text-sm text-gray-500">
              {connectionStatus.status === 'connected' ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        {hasMoreMessages && (
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            size="sm"
          >
            {isLoadingMore ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Load More
          </Button>
        )}
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <MessageList 
            messages={messages} 
            onDelete={handleDeleteMessage}
          />
        )}
        
        <TypingIndicator typingUsers={typingUsers} />
      </div>

      {/* Input */}
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSend={handleSendMessage}
        disabled={isUploading || connectionStatus.status !== 'connected'}
        placeholder={
          connectionStatus.status === 'connected' 
            ? `Message ${selectedRoom.doll?.name || 'chat'}...` 
            : 'Connecting...'
        }
      />
    </div>
  );
});

ChatContainer.displayName = 'ChatContainer';

export default ChatContainer; 