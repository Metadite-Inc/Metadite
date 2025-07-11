import React, { useCallback, useEffect, memo, useMemo } from 'react';
import { Search, MessageSquare, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useChatStore } from '../../stores/chatStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUserChatRooms } from '../../services/ChatService';

// Memoized chat room item
const ChatRoomItem = memo(({ 
  room, 
  isSelected, 
  onSelect 
}: {
  room: any;
  isSelected: boolean;
  onSelect: (room: any) => void;
}) => {
  const { theme } = useTheme();
  
  const formatTime = useCallback((timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return '';
    }
  }, []);

  const truncateMessage = useCallback((message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  }, []);

  return (
    <div
      className={`p-4 cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-metadite-primary text-white' 
          : theme === 'dark' 
            ? 'hover:bg-gray-800' 
            : 'hover:bg-gray-50'
      }`}
      onClick={() => onSelect(room)}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {room.doll?.image_url ? (
            <img
              src={room.doll.image_url}
              alt={room.doll.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-gray-500" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium truncate ${
              isSelected ? 'text-white' : theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {room.doll?.name || 'Unknown'}
            </h3>
            {room.last_message && (
              <span className={`text-xs ${
                isSelected ? 'text-white/70' : 'text-gray-500'
              }`}>
                {formatTime(room.last_message.created_at)}
              </span>
            )}
          </div>
          
          {room.last_message && (
            <p className={`text-sm mt-1 truncate ${
              isSelected ? 'text-white/80' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {truncateMessage(room.last_message.content)}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-2">
            {room.unread_count > 0 && (
              <Badge 
                variant="destructive" 
                className="text-xs"
              >
                {room.unread_count}
              </Badge>
            )}
            <div className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
});

ChatRoomItem.displayName = 'ChatRoomItem';

// Memoized search input
const SearchInput = memo(({ 
  searchTerm, 
  onSearchChange 
}: {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="relative p-4">
      <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search conversations..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`pl-10 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
        }`}
      />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

// Main chat room list component
const ChatRoomList = memo(() => {
  const { theme } = useTheme();
  
  // Get state and actions from the centralized store
  const {
    chatRooms,
    selectedRoom,
    loadingRooms,
    searchTerm,
    setChatRooms,
    setSelectedRoom,
    setSearchTerm,
    loadChatRooms,
    loadUnreadCounts
  } = useChatStore();

  // Filter rooms based on search term
  const filteredRooms = useMemo(() => {
    if (!searchTerm.trim()) return chatRooms;
    
    return chatRooms.filter(room => 
      room.doll?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.last_message?.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [chatRooms, searchTerm]);

  // Load chat rooms on mount
  useEffect(() => {
    loadChatRooms();
    loadUnreadCounts();
  }, [loadChatRooms, loadUnreadCounts]);

  // Handle room selection
  const handleRoomSelect = useCallback((room: any) => {
    setSelectedRoom(room);
  }, [setSelectedRoom]);

  // Handle search change
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, [setSearchTerm]);

  if (loadingRooms) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Messages
        </h2>
      </div>

      {/* Search */}
      <SearchInput 
        searchTerm={searchTerm} 
        onSearchChange={handleSearchChange}
      />

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">
                {searchTerm ? 'No conversations found' : 'No conversations yet'}
              </p>
              {!searchTerm && (
                <p className="text-sm text-gray-400 mt-2">
                  Start a conversation with a model to see it here
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {filteredRooms.map((room) => (
              <ChatRoomItem
                key={room.id}
                room={room}
                isSelected={selectedRoom?.id === room.id}
                onSelect={handleRoomSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

ChatRoomList.displayName = 'ChatRoomList';

export default ChatRoomList; 