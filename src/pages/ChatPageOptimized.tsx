import React, { memo, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useChatStore } from '../stores/chatStore';
import ChatRoomList from '../components/chat/ChatRoomList';
import ChatContainer from '../components/chat/ChatContainer';
import Navbar from '../components/Navbar';

// Memoized mobile navigation component
const MobileNavigation = memo(({ 
  showChatList, 
  onToggleView 
}: {
  showChatList: boolean;
  onToggleView: () => void;
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="md:hidden p-4 border-b dark:border-gray-700">
      <button
        onClick={onToggleView}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          theme === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        }`}
      >
        <span>{showChatList ? 'Chat' : 'Back to List'}</span>
      </button>
    </div>
  );
});

MobileNavigation.displayName = 'MobileNavigation';

// Main optimized chat page
const ChatPageOptimized = memo(() => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [showChatList, setShowChatList] = React.useState(true);
  
  // Get state from the centralized store
  const {
    selectedRoom,
    loadUnreadCounts
  } = useChatStore();

  // Load unread counts on mount
  useEffect(() => {
    loadUnreadCounts();
  }, [loadUnreadCounts]);

  // Handle mobile navigation
  const handleToggleView = React.useCallback(() => {
    setShowChatList(!showChatList);
  }, [showChatList]);

  // Handle room selection for mobile
  const handleRoomSelect = React.useCallback(() => {
    if (isMobile && selectedRoom) {
      setShowChatList(false);
    }
  }, [isMobile, selectedRoom]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Mobile Navigation */}
        {isMobile && (
          <MobileNavigation 
            showChatList={showChatList} 
            onToggleView={handleToggleView}
          />
        )}
        
        {/* Chat Room List */}
        {(showChatList || !isMobile) && (
          <div className={`${isMobile ? 'w-full' : 'w-80'} border-r dark:border-gray-700`}>
            <ChatRoomList />
          </div>
        )}
        
        {/* Chat Container */}
        {(!showChatList || !isMobile) && (
          <div className="flex-1">
            <ChatContainer />
          </div>
        )}
      </div>
    </div>
  );
});

ChatPageOptimized.displayName = 'ChatPageOptimized';

export default ChatPageOptimized; 