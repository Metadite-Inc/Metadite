import React, { useMemo } from 'react';
import { Search, MessageSquare, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ChatRoomList = React.memo(({ 
  chatRooms, 
  searchTerm, 
  setSearchTerm, 
  selectedRoom, 
  onSelectRoom, 
  loadingRooms,
  // NEW: Optimized props
  lastMessageUpdates,
  animatingRooms
}) => {
  const { theme } = useTheme();

  // NEW: Optimized filtering with memoization
  const filteredRooms = useMemo(() => {
    return chatRooms.filter(room =>
      room.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [chatRooms, searchTerm]);

  // NEW: Enhanced room data with real-time updates
  const enhancedRooms = useMemo(() => {
    return filteredRooms.map(room => {
      const lastUpdate = lastMessageUpdates?.get(room.id);
      const isAnimating = animatingRooms?.has(room.id);
      
      return {
        ...room,
        lastMessage: lastUpdate?.content || room.lastMessage,
        lastMessageTime: lastUpdate?.timestamp || room.lastMessageTime,
        unreadCount: lastUpdate?.unreadCount || room.unreadCount,
        isAnimating
      };
    });
  }, [filteredRooms, lastMessageUpdates, animatingRooms]);

  // Format time for display
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full flex flex-col">
      <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Chats
          </h1>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-metadite-primary" />
            <span className="bg-metadite-primary/20 text-metadite-primary px-2 py-1 rounded-full text-xs font-medium">
              {chatRooms.length}
            </span>
          </div>
        </div>
        
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-6 pr-2 sm:pl-9 sm:pr-4 py-2 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-metadite-primary`}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto chat-messages-container">
        {loadingRooms ? (
          <div className="p-4 sm:p-8 text-center">
            <div className="inline-block h-6 w-6 rounded-full border-4 border-metadite-primary border-r-transparent animate-spin"></div>
            <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading conversations...
            </p>
          </div>
        ) : enhancedRooms.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {enhancedRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room)}
                className={`p-2 sm:p-4 cursor-pointer model-list-item transition-all duration-300 ${
                  selectedRoom?.id === room.id
                    ? 'bg-metadite-primary/10 border-r-2 border-metadite-primary'
                    : `hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                        room.unreadCount > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`
                } ${room.isAnimating ? 'room-item-new-message' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={room.modelImage}
                      alt={room.modelName}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/200?text=Model';
                      }}
                    />
                    {room.unreadCount > 0 && (
                      <div className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                        room.isAnimating ? 'bg-metadite-primary unread-badge-animate' : 'bg-metadite-primary'
                      }`}>
                        {room.unreadCount > 9 ? '9+' : room.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {room.modelName}
                      </h3>
                      <span className={`text-xs transition-colors duration-200 ${
                        room.isAnimating 
                          ? 'text-metadite-primary font-medium' 
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {formatTime(room.lastMessageTime)}
                      </span>
                    </div>
                    <p className={`text-sm truncate mt-1 transition-colors duration-200 ${
                      room.isAnimating 
                        ? 'text-metadite-primary font-medium' 
                        : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {room.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 sm:p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-metadite-primary opacity-50" />
            <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Start chatting with models to see your conversations here
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

ChatRoomList.displayName = 'ChatRoomList';

export default ChatRoomList; 