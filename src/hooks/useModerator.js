
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { sendMessage, sendFileMessage, flagMessage, deleteMessage, sendTypingIndicator } from '../services/ChatService';

// Import modular hooks
import useChatRooms from './moderator/useChatRooms';
import useMessages from './moderator/useMessages';
import useFileHandling from './moderator/useFileHandling';
import useWebSocketConnection from './moderator/useWebSocketConnection';
import useTypingIndicator from './moderator/useTypingIndicator';

const useModerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  // Use modular hooks
  const {
    searchTerm,
    setSearchTerm,
    assignedModels,
    loading,
    selectedModel,
    handleSelectModel: selectModel,
    updateModelUnreadCount,
    updateModelLastMessage,
    addChatRoom
  } = useChatRooms();
  
  const {
    messages,
    loading: messagesLoading,
    hasMoreMessages,
    isLoadingMore,
    messageEndRef,
    loadMoreMessages,
    addMessage,
    updateMessage,
    deleteMessageFromState
  } = useMessages(selectedModel);
  
  const {
    fileInputRef,
    selectedFile,
    previewUrl,
    isUploading,
    setIsUploading,
    handleFileSelect,
    clearSelectedFile,
    promptFileSelection
  } = useFileHandling();
  
  const { handleTyping, cleanupTypingTimeout } = useTypingIndicator(selectedModel);
  
  // Process WebSocket messages
  const handleWebSocketMessage = useCallback((data) => {
    console.log('Received WebSocket message:', data);
    
    if (data.type === 'new_message' && data.message) {
      addMessage(data.message);
      
      // Update the model's last message in the sidebar
      if (data.message.chat_room_id) {
        updateModelLastMessage(
          data.message.chat_room_id,
          data.message.content,
          data.message.created_at
        );
      }
    } else if (data.type === 'message_deleted' && data.message_id) {
      deleteMessageFromState(data.message_id);
    } else if (data.type === 'message_updated' && data.message) {
      updateMessage(data.message);
    } else if (data.type === 'new_chat_room' && data.chat_room) {
      addChatRoom(data.chat_room);
    }
  }, [addMessage, updateModelLastMessage, deleteMessageFromState, updateMessage, addChatRoom]);
  
  const {
    connectionStatus,
    typingUsers,
    websocket
  } = useWebSocketConnection(selectedModel, handleWebSocketMessage);
  
  // Redirect non-moderator users
  useEffect(() => {
    if (user?.role !== 'moderator') {
      navigate('/');
    } else {
      setIsLoaded(true);
    }
  }, [user, navigate]);
  
  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      cleanupTypingTimeout();
    };
  }, []);
  
  // Clear input when switching models
  const handleSelectModel = useCallback((model) => {
    setNewMessage('');
    clearSelectedFile();
    selectModel(model);
    
    // Update the model's unread count to 0
    updateModelUnreadCount(model.id, 0);
    
    // Scroll to bottom after switching rooms
    setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, [selectModel, updateModelUnreadCount]);
  
  // Send a new message (text or file)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || !selectedModel) return;
    
    // Make sure we have a valid chat room ID
    if (!selectedModel.id || isNaN(selectedModel.id)) {
      toast.error('Invalid chat room. Please try again.');
      return;
    }
    
    // Get user ID from selectedModel
    const userReceiverId = selectedModel.receiverId || null;
    
    setIsUploading(true);
    
    try {
      // Send file message if a file is selected
      if (selectedFile) {
        const sentMessage = await sendFileMessage(selectedFile, selectedModel.id, userReceiverId);
        if (sentMessage) {
          // Add the message manually to ensure it appears in the UI immediately
          addMessage(sentMessage);
          clearSelectedFile();
          
          // Update the model's last message in the sidebar
          updateModelLastMessage(
            selectedModel.id,
            'File: ' + selectedFile.name,
            new Date().toISOString()
          );
        }
      }
      
      // Send text message if there's text
      if (newMessage.trim()) {
        const sentMessage = await sendMessage(newMessage, selectedModel.id, userReceiverId);
        if (sentMessage) {
          // Add the message manually
          addMessage(sentMessage);
          
          // Update the model's last message in the sidebar
          updateModelLastMessage(
            selectedModel.id,
            newMessage,
            new Date().toISOString()
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
        updateMessage({ ...message, flagged: !message.flagged });
        
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
      deleteMessageFromState(messageId);
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
    loading: loading || messagesLoading,
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
