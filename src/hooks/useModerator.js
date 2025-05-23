
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
  deleteMessage
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
  
  // Load assigned models/dolls when component mounts
  useEffect(() => {
    const loadAssignedModels = async () => {
      setLoading(true);
      try {
        const rooms = await getModeratorChatRooms();
        
        // Format the rooms data for display
        const models = rooms.map(room => ({
          id: room.id,
          name: room.doll_name || `Model ${room.id}`,
          image: room.doll_image || 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
          receiverId: room.user_id, // Save the user_id for sending messages
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
  
  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback((data) => {
    console.log('Received WebSocket message:', data);
    
    if (data.type === 'new_message' && data.message) {
      setMessages(prev => [...prev, data.message]);
      
      // Update the model's last message in the sidebar
      setAssignedModels(prev => 
        prev.map(model => 
          model.id === data.message.chat_room_id 
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
          msg.id === data.message.id ? data.message : msg
        )
      );
    } else if (data.type === 'new_chat_room' && data.chat_room) {
      setAssignedModels(prev => {
        // Check if we already have this chat room
        const exists = prev.some(model => model.id === data.chat_room.id);
        if (exists) return prev;
        
        const newModel = {
          id: data.chat_room.id,
          name: data.chat_room.doll_name || `Model ${data.chat_room.id}`,
          image: data.chat_room.doll_image || 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
          receiverId: data.chat_room.user_id,
          lastMessage: 'New conversation',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 1
        };
        
        toast.success(`New chat room created for ${newModel.name}`, {
          description: 'Click to view the conversation',
          action: {
            label: 'View',
            onClick: () => handleSelectModel(newModel)
          }
        });
        
        return [...prev, newModel];
      });
    }
  }, []);
  
  // Handle model selection
  const handleSelectModel = useCallback((model) => {
    console.log("Selected model:", model);
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
      
      console.log("Loading messages for model:", selectedModel);
      setLoading(true);
      try {
        const chatMessages = await getMessages(selectedModel.id);
        setMessages(chatMessages);
        setReceiverId(selectedModel.receiverId);
        setHasMoreMessages(chatMessages.length === 50); // Assuming default limit is 50
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
        
        // Scroll to bottom after loading messages
        setTimeout(() => {
          messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };
    
    loadMessages();
    
    // Set up WebSocket connection for real-time updates
    if (selectedModel) {
      // Close previous connection if it exists
      if (websocket) {
        websocket.close();
      }
      
      setConnectionStatus('connecting');
      console.log("Connecting to WebSocket for room ID:", selectedModel.id);
      const ws = connectWebSocket(selectedModel.id, handleWebSocketMessage);
      
      if (ws) {
        setWebsocket(ws);
        
        // Update WebSocket event handlers to manage connection status
        ws.onopen = () => {
          setConnectionStatus('connected');
          console.log("WebSocket connected for room:", selectedModel.id);
          // Mark messages as read when joining a chat room
          markMessagesAsRead(selectedModel.id);
          
          // Update the model's unread count to 0
          setAssignedModels(prev => 
            prev.map(model => 
              model.id === selectedModel.id 
                ? { ...model, unreadCount: 0 }
                : model
            )
          );
        };
        
        ws.onclose = () => {
          setConnectionStatus('disconnected');
          console.log("WebSocket disconnected for room:", selectedModel.id);
        };
        
        ws.onerror = (error) => {
          setConnectionStatus('error');
          console.error("WebSocket error for room:", selectedModel.id, error);
        };
      }
      
      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
  }, [selectedModel, handleWebSocketMessage]);
  
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
      
      if (olderMessages.length > 0) {
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
  
  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  // Send a new message (text or file)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || !selectedModel) return;
    
    console.log("Sending message to room:", selectedModel.id, "receiver:", receiverId);
    setIsUploading(true);
    
    try {
      if (selectedFile) {
        const sentMessage = await sendFileMessage(selectedFile, selectedModel.id, receiverId);
        if (sentMessage) {
          // Add the message manually to ensure it appears in the UI immediately
          setMessages(prev => [...prev, sentMessage]);
          clearSelectedFile();
          
          // Update the model's last message in the sidebar
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
      
      if (newMessage.trim()) {
        const sentMessage = await sendMessage(newMessage, selectedModel.id, receiverId);
        if (sentMessage) {
          // Add the message manually to ensure it appears in the UI immediately
          setMessages(prev => [...prev, sentMessage]);
          
          // Update the model's last message in the sidebar
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
        }
      }
      
      // Clear input after sending
      setNewMessage('');
      
      // Stop typing indicator
      sendTypingIndicator(selectedModel.id, false);
      
      // Scroll to bottom after sending
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
      toast.error('Failed to update message flag');
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
      toast.error('Failed to delete message');
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
