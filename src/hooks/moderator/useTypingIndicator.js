
import { useRef, useCallback } from 'react';
import { sendTypingIndicator } from '../../services/ChatService';

const useTypingIndicator = (selectedModel) => {
  const typingTimeoutRef = useRef(null);
  
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
  const cleanupTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  return {
    handleTyping,
    cleanupTypingTimeout
  };
};

export default useTypingIndicator;
