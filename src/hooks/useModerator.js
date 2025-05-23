import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  cleanup
} from '../services/ChatService';

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
  
  // Redirect non-moderator users
  useEffect(() => {
    if (user?.role !== 'moderator') {
      navigate('/');
    } else {
      setIsLoaded(true);
    }
  }, [user, navigate]);
  
  // Set up connection state listener
  useEffect(() => {
    const unsubscribe = addConnectionListener((state) => {
      setConnectionStatus(state.status);
    });
    
    return unsubscribe;
  }, []);
  
  // Load assigned models/dolls when component mounts
  useEffect(() => {
    const loadAssignedModels = async () => {
      setLoading(true);
      try {
        const rooms = await getModeratorChatRooms();
        
        if (!rooms) {
          toast.error('Failed to load assigned models');
          return;
        }
        
        // Format the rooms data for display
        const models = rooms.map(room => ({
          id: room.id,
          name: room.doll_name || `Model ${room.id}`,
          image: room.doll_image || 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
          receiverId: room.user_id,
          lastMessage: room.last_message?.content || 'No messages yet',
          lastMessageTime: room.last_message?.created_at || null,
          unreadCount: room.unread_count || 0
        }));
        
        setAssignedModels(models);
      } catch (error) {
        console.error('Error loading assigned models:', error);
        toast.error('Failed to load assigned models');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'moderator') {
      loadAssignedModels();
    }
  }, [user]);
  
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
  
  // Load messages when a model is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedModel) return;
      
      setLoading(true);
      try {
        console.log(`Loading messages for chat room ${selectedModel.id}`);
        const chatMessages = await getMessages(selectedModel.id);
        if (chatMessages) {
          console.log(`Loaded ${chatMessages.length} messages`);
          setMessages(chatMessages);
          setReceiverId(selectedModel.receiverId);
          setHasMoreMessages(chatMessages.length === 50);
        }
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
    
    // Load messages first
    loadMessages();
    
    // Set up WebSocket connection for real-time updates
    if (selectedModel && selectedModel.id) {
      const chatRoomId = Number(selectedModel.id);
      if (isNaN(chatRoomId)) {
        console.error('Invalid chat room ID:', selectedModel.id);
        toast.error('Invalid chat room ID');
        return;
      }
      
      // Clear messages and reset state when switching rooms
      setMessages([]);
      setTypingUsers(new Set());
      
      // Close previous connection if it exists
      if (websocket) {
        console.log('Closing previous WebSocket connection');
        websocket.close();
        setWebsocket(null);
      }
      
      // Small delay to ensure previous connection is closed
      const connectTimer = setTimeout(() => {
        console.log(`Moderator connecting to WebSocket for room ${chatRoomId}`);
        const ws = connectWebSocket(chatRoomId, handleWebSocketMessage);
        
        if (ws) {
          setWebsocket(ws);
          
          // Store original handlers
          const originalOnOpen = ws.onopen;
          const originalOnClose = ws.onclose;
          
          // Override the onopen event
          ws.onopen = (event) => {
            console.log('Moderator WebSocket connected');
            markMessagesAsRead(chatRoomId);
            
            setAssignedModels(prev => 
              prev.map(model => 
                model.id === selectedModel.id 
                  ? { ...model, unreadCount: 0 }
                  : model
              )
            );
            
            if (originalOnOpen) originalOnOpen.call(ws, event);
          };
          
          // Override onclose to prevent automatic reconnection for moderators
          ws.onclose = (event) => {
            console.log('Moderator WebSocket disconnected:', event.code, event.reason);
            
            // Don't call original onclose which might trigger reconnection
            // Only log the disconnection for moderators
            if (event.code !== 1000) {
              console.warn('WebSocket closed unexpectedly, but not reconnecting for moderator');
            }
          };
        }
      }, 100);
      
      return () => {
        clearTimeout(connectTimer);
        if (ws && ws.readyState === WebSocket.OPEN) {
          console.log('Cleaning up WebSocket connection');
          ws.close(1000, 'Component unmounting'); // Clean close
        }
      };
    }
  }, [selectedModel?.id]); // Only depend on selectedModel.id, not the whole object or websocket
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Load more messages when scrolling up
  const loadMoreMessages = async () => {
    if (!selectedModel || isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    try {
      const olderMessages = await getMessages(selectedModel.id, messages.length);
      
      if (olderMessages && olderMessages.length > 0) {
        setMessages(prev => [...olderMessages, ...prev]);
        setHasMoreMessages(olderMessages.length === 50); // Assuming default limit is 50
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
  
  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback((data) => {
    console.log('Moderator received WebSocket message:', data);
    
    if (data.type === 'new_message' && data.message) {
      console.log('Adding new message to moderator chat:', data.message);
      setMessages(prev => {
        // Prevent duplicate messages by checking ID and timestamp
        const exists = prev.some(msg => 
          msg.id === data.message.id || 
          (msg.content === data.message.content && 
           Math.abs(new Date(msg.created_at) - new Date(data.message.created_at)) < 1000)
        );
        if (exists) {
          console.log('Duplicate message detected, skipping');
          return prev;
        }
        return [...prev, data.message];
      });
      
      // Update the model's last message in the sidebar
      setAssignedModels(prev => 
        prev.map(model => 
          model.id.toString() === data.message.chat_room_id.toString()
            ? {
                ...model,
                lastMessage: data.message.content,
                lastMessageTime: data.message.created_at
              }
            : model
        )
      );
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
  }, []); // No dependencies to prevent recreation

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
  
  // Clear selected file
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
            sender_name: user.full_name || 'Moderator',
            content: selectedFile.name,
            file_name: selectedFile.name,
            created_at: new Date().toISOString(),
            flagged: false,
            message_type: selectedFile.type.startsWith('image/') ? 'IMAGE' : 'FILE',
            file_url: selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null
          };
          
          setMessages(prev => [...prev, fileMessage]);
          clearSelectedFile();
          
          setAssignedModels(prev => 
            prev.map(model => 
              model.id === selectedModel.id 
                ? {
                    ...model,
                    lastMessage: 'File: ' + selectedFile.name,
                    lastMessageTime: new Date().toISOString()
                  }
                : model
            )
          );
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
          sender_name: user.full_name || 'Moderator',
          content: newMessage,
          created_at: new Date().toISOString(),
          flagged: false,
          message_type: 'TEXT'
        };
        
        setMessages(prev => [...prev, textMessage]);
        
        setAssignedModels(prev => 
          prev.map(model => 
            model.id === selectedModel.id 
              ? {
                  ...model,
                  lastMessage: newMessage,
                  lastMessageTime: new Date().toISOString()
                }
              : model
          )
        );
        
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
  
  // Toggle flag status for a message
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
  
  // Handle message deletion
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
    handleSelectModel,
    handleFileSelect,
    clearSelectedFile,
    promptFileSelection,
    handleSendMessage,
    handleFlagMessage,
    handleDeleteMessage,
    handleTyping,
    loadMoreMessages
  };
};

export default useModerator;
