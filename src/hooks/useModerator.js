import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../lib/api';
import { toast } from 'sonner';
import { 
  getModeratorChatRooms, 
  getMessages, 
  sendMessage,
  connectWebSocket,
  sendFileMessage,
  flagMessage,
  sendTypingIndicator,
  markMessagesAsRead,
  deleteMessage,
  addConnectionListener,
  cleanup,
  getCurrentConnectionState
} from '../services/ChatService';
import useUnreadCount from './useUnreadCount';

const useModerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [assignedModels, setAssignedModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [websocket, setWebsocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  const messageEndRef = useRef(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const wsRef = useRef(null);
  const connectionListenerRef = useRef(null);
  
  // NEW: Optimized state management for chat rooms
  const [chatRooms, setChatRooms] = useState(new Map()); // Store by room ID for efficient updates
  const [animatingRooms, setAnimatingRooms] = useState(new Set()); // Track rooms with new messages
  const [lastMessageUpdates, setLastMessageUpdates] = useState(new Map()); // Track last message updates
  
  // Add unread count tracking to trigger model refresh
  const { unreadData } = useUnreadCount();
  const previousUnreadCountRef = useRef(0);
  
  // NEW: Optimized chat room update function
  const updateChatRoom = useCallback((roomId, updates) => {
    setChatRooms(prev => {
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
        unreadCount: roomId === selectedModel?.id ? 0 : 1
      });
      return newMap;
    });
  }, [selectedModel?.id]);
  
  // Server-side role validation for moderator access
  useEffect(() => {
    const validateModeratorAccess = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        // Use authApi.getCurrentUser() for server-side role validation
        const { authApi } = await import('../lib/api/auth_api');
        const currentUser = await authApi.getCurrentUser();
        
        if (currentUser.role !== 'moderator') {
          const { toast } = await import('sonner');
          toast.error('Access denied. Moderator privileges required.');
          navigate('/');
          return;
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Moderator access validation failed:', error);
        const { toast } = await import('sonner');
        toast.error('Authentication failed. Please log in again.');
        navigate('/');
      }
    };

    validateModeratorAccess();
  }, [user, navigate]);

  // Function to load assigned models
  const loadAssignedModels = useCallback(async () => {
    if (!user?.role || user.role !== 'moderator') return;
    
    setLoading(true);
    try {
      console.log('Loading assigned models...');
      const rooms = await getModeratorChatRooms();

      if (!rooms) {
        toast.error('Failed to load assigned models');
        return;
      }

      // Fetch model details for all rooms in parallel
      const modelDetailsList = await Promise.all(
        rooms.map(room => apiService.getModelDetails(room.doll_id))
      );

      // Format the rooms data for display
      const models = rooms.map((room, index) => {
        const model = modelDetailsList[index];
        return {
          id: room.id,
          name: model?.name || 'Unknown',
          image: model?.image || null,
          receiverId: room.user_id,
          receiverName: room.user?.full_name,
          lastMessage: room.latest_message || 'Check for messages',
          lastMessageTime: room.last_message?.created_at || null,
          unreadCount: room.unread_count || 0,
        };
      });

      console.log('Loaded models:', models.length);
      setAssignedModels(models);
      
      // NEW: Initialize chat rooms map
      const roomsMap = new Map();
      models.forEach(model => {
        roomsMap.set(model.id, model);
      });
      setChatRooms(roomsMap);
    } catch (error) {
      console.error('Error loading assigned models:', error);
      toast.error('Failed to load assigned models');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Watch for unread count changes and refresh models when count increases
  useEffect(() => {
    const currentTotal = unreadData.total_unread || 0;
    const previousTotal = previousUnreadCountRef.current;
    
    console.log('Unread count check:', { currentTotal, previousTotal });
    
    // If unread count increased and we're not on initial load
    if (currentTotal > previousTotal && previousTotal >= 0) {
      console.log('Unread count increased, triggering model refresh');
      loadAssignedModels();
    }
    
    previousUnreadCountRef.current = currentTotal;
  }, [unreadData.total_unread, loadAssignedModels]);
  
  // Load assigned models/dolls when component mounts
  useEffect(() => {
    if (user?.role === 'moderator') {
      loadAssignedModels();
    }
  }, [user, loadAssignedModels]);
  
  // Handle model selection
  const handleSelectModel = useCallback((model) => {
    // Clear input message and selected file when switching rooms
    setNewMessage('');
    clearSelectedFile();
    setSelectedModel(model);
    
    // Scroll to bottom after switching rooms
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, []);
  
  // Set up connection state listener and WebSocket connection
  useEffect(() => {
    if (!selectedModel?.id) return;
    
    const chatRoomId = Number(selectedModel.id);
    if (isNaN(chatRoomId)) {
      console.error('Invalid chat room ID:', selectedModel.id);
      toast.error('Invalid chat room ID');
      return;
    }
    
    console.log(`Setting up connection for room ${chatRoomId}`);
    
    // Clean up previous connection listener
    if (connectionListenerRef.current) {
      connectionListenerRef.current();
      connectionListenerRef.current = null;
    }
    
    // Get current connection state immediately
    const currentState = getCurrentConnectionState(chatRoomId);
    console.log(`Current connection state for room ${chatRoomId}:`, currentState.status);
    setConnectionStatus(currentState.status);
    
    // Set up connection state listener BEFORE connecting
    console.log(`Setting up connection listener for room ${chatRoomId}`);
    connectionListenerRef.current = addConnectionListener(chatRoomId, (state) => {
      console.log(`Connection state changed for room ${chatRoomId}:`, state.status);
      setConnectionStatus(state.status);
      
      if (state.status === 'connected') {
        // Mark messages as read when connection is established
        markMessagesAsRead(chatRoomId);
      }
    });
    
    // Clear messages and reset state when switching rooms
    setMessages([]);
    setTypingUsers(new Set());
    setReceiverId(selectedModel.receiverId);
    
    // Load messages first
    const loadMessages = async () => {
      setLoading(true);
      try {
        console.log(`Loading messages for chat room ${chatRoomId}`);
        const chatMessages = await getMessages(chatRoomId);
        if (chatMessages) {
          console.log(`Loaded ${chatMessages.length} messages`);
          setMessages(chatMessages.sort((a, b) => a.id - b.id));
          setHasMoreMessages(chatMessages.length === 50);
        }
        
        // Mark messages as read after loading them
        markMessagesAsRead(chatRoomId);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
        setTimeout(() => {
          messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };
    
    loadMessages();
    
    // Clean up previous WebSocket connection
    if (wsRef.current) {
      console.log(`Cleaning up previous moderator connection for room ${chatRoomId}`);
      cleanup(chatRoomId);
      wsRef.current = null;
    }
    
    // Set up WebSocket connection with a small delay to ensure listener is ready
    const connectTimer = setTimeout(async () => {
      console.log(`Moderator connecting to WebSocket for room ${chatRoomId}`);
      const ws = await connectWebSocket(chatRoomId, handleWebSocketMessage);
      
      if (ws) {
        wsRef.current = ws;
        setWebsocket(ws);
        console.log(`Moderator WebSocket connection established for room ${chatRoomId}`);
        
        // Force update connection status after successful connection
        setTimeout(() => {
          const updatedState = getCurrentConnectionState(chatRoomId);
          console.log(`Force updating connection status to:`, updatedState.status);
          setConnectionStatus(updatedState.status);
        }, 500);
      }
    }, 200);
    
    return () => {
      clearTimeout(connectTimer);
      console.log(`Cleaning up moderator connection for room ${chatRoomId}`);
      
      // Clean up connection listener
      if (connectionListenerRef.current) {
        connectionListenerRef.current();
        connectionListenerRef.current = null;
      }
      
      // Clean up WebSocket
      cleanup(chatRoomId);
      wsRef.current = null;
    };
  }, [selectedModel?.id]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Add scroll handler to mark messages as read when user scrolls to bottom
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // If user is within 50px of the bottom, mark messages as read
    if (scrollHeight - scrollTop - clientHeight < 50) {
      if (selectedModel) {
        markMessagesAsRead(selectedModel.id);
      }
    }
  };
  
  // Load more messages when scrolling up
  const loadMoreMessages = async () => {
    if (!selectedModel || isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    try {
      const olderMessages = await getMessages(selectedModel.id, messages.length);
      
      if (olderMessages && olderMessages.length > 0) {
        setMessages(prev => {
          const updated = [...olderMessages, ...prev];
          updated.sort((a, b) => a.id - b.id);
          return updated;
        });
        setHasMoreMessages(olderMessages.length === 50); // Assuming default limit is 50
        
        // Mark messages as read after loading more messages
        markMessagesAsRead(selectedModel.id);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
      toast.error('Failed to load more messages');
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // OPTIMIZED: Handle incoming WebSocket messages with minimal re-renders
  const handleWebSocketMessage = useCallback((data) => {
    console.log('Moderator received WebSocket message:', data);
    
    if (data.type === 'new_message' && data.message) {
      console.log('Adding new message to moderator chat:', data.message);
      
      // Update messages for current chat room only
      setMessages(prev => {
        // Prevent duplicate messages
        const exists = prev.some(msg => 
          msg.id === data.message.id ||
          (msg.content === data.message.content && 
           Math.abs(new Date(msg.created_at) - new Date(data.message.created_at)) < 1000)
        );
        if (exists) {
          console.log('Duplicate message detected, skipping');
          return prev;
        }
        const updated = [...prev, data.message];
        updated.sort((a, b) => a.id - b.id);
        return updated;
      });
      
      // NEW: Optimized update for model list - only update specific room
      const chatRoomId = data.message.chat_room_id || selectedModel?.id;
      if (chatRoomId) {
        // Update last message without full re-render
        updateLastMessage(chatRoomId, data.message);
        
        // Animate the room that received the message
        if (chatRoomId !== selectedModel?.id) {
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
    } else if (data.type === 'message_updated' && data.message) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.message.id ? { ...msg, ...data.message } : msg
        )
      );
    }
  }, [selectedModel?.id, updateLastMessage, animateNewMessage]);
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 10MB"
      });
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, just show the file name
      setPreviewUrl(null);
    }
  };
  
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const promptFileSelection = () => {
    fileInputRef.current?.click();
  };
  
  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (selectedModel?.id) {
      sendTypingIndicator(selectedModel.id, true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to indicate stopped typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(selectedModel.id, false);
      }, 3000);
    }
  }, [selectedModel]);
  
  // Clean up typing timeout and WebSocket on unmount
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
  
  // Send a new message (text or file)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || !selectedModel) return;
    
    if (connectionStatus !== 'connected') {
      toast.warning('Connection unstable', {
        description: 'Message will be sent when connection is restored.'
      });
    }
    
    setIsUploading(true);
    
    try {
      const moderatorId = user?.id;
      
      // Handle file upload
      if (selectedFile) {
        console.log('Moderator sending file:', selectedFile.name);
        const sentMessage = await sendFileMessage(selectedFile, selectedModel.id, receiverId);
        if (sentMessage) {
          // Create immediate feedback message
          const fileMessage = {
            id: `temp-${Date.now()}`,
            chat_room_id: selectedModel.id,
            sender_id: user.id,
            sender_uuid: user.uuid,
            sender_name: 'You',
            content: selectedFile.name,
            file_name: selectedFile.name,
            created_at: new Date().toISOString(),
            flagged: false,
            message_type: selectedFile.type.startsWith('image/') ? 'IMAGE' : 'FILE',
            file_url: selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null
          };
          
          setMessages(prev => {
            const updated = [...prev, fileMessage];
            updated.sort((a, b) => a.id - b.id);
            return updated;
          });
          clearSelectedFile();
          
          // NEW: Optimized update for current room
          updateLastMessage(selectedModel.id, {
            content: 'File: ' + selectedFile.name,
            created_at: new Date().toISOString()
          });
        }
      }
      
      // Handle text message
      if (newMessage.trim()) {
        console.log('Moderator sending message:', newMessage);
        const sentMessage = await sendMessage(newMessage, selectedModel.id, moderatorId);
        
        // Always create immediate feedback for better UX
        const textMessage = {
          id: `temp-${Date.now()}-text`,
          chat_room_id: selectedModel.id,
          sender_id: user.id,
          sender_uuid: user.uuid,
          sender_name: 'You',
          content: newMessage,
          created_at: new Date().toISOString(),
          flagged: false,
          message_type: 'TEXT'
        };
        
        setMessages(prev => {
          const updated = [...prev, textMessage];
          updated.sort((a, b) => a.id - b.id);
          return updated;
        });
        
        // NEW: Optimized update for current room
        updateLastMessage(selectedModel.id, {
          content: newMessage,
          created_at: new Date().toISOString()
        });
        
        setNewMessage('');
        sendTypingIndicator(selectedModel.id, false);
      }
      
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleFlagMessage = async (messageId) => {
    try {
      const message = messages.find(msg => msg.id === messageId);
      if (!message) return;
      
      const updatedMessage = await flagMessage(messageId, !message.flagged);
      if (updatedMessage) {
        setMessages(prev => 
          prev.map(msg => msg.id === messageId 
            ? { ...msg, flagged: !msg.flagged } 
            : msg
          )
        );
        
        toast(message.flagged ? 'Flag removed' : 'Message flagged', {
          description: message.flagged 
            ? 'The flag has been removed from this message.' 
            : 'The message has been flagged for review by admin.',
        });
      }
    } catch (error) {
      console.error('Error flagging message:', error);
      // ChatService handles the error toast
    }
  };
  
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      // ChatService handles the error toast
    }
  };

  return {
    isLoaded,
    searchTerm,
    setSearchTerm,
    newMessage,
    setNewMessage,
    messages,
    assignedModels,
    selectedModel,
    loading,
    fileInputRef,
    selectedFile,
    previewUrl,
    isUploading,
    typingUsers,
    connectionStatus,
    messageEndRef,
    hasMoreMessages,
    isLoadingMore,
    // NEW: Optimized state
    chatRooms,
    animatingRooms,
    lastMessageUpdates,
    handleSelectModel,
    handleFileSelect,
    clearSelectedFile,
    promptFileSelection,
    handleSendMessage,
    handleFlagMessage,
    handleDeleteMessage,
    handleTyping,
    loadMoreMessages,
    handleScroll,
    refreshModels: loadAssignedModels
  };
};

export default useModerator;