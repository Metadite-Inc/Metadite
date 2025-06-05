
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../lib/api';
import { toast } from 'sonner';
import { 
  addConnectionListener,
  cleanup
} from '../services/ChatService';

const useChatRoomList = () => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadChatRooms = useCallback(async () => {
    if (!user) {
      setChatRooms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // This would be your API call to get user's chat rooms
      // For now, using a placeholder - you'll need to implement this endpoint
      const rooms = await apiService.getUserChatRooms();
      setChatRooms(rooms || []);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      toast.error('Failed to load chat rooms');
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  }, [user, refreshTrigger]);

  // Function to trigger refresh when new messages arrive
  const handleNewMessage = useCallback((data) => {
    if (data.type === 'new_message' && data.message) {
      console.log('New message received, refreshing chat rooms');
      setRefreshTrigger(prev => prev + 1);
      
      // Update the specific chat room's last message immediately for better UX
      setChatRooms(prev => 
        prev.map(room => 
          room.id === data.message.chat_room_id
            ? {
                ...room,
                lastMessage: data.message.content || 'New message',
                lastMessageTime: data.message.created_at || new Date().toISOString(),
                unreadCount: (room.unreadCount || 0) + 1
              }
            : room
        )
      );
    }
  }, []);

  useEffect(() => {
    loadChatRooms();
  }, [loadChatRooms]);

  // Set up WebSocket listeners for all chat rooms
  useEffect(() => {
    if (!chatRooms.length || !user) return;

    const listeners = [];
    
    chatRooms.forEach(room => {
      if (room.id) {
        const unsubscribe = addConnectionListener(room.id, handleNewMessage);
        listeners.push(() => unsubscribe());
      }
    });

    return () => {
      listeners.forEach(cleanup => cleanup());
    };
  }, [chatRooms, handleNewMessage, user]);

  const refreshChatRooms = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    chatRooms,
    loading,
    refreshChatRooms,
    loadChatRooms
  };
};

export default useChatRoomList;
