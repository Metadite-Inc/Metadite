
import { useState, useEffect, useRef, useCallback } from 'react';
import { getMessages, markMessagesAsRead } from '../../services/ChatService';
import { toast } from 'sonner';

const useMessages = (selectedModel) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messageEndRef = useRef(null);

  // Load messages when a model is selected
  useEffect(() => {
    if (!selectedModel) {
      setMessages([]);
      return;
    }
    
    loadMessages();
  }, [selectedModel]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    if (!selectedModel) return;
    
    setLoading(true);
    try {
      const chatMessages = await getMessages(selectedModel.id);
      setMessages(chatMessages);
      setHasMoreMessages(chatMessages.length === 50); // Assuming default limit is 50
      
      // Mark messages as read
      markMessagesAsRead(selectedModel.id);
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

  // Add a new message to the state
  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Update a message in the state
  const updateMessage = useCallback((updatedMessage) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === updatedMessage.id ? updatedMessage : msg
      )
    );
  }, []);

  // Delete a message from the state
  const deleteMessageFromState = useCallback((messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  return {
    messages,
    loading,
    hasMoreMessages,
    isLoadingMore,
    messageEndRef,
    loadMoreMessages,
    addMessage,
    updateMessage,
    deleteMessageFromState,
    loadMessages
  };
};

export default useMessages;
