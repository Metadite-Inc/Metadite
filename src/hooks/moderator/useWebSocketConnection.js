
import { useState, useEffect, useCallback } from 'react';
import { connectWebSocket } from '../../services/ChatService';

const useWebSocketConnection = (selectedModel, onMessageReceived) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [websocket, setWebsocket] = useState(null);

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    if (!selectedModel || !selectedModel.id || isNaN(selectedModel.id)) {
      setConnectionStatus('disconnected');
      return;
    }
    
    // Close previous connection if it exists
    if (websocket) {
      websocket.close();
    }
    
    setConnectionStatus('connecting');
    
    const ws = connectWebSocket(selectedModel.id, (data) => {
      // Forward the message to the message handler
      if (onMessageReceived) {
        onMessageReceived(data);
      }
      
      // Handle typing indicators separately
      if (data.type === 'typing' && data.user_id) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (data.is_typing) {
            newSet.add(data.user_id);
          } else {
            newSet.delete(data.user_id);
          }
          return newSet;
        });
      }
    });
    
    if (ws) {
      setWebsocket(ws);
      
      // Update WebSocket event handlers to manage connection status
      ws.onopen = () => {
        setConnectionStatus('connected');
      };
      
      ws.onclose = () => {
        setConnectionStatus('disconnected');
      };
      
      ws.onerror = () => {
        setConnectionStatus('error');
      };
    }
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [selectedModel, onMessageReceived]);

  return {
    connectionStatus,
    typingUsers,
    setTypingUsers,
    websocket
  };
};

export default useWebSocketConnection;
