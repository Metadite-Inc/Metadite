import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../lib/api';
import { toast } from 'sonner';
import { 
  getUserChatRooms,
  getMessages,
  sendMessage,
  connectWebSocket,
  deleteMessage,
  sendTypingIndicator,
  markMessagesAsRead,
  addConnectionListener,
  cleanup
} from '../services/ChatService';
import useUnreadCount from './useUnreadCount';

const useChatPage = () => {
  const { user, loading } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const messageEndRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const connectionListenerRef = useRef(null);

  // NEW: Optimized state management for chat rooms
  const [chatRoomsMap, setChatRoomsMap] = useState(new Map()); // Store by room ID for efficient updates
  const [animatingRooms, setAnimatingRooms] = useState(new Set()); // Track rooms with new messages
  const [lastMessageUpdates, setLastMessageUpdates] = useState(new Map()); // Track last message updates
  
  // Add unread count tracking to trigger room refresh
  const { unreadData } = useUnreadCount();
  const previousUnreadCountRef = useRef(0);
  
  // NEW: Optimized chat room update function
  const updateChatRoom = useCallback((roomId, updates) => {
    setChatRoomsMap(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(roomId) || {};
      newMap.set(roomId, { ...existing, ...updates });
      return newMap;
    });
  }, []);

  // NEW: Animate new message arrival
  const animateNewMessage = useCallback((roomId) => {
    setAnimatingRooms(prev => new Set([...prev, roomId]));
    setTimeout(() => {
      setAnimatingRooms(prev => {
        const newSet = new Set(prev);
        newSet.delete(roomId);
        return newSet;
      });
    }, 1000);
  }, []);

  // NEW: Update last message without full re-render
  const updateLastMessage = useCallback((roomId, message) => {
    setLastMessageUpdates(prev => {
      const newMap = new Map(prev);
      newMap.set(roomId, {
        content: message.content || 'New message',
        timestamp: message.created_at || new Date().toISOString(),
        unreadCount: roomId === selectedRoom?.id ? 0 : 1
      });
      return newMap;
    });
  }, [selectedRoom?.id]);

  // Watch for unread count changes and refresh rooms when count increases
  useEffect(() => {
    const currentTotal = unreadData.total_unread || 0;
    const previousTotal = previousUnreadCountRef.current;
    
    console.log('ChatPage unread count check:', { currentTotal, previousTotal });
    
    // If unread count increased and we're not on initial load
    if (currentTotal > previousTotal && previousTotal >= 0) {
      console.log('Unread count increased, triggering room refresh');
      loadUserChatRooms();
    }
    
    previousUnreadCountRef.current = currentTotal;
  }, [unreadData.total_unread]);

  // Load chat rooms when user is available
  useEffect(() => {
    if (user && !loading) {
      loadUserChatRooms();
    } else if (!loading && !user) {
      setLoadingRooms(false);
    }
  }, [user, loading]);

  // Set up connection state listener
  useEffect(() => {
    if (!selectedRoom) return;
    
    console.log(`Setting up connection listener for room ${selectedRoom.id}`);
    
    // Clean up previous connection listener
    if (connectionListenerRef.current) {
      connectionListenerRef.current();
      connectionListenerRef.current = null;
    }
    
    connectionListenerRef.current = addConnectionListener(selectedRoom.id, (state) => {
      console.log(`Connection state changed for room ${selectedRoom.id}:`, state.status);
      setConnectionStatus(state.status);
      
      if (state.status === 'connected') {
        // Mark messages as read when connection is established
        markMessagesAsRead(selectedRoom.id);
      }
    });
    
    return () => {
      if (connectionListenerRef.current) {
        connectionListenerRef.current();
        connectionListenerRef.current = null;
      }
    };
  }, [selectedRoom?.id]);

  const loadUserChatRooms = async () => {
    try {
      setLoadingRooms(true);
      console.log('Loading chat rooms for user:', user?.id);
      
      const rooms = await getUserChatRooms();

      if (rooms && Array.isArray(rooms)) {
        // Fetch model details for all rooms in parallel
        const modelDetails = await Promise.all(
          rooms.map(room => apiService.getModelDetails(room.doll_id))
        );

        const userRooms = rooms.map((room, index) => {
          const model = modelDetails[index];
          return {
            id: room.id,
            modelId: room.doll_id,
            modelName: model?.name || "Unknown",
            modelImage: model?.image || null,
            lastMessage: room.latest_message || 'Check for messages',
            lastMessageTime: room.last_message?.created_at,
            unreadCount: room.unread_count || 0,
            createdAt: room.created_at,
            moderatorId: room.moderator_id
          };
        });

        setChatRooms(userRooms);
        
        // NEW: Initialize chat rooms map
        const roomsMap = new Map();
        userRooms.forEach(room => {
          roomsMap.set(room.id, room);
        });
        setChatRoomsMap(roomsMap);
        
        console.log('Loaded chat rooms:', userRooms);
      } else {
        console.log('No chat rooms found or invalid response');
        setChatRooms([]);
        setChatRoomsMap(new Map());
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      toast.error('Failed to load chat rooms');
      setChatRooms([]);
      setChatRoomsMap(new Map());
    } finally {
      setLoadingRooms(false);
    }
  };

  // Handle room selection
  const handleRoomSelect = async (room) => {
    if (selectedRoom) {
      console.log(`Cleaning up previous room ${selectedRoom.id}`);
      cleanup(selectedRoom.id);
    }

    setSelectedRoom(room);
    setMessages([]);
    setNewMessage('');
    setTypingUsers(new Set());
    
    try {
      console.log(`Loading messages for chat room ${room.id}`);
      const chatMessages = await getMessages(room.id);
      if (chatMessages && chatMessages.length) {
        console.log(`Loaded ${chatMessages.length} messages`);
        setMessages(chatMessages);
        setHasMoreMessages(chatMessages.length === 50);
      } else {
        console.log('No existing messages found');
        setMessages([]);
      }

      // Mark messages as read after loading them
      markMessagesAsRead(room.id);

      setConnectionStatus('connecting');
      console.log(`Connecting to WebSocket for chat room ${room.id}`);
      const ws = await connectWebSocket(room.id, handleWebSocketMessage);
      
      if (ws) {
        wsRef.current = ws;
        console.log(`WebSocket connection established for room ${room.id}`);
      }
    } catch (error) {
      console.error('Error loading room:', error);
      toast.error('Failed to load chat room');
    }
  };

  // OPTIMIZED: Handle incoming WebSocket messages with minimal re-renders
  const handleWebSocketMessage = useCallback((data) => {
    console.log("WebSocket message received:", data);
    
    if (data.type === 'new_message' && data.message) {
      setMessages(prev => {
        const exists = prev.some(msg => 
          msg.id === data.message.id ||
          (msg.content === data.message.content && 
           Math.abs(new Date(msg.created_at) - new Date(data.message.created_at)) < 1000)
        );
        if (exists) {
          console.log('Duplicate message detected, skipping');
          return prev;
        }
        console.log('Adding new message:', data.message);
        return [...prev, data.message];
      });
      
      // NEW: Optimized update for room list - only update specific room
      const chatRoomId = data.message.chat_room_id;
      if (chatRoomId) {
        // Update last message without full re-render
        updateLastMessage(chatRoomId, data.message);
        
        // Animate the room that received the message
        if (chatRoomId !== selectedRoom?.id) {
          animateNewMessage(chatRoomId);
        }
      }
    } else if (data.type === 'typing' && data.user_id) {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (data.is_typing) {
          newSet.add(data.user_id);
        } else {
          newSet.delete(data.user_id);
        }
        return newSet;
      });
    } else if (data.type === 'message_deleted' && data.message_id) {
      setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
    }
  }, [selectedRoom?.id, updateLastMessage, animateNewMessage]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add scroll handler to mark messages as read when user scrolls to bottom
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // If user is within 50px of the bottom, mark messages as read
    if (scrollHeight - scrollTop - clientHeight < 50) {
      if (selectedRoom) {
        markMessagesAsRead(selectedRoom.id);
      }
    }
  };

  const loadMoreMessages = async () => {
    if (!selectedRoom || isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    try {
      console.log(`Loading more messages from offset ${messages.length}`);
      const olderMessages = await getMessages(selectedRoom.id, messages.length);
      
      if (olderMessages.length > 0) {
        console.log(`Loaded ${olderMessages.length} older messages`);
        setMessages(prev => [...olderMessages, ...prev]);
        setHasMoreMessages(olderMessages.length === 50);
        
        // Mark messages as read after loading more messages
        markMessagesAsRead(selectedRoom.id);
      } else {
        console.log('No more messages to load');
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
      toast.error('Failed to load more messages');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleTyping = () => {
    if (selectedRoom) {
      sendTypingIndicator(selectedRoom.id, true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(selectedRoom.id, false);
      }, 3000);
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedRoom) return;
    
    if (!user) {
      toast.error("Please login to send messages");
      return;
    }
    
    try {
      setIsUploading(true);
      
      const moderatorId = selectedRoom.moderatorId || null;
      
      if (newMessage.trim()) {
        try {
          await sendMessage(newMessage.trim(), selectedRoom.id, moderatorId);
          
          const textMessage = {
            id: Date.now() + 1,
            chat_room_id: selectedRoom.id,
            sender_id: user.id,
            sender_uuid: user.uuid,
            sender_name: user.name || 'You',
            content: newMessage,
            created_at: new Date().toISOString(),
            flagged: false,
            message_type: 'TEXT'
          };
          
          setMessages(prev => [...prev, textMessage]);
          setNewMessage('');
          
          // NEW: Optimized update for current room
          updateLastMessage(selectedRoom.id, {
            content: newMessage,
            created_at: new Date().toISOString()
          });
          
          sendTypingIndicator(selectedRoom.id, false);
        } catch (error) {
          console.error("Failed to send message:", error);
          toast.error("Failed to send message");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Clean up connection listener
      if (connectionListenerRef.current) {
        connectionListenerRef.current();
      }
      
      // Clean up all connections when component unmounts
      cleanup();
    };
  }, []);

  return {
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
    handleWebSocketMessage,
    handleScroll,
    loadMoreMessages,
    handleTyping,
    handleSendMessage,
    handleDeleteMessage,
    refreshRooms: loadUserChatRooms
  };
};

export default useChatPage; 