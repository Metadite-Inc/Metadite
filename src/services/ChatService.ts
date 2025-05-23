import axios from 'axios';
import { toast } from 'sonner';
import { MessageType, MessageStatus, ChatError, ConnectionState, QueuedMessage } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Connection state management
let connectionState: ConnectionState = {
  status: 'disconnected',
  reconnectAttempts: 0,
  maxReconnectAttempts: 5
};

// WebSocket connection
let ws: WebSocket | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;

// Message queue for offline messages
let messageQueue: QueuedMessage[] = [];

// Event listeners for connection state changes
const connectionListeners: ((state: ConnectionState) => void)[] = [];

// Helper method to extract user ID from JWT token
const getUserIdFromToken = (token: string): number => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    if (payload && payload.sub) {
      return Number(payload.sub);
    } else {
      throw new Error('User ID not found in token');
    }
  } catch (error) {
    console.error('Failed to extract user ID from token:', error);
    throw new Error('Failed to extract user ID from token');
  }
};

// Get auth token from localStorage and validate
const getAuthToken = (): string | null => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    const error: ChatError = {
      type: 'authentication',
      message: 'Authentication required',
      details: 'You must be logged in to use chat features.'
    };
    handleChatError(error);
    return null;
  }
  return token;
};

// Centralized error handling
const handleChatError = (error: ChatError) => {
  console.error(`Chat ${error.type} error:`, error.message, error.details);
  
  switch (error.type) {
    case 'authentication':
      toast.error('Authentication required', {
        description: error.details || 'You must be logged in to send messages.',
      });
      break;
    case 'connection':
      toast.error('Connection error', {
        description: error.details || 'Unable to connect to chat server.',
      });
      break;
    case 'validation':
      toast.error('Invalid data', {
        description: error.details || 'Please check your input and try again.',
      });
      break;
    default:
      toast.error('Chat error', {
        description: error.details || 'An unexpected error occurred.',
      });
  }
};

// Update connection state and notify listeners
const updateConnectionState = (newState: Partial<ConnectionState>) => {
  connectionState = { ...connectionState, ...newState };
  connectionListeners.forEach(listener => listener(connectionState));
};

// Add connection state listener
export const addConnectionListener = (listener: (state: ConnectionState) => void) => {
  connectionListeners.push(listener);
  // Immediately call with current state
  listener(connectionState);
  
  // Return unsubscribe function
  return () => {
    const index = connectionListeners.indexOf(listener);
    if (index > -1) {
      connectionListeners.splice(index, 1);
    }
  };
};

// Helper function to process message queue
const processMessageQueue = async () => {
  if (!ws || ws.readyState !== WebSocket.OPEN || messageQueue.length === 0) return;
  
  console.log(`Processing ${messageQueue.length} queued messages`);
  
  const processedMessages: string[] = [];
  
  for (const queuedMessage of messageQueue) {
    try {
      if (queuedMessage.retryCount >= 3) {
        console.warn('Message exceeded retry limit, discarding:', queuedMessage);
        processedMessages.push(queuedMessage.id);
        continue;
      }
      
      ws.send(JSON.stringify({
        action: "create",
        message: queuedMessage.content,
        chat_room_id: queuedMessage.chatRoomId,
        type: queuedMessage.type,
        moderator_id: queuedMessage.moderatorId
      }));
      
      console.log('Sent queued message:', queuedMessage);
      processedMessages.push(queuedMessage.id);
    } catch (error) {
      console.error('Failed to process queued message:', error);
      queuedMessage.retryCount++;
    }
  }
  
  // Remove processed messages from queue
  messageQueue = messageQueue.filter(msg => !processedMessages.includes(msg.id));
  
  if (processedMessages.length > 0) {
    toast.success(`Sent ${processedMessages.length} queued messages`);
  }
};

// Queue message for later sending
const queueMessage = (content: string, chatRoomId: number, type: MessageType = MessageType.TEXT, moderatorId?: number) => {
  const queuedMessage: QueuedMessage = {
    id: Date.now().toString(),
    content,
    chatRoomId,
    type,
    moderatorId,
    timestamp: new Date(),
    retryCount: 0
  };
  
  messageQueue.push(queuedMessage);
  console.log('Message queued for later sending:', queuedMessage);
  toast.info('Message will be sent when connection is restored');
};

// Reconnection logic with exponential backoff
const reconnectWebSocket = (chatRoomId: number, onMessage: (data: any) => void) => {
  if (connectionState.reconnectAttempts >= connectionState.maxReconnectAttempts) {
    updateConnectionState({ status: 'error' });
    toast.error('Failed to reconnect. Please refresh the page.');
    return;
  }
  
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }
  
  updateConnectionState({ 
    status: 'reconnecting',
    reconnectAttempts: connectionState.reconnectAttempts + 1
  });
  
  const backoffTime = Math.min(1000 * Math.pow(2, connectionState.reconnectAttempts), 30000);
  console.log(`Attempting to reconnect in ${backoffTime/1000} seconds (attempt ${connectionState.reconnectAttempts}/${connectionState.maxReconnectAttempts})`);
  
  reconnectTimeout = setTimeout(() => {
    connectWebSocket(chatRoomId, onMessage);
  }, backoffTime);
};

// Enhanced WebSocket connection
export const connectWebSocket = (chatRoomId: number | string, onMessage: (data: any) => void) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const userId = getUserIdFromToken(token);
    
    // Validate chat room ID to prevent NaN issues
    const validChatRoomId = Number(chatRoomId);
    if (isNaN(validChatRoomId)) {
      const error: ChatError = {
        type: 'validation',
        message: 'Invalid chat room ID',
        details: `Received: ${chatRoomId}`
      };
      handleChatError(error);
      return null;
    }
    
    // Close existing connection if any
    if (ws) {
      ws.close();
      ws = null;
    }
    
    updateConnectionState({ status: 'connecting' });
    
    // Build the WebSocket URL - match the working example
    // const protocol = API_BASE_URL.startsWith('https') ? 'wss:' : 'ws:';
    // const wsUrl = `${protocol}//${API_BASE_URL}/api/chat/ws/${validChatRoomId}/${userId}`;
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/api/chat/ws/${validChatRoomId}/${userId}`;
    
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    console.log(`User ID: ${userId}, Chat Room ID: ${validChatRoomId}`);
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = async () => {
      console.log('WebSocket connected successfully');
      updateConnectionState({ 
        status: 'connected',
        reconnectAttempts: 0,
        lastConnected: new Date()
      });
      
      // Send join message like in the working example
      try {
        ws.send(JSON.stringify({
          action: "join",
          chat_room_id: validChatRoomId,
          user_id: userId
        }));
        console.log('Sent join message to WebSocket');
      } catch (error) {
        console.error('Failed to send join message:', error);
      }
      
      // Process any queued messages
      await processMessageQueue();
      
      // Mark messages as read
      markMessagesAsRead(validChatRoomId);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        // Handle the message format from your backend (matching the working example)
        if (data.action === "create") {
          // Transform backend message format to frontend format
          const normalizedData = {
            type: 'new_message',
            message: {
              id: data.id,
              content: data.message || data.content,
              sender_id: data.sender_id,
              sender_name: data.sender_name,
              chat_room_id: data.chat_room_id,
              message_type: data.type || 'TEXT',
              created_at: data.timestamp || new Date().toISOString(),
              file_url: data.file_url,
              file_name: data.file_name,
              updated_at: data.updated
            }
          };
          onMessage(normalizedData);
        } else if (data.action === "delete") {
          onMessage({
            type: 'message_deleted',
            message_id: data.id
          });
        } else if (data.action === "update") {
          onMessage({
            type: 'message_updated',
            message: {
              id: data.id,
              content: data.message || data.content,
              updated_at: data.updated
            }
          });
        } else if (data.action === "notification") {
          // Handle system notifications
          console.log('System notification:', data.message);
        } else if (data.type === "history") {
          // Handle message history from WebSocket
          if (data.messages && data.messages.length > 0) {
            data.messages.forEach(msg => {
              onMessage({
                type: 'new_message',
                message: {
                  id: msg.id,
                  content: msg.content,
                  sender_id: msg.sender_id,
                  sender_name: msg.sender_name,
                  chat_room_id: msg.chat_room_id,
                  message_type: msg.message_type || 'TEXT',
                  created_at: msg.created_at,
                  file_url: msg.file_url,
                  file_name: msg.file_name
                }
              });
            });
          }
        } else {
          // Handle other message types (typing, etc.)
          onMessage(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error, event.data);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      const chatError: ChatError = {
        type: 'connection',
        message: 'WebSocket connection error',
        details: error
      };
      handleChatError(chatError);
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      updateConnectionState({ status: 'disconnected' });
      
      // Only attempt reconnection if it wasn't a clean close (1000) and we haven't exceeded max attempts
      if (event.code !== 1000 && connectionState.reconnectAttempts < connectionState.maxReconnectAttempts) {
        console.log('WebSocket closed unexpectedly, attempting to reconnect...');
        reconnectWebSocket(validChatRoomId, onMessage);
      } else if (event.code === 1000) {
        console.log('WebSocket closed cleanly, no reconnection needed');
      } else {
        console.log('Max reconnection attempts reached or permanent failure');
        updateConnectionState({ status: 'error' });
      }
    };
    
    return ws;
  } catch (error) {
    console.error('Failed to connect WebSocket:', error);
    const chatError: ChatError = {
      type: 'connection',
      message: 'Failed to establish WebSocket connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    handleChatError(chatError);
    return null;
  }
};

// Send a message via WebSocket with fallback to HTTP
export const sendMessage = async (content: string, chatRoomId: number, moderatorId?: number) => {
  if (!content.trim()) {
    const error: ChatError = {
      type: 'validation',
      message: 'Message content cannot be empty'
    };
    handleChatError(error);
    return null;
  }
  
  console.log(`Sending message to room ${chatRoomId}:`, content);
  console.log('Current WebSocket state:', ws?.readyState);
  
  // Try WebSocket first (matching your working example format)
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      const message = {
        action: "create",
        message: content,
        chat_room_id: chatRoomId,
        type: "text",
        sender_id: getUserIdFromToken(getAuthToken()!)
      } as any;
      
      if (moderatorId) {
        message.moderator_id = moderatorId;
      }
      
      console.log('Sending WebSocket message:', message);
      ws.send(JSON.stringify(message));
      console.log('Message sent via WebSocket successfully');
      return { success: true, method: 'websocket' };
    } catch (error) {
      console.error('Error sending message via WebSocket:', error);
    }
  } else {
    console.log('WebSocket not available, state:', ws?.readyState);
  }
  
  // Fallback to HTTP
  console.log('Falling back to HTTP for sending message');
  try {
    const result = await sendHttpMessage(content, chatRoomId, moderatorId);
    return result;
  } catch (error) {
    // Queue message if both WebSocket and HTTP fail
    queueMessage(content, chatRoomId, MessageType.TEXT, moderatorId);
    throw error;
  }
};

// Send messages with HTTP
export const sendHttpMessage = async (content: string, chatRoomId: number, moderatorId?: number) => {
  const token = getAuthToken();
  if (!token) return null;
  
  const message: any = {
    content,
    chat_room_id: chatRoomId,
    message_type: MessageType.TEXT
  };
  
  if (moderatorId) {
    message.moderator_id = moderatorId;
  }
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/chat/messages/`, 
      message, 
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000 // 10 second timeout
      }
    );
    console.log('Message sent via HTTP:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send message via HTTP:', error);
    
    if (axios.isAxiosError(error)) {
      const chatError: ChatError = {
        type: 'server',
        message: 'Failed to send message',
        details: error.response?.data?.detail || error.message
      };
      handleChatError(chatError);
    }
    
    throw error;
  }
};

// Chat Room APIs with better error handling
export const createChatRoom = async (dollId: string) => {
  const token = getAuthToken();
  if (!token) return null;
  
  if (!dollId || isNaN(Number(dollId))) {
    const error: ChatError = {
      type: 'validation',
      message: 'Invalid doll ID',
      details: `Received: ${dollId}`
    };
    handleChatError(error);
    return null;
  }
  
  try {
    console.log(`Creating chat room for doll ${dollId}`);
    const response = await axios.post(`${API_BASE_URL}/api/chat/rooms/`, 
      { doll_id: dollId },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      }
    );
    console.log('Chat room created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create chat room:', error);
    
    if (axios.isAxiosError(error)) {
      const chatError: ChatError = {
        type: 'server',
        message: 'Failed to create chat room',
        details: error.response?.data?.detail || error.message
      };
      handleChatError(chatError);
    }
    
    return null;
  }
};

export const getUserChatRooms = async (skip: number = 0, limit: number = 100) => {
  const token = getAuthToken();
  if (!token) return [];
  
  try {
    console.log(`Fetching user chat rooms (skip=${skip}, limit=${limit})`);
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/user/rooms/?skip=${skip}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      }
    );
    console.log('User chat rooms fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user chat rooms:', error);
    return [];
  }
};

export const getModeratorChatRooms = async (skip: number = 0, limit: number = 100) => {
  const token = getAuthToken();
  if (!token) return [];
  
  try {
    console.log(`Fetching moderator chat rooms (skip=${skip}, limit=${limit})`);
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/moderator/rooms/?skip=${skip}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      }
    );
    console.log('Moderator chat rooms fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch moderator chat rooms:', error);
    return [];
  }
};

export const getChatRoomById = async (chatRoomId: number) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    console.log(`Fetching chat room ${chatRoomId}`);
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/rooms/${chatRoomId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      }
    );
    console.log('Chat room fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to get chat room:', error);
    return null;
  }
};

export const sendFileMessage = async (file: File, chatRoomId: number, receiverId?: number) => {
  const token = getAuthToken();
  if (!token) return null;
  
  // Validate file
  if (!file) {
    const error: ChatError = {
      type: 'validation',
      message: 'No file selected'
    };
    handleChatError(error);
    return null;
  }
  
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    const error: ChatError = {
      type: 'validation',
      message: 'File too large',
      details: 'Maximum file size is 10MB'
    };
    handleChatError(error);
    return null;
  }
  
  console.log(`Uploading file to chat room ${chatRoomId}:`, file.name);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('chat_room_id', chatRoomId.toString());
  
  if (receiverId) {
    formData.append('receiver_id', receiverId.toString());
  }
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/chat/messages/${chatRoomId}/upload`, 
      formData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000, // 30 seconds for file upload
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      }
    );
    console.log('File uploaded successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to upload file:', error);
    
    if (axios.isAxiosError(error)) {
      const chatError: ChatError = {
        type: 'server',
        message: 'Failed to upload file',
        details: error.response?.data?.detail || error.message
      };
      handleChatError(chatError);
    }
    
    return null;
  }
};

export const getMessages = async (chatRoomId: number, skip: number = 0, limit: number = 50) => {
  const token = getAuthToken();
  if (!token) return [];
  
  try {
    console.log(`Fetching messages for chat room ${chatRoomId} (skip=${skip}, limit=${limit})`);
    
    // Use the same endpoint format as your working example
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/rooms/${chatRoomId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      }
    );
    
    console.log('Chat room with messages fetched:', response.data);
    
    // Extract messages from the room data
    const messages = response.data.messages || [];
    
    // Apply pagination manually if needed
    const paginatedMessages = messages.slice(skip, skip + limit);
    
    return paginatedMessages;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    
    if (axios.isAxiosError(error)) {
      const chatError: ChatError = {
        type: 'server',
        message: 'Failed to fetch messages',
        details: error.response?.data?.detail || error.message
      };
      handleChatError(chatError);
    }
    
    return [];
  }
};

export const deleteMessage = async (messageId: string | number) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/chat/messages/${messageId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000
      }
    );
    console.log('Message deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to delete message:', error);
    
    if (axios.isAxiosError(error)) {
      const chatError: ChatError = {
        type: 'server',
        message: 'Failed to delete message',
        details: error.response?.data?.detail || error.message
      };
      handleChatError(chatError);
    }
    
    throw error;
  }
};

export const getUnreadCount = async () => {
  const token = getAuthToken();
  if (!token) return 0;
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/unread-count`,
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      }
    );
    return response.data.count || 0;
  } catch (error) {
    console.error('Failed to get unread count:', error);
    return 0;
  }
};

export const updateMessageStatus = async (messageId: string, status: MessageStatus) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/chat/messages/${messageId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update message status:', error);
    return null;
  }
};

export const getFileUrl = (filename: string) => {
  return `${API_BASE_URL}/api/chat/files/${filename}`;
};

export const markMessagesAsRead = (chatRoomId: number) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify({
        action: "read",
        chat_room_id: chatRoomId
      }));
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  }
};

export const sendTypingIndicator = (chatRoomId: number, isTyping: boolean) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      ws.send(JSON.stringify({
        action: "typing",
        chat_room_id: chatRoomId,
        is_typing: isTyping
      }));
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  }
};

export const flagMessage = async (messageId: number | string, isFlagged: boolean) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/chat/messages/${messageId}/flag`,
      { flagged: isFlagged },
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to flag message:', error);
    
    if (axios.isAxiosError(error)) {
      const chatError: ChatError = {
        type: 'server',
        message: 'Failed to update message flag',
        details: error.response?.data?.detail || error.message
      };
      handleChatError(chatError);
    }
    
    throw error;
  }
};

// Cleanup function to close connections and clear timeouts
export const cleanup = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
  
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  
  messageQueue = [];
  connectionListeners.length = 0;
  
  updateConnectionState({
    status: 'disconnected',
    reconnectAttempts: 0
  });
};

// Export connection state for components to use
export const getConnectionState = () => connectionState;
