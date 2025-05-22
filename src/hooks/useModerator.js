
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  getModeratorChatRooms, 
  getMessages, 
  sendMessage,
  connectWebSocket,
  sendFileMessage,
  flagMessage
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
          receiverId: room.user_id // Save the user_id for sending messages
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
  const handleSelectModel = (model) => {
    // Clear input message and selected file when switching rooms
    setNewMessage('');
    clearSelectedFile();
    setSelectedModel(model);
  };
  
  // Load messages when a model is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedModel) return;
      
      setLoading(true);
      try {
        const chatMessages = await getMessages(selectedModel.id);
        setMessages(chatMessages);
        setReceiverId(selectedModel.receiverId);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
    
    // Set up WebSocket connection for real-time updates
    if (selectedModel) {
      // Close previous connection if it exists
      if (websocket) {
        websocket.close();
      }
      
      const ws = connectWebSocket(selectedModel.id, handleWebSocketMessage);
      setWebsocket(ws);
      
      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
  }, [selectedModel]);
  
  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (data) => {
    if (data.type === 'new_message') {
      setMessages(prev => [...prev, data.message]);
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
  
  // Send a new message (text or file)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || !selectedModel || !receiverId) return;
    
    setIsUploading(true);
    
    try {
      if (selectedFile) {
        const sentMessage = await sendFileMessage(selectedFile, selectedModel.id, receiverId);
        if (sentMessage) {
          // If WebSocket doesn't update the UI, we can add the message manually
          setMessages(prev => [...prev, sentMessage]);
          clearSelectedFile();
          toast.success('File sent');
        }
      }
      
      if (newMessage.trim()) {
        const sentMessage = await sendMessage(newMessage, selectedModel.id, receiverId);
        if (sentMessage) {
          // If WebSocket doesn't update the UI, we can add the message manually
          setMessages(prev => [...prev, sentMessage]);
          setNewMessage('');
          toast.success('Message sent');
        }
      }
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
    handleSelectModel,
    handleFileSelect,
    clearSelectedFile,
    promptFileSelection,
    handleSendMessage,
    handleFlagMessage
  };
};

export default useModerator;
