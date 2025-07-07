import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { MessageSquare } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import useChatPage from '../hooks/useChatPage';
import ChatRoomList from '../components/chat/ChatRoomList';
import ChatInterface from '../components/chat/ChatInterface';

const ChatPage = () => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [showChatList, setShowChatList] = useState(true); // For mobile navigation
  
  const {
    user,
    loading,
    chatRooms,
    loadingRooms,
    searchTerm,
    setSearchTerm,
    selectedRoom,
    messages,
    newMessage,
    setNewMessage,
    isUploading,
    typingUsers,
    connectionStatus,
    hasMoreMessages,
    isLoadingMore,
    messageEndRef,
    // NEW: Optimized state
    chatRoomsMap,
    animatingRooms,
    lastMessageUpdates,
    handleRoomSelect,
    handleScroll,
    loadMoreMessages,
    handleTyping,
    handleSendMessage,
    handleDeleteMessage
  } = useChatPage();

  // Handle room selection with mobile navigation
  const handleRoomSelectWithMobile = (room) => {
    handleRoomSelect(room);
    
    // On mobile, switch to chat view
    if (isMobile) {
      setShowChatList(false);
    }
  };

  // Handle back to chat list on mobile
  const handleBackToChatList = () => {
    if (isMobile) {
      setShowChatList(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-20 pb-12 px-4 flex items-center justify-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="text-center">
            <div className="inline-block h-8 w-8 rounded-full border-4 border-metadite-primary border-r-transparent animate-spin"></div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-20 pb-12 px-4 flex items-center justify-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-metadite-primary opacity-50" />
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Please Log In
            </h2>
            <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              You need to be logged in to access your chats
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-20 pb-4 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="mx-auto max-w-7xl h-[calc(100vh-120px)]">
          <div className={`glass-card rounded-xl overflow-hidden h-full flex ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50'
          }`}>
            
            {/* Mobile: Conditional rendering based on showChatList */}
            {isMobile ? (
              <>
                {showChatList ? (
                  /* Chat Rooms List - Mobile */
                  <ChatRoomList 
                    chatRooms={chatRooms}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedRoom={selectedRoom}
                    onSelectRoom={handleRoomSelectWithMobile}
                    loadingRooms={loadingRooms}
                    // NEW: Optimized props
                    lastMessageUpdates={lastMessageUpdates}
                    animatingRooms={animatingRooms}
                  />
                ) : (
                  /* Chat Interface - Mobile */
                  <ChatInterface
                    selectedRoom={selectedRoom}
                    messages={messages}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={handleSendMessage}
                    handleTyping={handleTyping}
                    handleDeleteMessage={handleDeleteMessage}
                    handleScroll={handleScroll}
                    loadMoreMessages={loadMoreMessages}
                    hasMoreMessages={hasMoreMessages}
                    isLoadingMore={isLoadingMore}
                    typingUsers={typingUsers}
                    connectionStatus={connectionStatus}
                    isUploading={isUploading}
                    messageEndRef={messageEndRef}
                    onBackToChatList={handleBackToChatList}
                    isMobile={true}
                  />
                )}
              </>
            ) : (
              /* Desktop: Side-by-side layout */
              <>
                {/* Left Sidebar - Chat Rooms */}
                <div className={`w-1/3 border-r flex flex-col ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <ChatRoomList 
                    chatRooms={chatRooms}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedRoom={selectedRoom}
                    onSelectRoom={handleRoomSelect}
                    loadingRooms={loadingRooms}
                    // NEW: Optimized props
                    lastMessageUpdates={lastMessageUpdates}
                    animatingRooms={animatingRooms}
                  />
                </div>

                {/* Right Side - Chat Interface (Desktop) */}
                <ChatInterface
                  selectedRoom={selectedRoom}
                  messages={messages}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  handleSendMessage={handleSendMessage}
                  handleTyping={handleTyping}
                  handleDeleteMessage={handleDeleteMessage}
                  handleScroll={handleScroll}
                  loadMoreMessages={loadMoreMessages}
                  hasMoreMessages={hasMoreMessages}
                  isLoadingMore={isLoadingMore}
                  typingUsers={typingUsers}
                  connectionStatus={connectionStatus}
                  isUploading={isUploading}
                  messageEndRef={messageEndRef}
                  isMobile={false}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
