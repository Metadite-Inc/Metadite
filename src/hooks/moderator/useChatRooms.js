
import { useState, useEffect, useCallback } from 'react';
import { getModeratorChatRooms } from '../../services/ChatService';
import { toast } from 'sonner';

const useChatRooms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedModels, setAssignedModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);

  // Load assigned models/dolls when component mounts
  useEffect(() => {
    loadAssignedModels();
  }, []);

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

  // Handle model selection
  const handleSelectModel = useCallback((model) => {
    setSelectedModel(model);
  }, []);

  // Update model unread count
  const updateModelUnreadCount = useCallback((modelId, count = 0) => {
    setAssignedModels(prev => 
      prev.map(model => 
        model.id === modelId 
          ? { ...model, unreadCount: count }
          : model
      )
    );
  }, []);

  // Update model last message
  const updateModelLastMessage = useCallback((modelId, message, timestamp) => {
    setAssignedModels(prev => 
      prev.map(model => 
        model.id === modelId 
          ? {
              ...model,
              lastMessage: message,
              lastMessageTime: timestamp || new Date().toISOString()
            }
          : model
      )
    );
  }, []);

  // Add a new chat room
  const addChatRoom = useCallback((chatRoom) => {
    setAssignedModels(prev => {
      // Check if we already have this chat room
      const exists = prev.some(model => model.id === chatRoom.id);
      if (exists) return prev;
      
      const newModel = {
        id: chatRoom.id,
        name: chatRoom.doll_name || `Model ${chatRoom.id}`,
        image: chatRoom.doll_image || 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
        receiverId: chatRoom.user_id,
        lastMessage: 'New conversation',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 1
      };
      
      toast.info(`New chat room created for ${newModel.name}`, {
        description: 'Click to view the conversation',
        action: {
          label: 'View',
          onClick: () => handleSelectModel(newModel)
        }
      });
      
      return [...prev, newModel];
    });
  }, [handleSelectModel]);

  return {
    searchTerm,
    setSearchTerm,
    assignedModels,
    loading,
    selectedModel,
    handleSelectModel,
    updateModelUnreadCount,
    updateModelLastMessage,
    addChatRoom,
    loadAssignedModels
  };
};

export default useChatRooms;
