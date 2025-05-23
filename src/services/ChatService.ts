
import axios from 'axios';
import { toast } from 'sonner';
import { MessageStatus, MessageType } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// WebSocket connection
let ws: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let reconnectTimeout: NodeJS.Timeout | null = null;
const messageQueue: any[] = [];

// Helper method to extract user ID from JWT token
const getUserIdFromToken = (token: string): number => {
  try {
    // JWT tokens consist of three parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Extract the 'sub' claim which contains the user ID
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
    toast.error('Authentication required', {
      description: 'You must be logged in to send messages.',
    });
    return null;
  }
  return token;
};

// Helper function to process message queue
const processMessageQueue = () => {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  
  const queue = JSON.parse(localStorage.getItem('messageQueue') || '[]');
  if (queue.length === 0) return;
  
  console.log(`Processing ${queue.length} queued messages`);
  
  for (const message of queue) {
    try {
      ws.send(JSON.stringify({
        action: "create",
        message: message.content,
        chat_room_id: message.chatRoomId,
        type: message.type || "text"
      }));
      console.log('Sent queued message:', message);
    } catch (error) {
      console.error('Failed to process queued message:', error);
    }
  }
  localStorage.removeItem('messageQueue');
};

// Queue message for later sending
const queueMessage = (message: any) => {
  const queue = JSON.parse(localStorage.getItem('messageQueue') || '[]');
  queue.push(message);
  localStorage.setItem('messageQueue', JSON.stringify(queue));
  console.log('Message queued for later sending:', message);
  toast.info('Message will be sent when connection is restored');
};

// Reconnection logic
const reconnectWebSocket = (chatRoomId: number | string, onMessage: (data: any) => void) => {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    toast.error('Failed to reconnect. Please refresh the page.');
    return;
  }
  
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
  }
  
  const backoffTime = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
  console.log(`Attempting to reconnect in ${backoffTime/1000} seconds (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
  
  reconnectTimeout = setTimeout(() => {
    reconnectAttempts++;
    connectWebSocket(chatRoomId, onMessage);
  }, backoffTime);
};

// Enhanced WebSocket connection
export const connectWebSocket = (chatRoomId: number | string, onMessage: (data: any) => void) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const userId = getUserIdFromToken(token);
    
    // Close existing connection if any
    if (ws) {
      ws.close();
    }
    
    let wsUrl;
    
    // Make sure chatRoomId is valid (not NaN, undefined, or null)
    if (!chatRoomId || (typeof chatRoomId === 'number' && isNaN(chatRoomId))) {
      console.error('Invalid chat room ID:', chatRoomId);
      toast.error('Invalid chat room ID. Please try again later.');
      return null;
    }
    
    // Handle special case for global notifications
    if (chatRoomId === 'global') {
      wsUrl = `${API_BASE_URL.replace('http', 'ws')}/api/chat/ws/global/${userId}`;
    } else {
      wsUrl = `${API_BASE_URL.replace('http', 'ws')}/api/chat/ws/${chatRoomId}/${userId}`;
    }
    
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      toast.success('Connected to chat server');
      reconnectAttempts = 0;
      // Process any queued messages
      processMessageQueue();
      
      // Mark messages as read on connection (only for real chat rooms, not global)
      if (chatRoomId !== 'global') {
        markMessagesAsRead(Number(chatRoomId));
      }
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection error. Please check your internet connection.');
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      if (event.code !== 1000) { // Not a normal closure
        reconnectWebSocket(chatRoomId, onMessage);
      }
    };
    
    return ws;
  } catch (error) {
    console.error('Failed to connect WebSocket:', error);
    toast.error('Failed to establish connection. Please try again.');
    return null;
  }
};

// Send a message via WebSocket with fallback to HTTP
export const sendMessage = async (content: string, chatRoomId: number, moderatorId?: number) => {
  console.log(`Sending message to room ${chatRoomId}:`, content);
  
  // Try WebSocket first
  if (ws && ws.readyState === WebSocket.OPEN) {
    try {
      const message = {
        action: "create",
        message: content,
        chat_room_id: chatRoomId,
        type: "text"
      } as any;
      
      // Add moderator_id if provided
      if (moderatorId) {
        message['moderator_id'] = moderatorId;
      }
      
      ws.send(JSON.stringify(message));
      console.log('Message sent via WebSocket');
      return true;
    } catch (error) {
      console.error('Error sending message via WebSocket:', error);
      // Fall back to HTTP if WebSocket fails
    }
  }
  
  // Fallback to HTTP
  console.log('Falling back to HTTP for sending message');
  try {
    const result = await sendHttpMessage(content, chatRoomId, moderatorId);
    return result;
  } catch (error) {
    // Queue message for later if both methods fail
    queueMessage({ content, chatRoomId, type: "text", moderatorId });
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
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Message sent via HTTP:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send message via HTTP:', error);
    toast.error('Failed to send message');
    throw error;
  }
};

// Chat Room APIs
export const createChatRoom = async (dollId: string) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    console.log(`Creating chat room for doll ${dollId}`);
    const response = await axios.post(`${API_BASE_URL}/api/chat/rooms/`, 
      { doll_id: dollId },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Chat room created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create chat room:', error);
    toast.error('Failed to create chat room');
    return null;
  }
};

export const getUserChatRooms = async (skip: number = 0, limit: number = 100) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    console.log(`Fetching user chat rooms (skip=${skip}, limit=${limit})`);
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/user/rooms/?skip=${skip}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('User chat rooms fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user chat rooms:', error);
    toast.error('Failed to fetch chat rooms');
    return [];
  }
};

export const getModeratorChatRooms = async (skip: number = 0, limit: number = 100) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    console.log(`Fetching moderator chat rooms (skip=${skip}, limit=${limit})`);
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/moderator/rooms/?skip=${skip}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Moderator chat rooms fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch moderator chat rooms:', error);
    toast.error('Failed to fetch chat rooms');
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
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Chat room fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to get chat room:', error);
    toast.error('Failed to load chat room');
    return null;
  }
};

export const sendFileMessage = async (file: File, chatRoomId: number, receiverId?: number) => {
  const token = getAuthToken();
  if (!token) return null;
  
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
    toast.error('Failed to upload file');
    return null;
  }
};

export const getMessages = async (chatRoomId: number, skip: number = 0, limit: number = 50) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    console.log(`Fetching messages for chat room ${chatRoomId} (skip=${skip}, limit=${limit})`);
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/rooms/${chatRoomId}/messages?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log(`Fetched ${response.data.length} messages`);
    return response.data;
  } catch (error) {
    console.error('Failed to get messages:', error);
    toast.error('Failed to load messages');
    return [];
  }
};

export const deleteMessage = async (messageId: string | number) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    console.log(`Deleting message ${messageId}`);
    const response = await axios.delete(
      `${API_BASE_URL}/api/chat/messages/${messageId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Message deleted:', response.data);
    toast.success('Message deleted');
    return response.data;
  } catch (error) {
    console.error('Failed to delete message:', error);
    toast.error('Failed to delete message');
    throw error;
  }
};

export const getUnreadCount = async () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    console.log('Fetching unread message count');
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/unread-count`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Unread count:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to get unread count:', error);
    return { count: 0 };
  }
};

// Add a function to update message status (Read/Delivered)
export const updateMessageStatus = async (messageId: string, status: MessageStatus) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    console.log(`Updating message ${messageId} status to ${status}`);
    const response = await axios.put(
      `${API_BASE_URL}/api/chat/messages/${messageId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Message status updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update message status:', error);
    return null;
  }
};

// File handling
export const getFileUrl = (filename: string) => {
  if (!filename) return '';
  return `${API_BASE_URL}/api/chat/files/${filename}`;
};

// Mark messages as read via WebSocket
export const markMessagesAsRead = (chatRoomId: number) => {
  if (!chatRoomId || isNaN(chatRoomId)) {
    console.error('Invalid chat room ID for marking messages as read:', chatRoomId);
    return false;
  }
  
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log(`Marking all messages as read in room ${chatRoomId}`);
    ws.send(JSON.stringify({
      action: "read",
      chat_room_id: chatRoomId
    }));
    return true;
  }
  return false;
};

// Send typing indicator via WebSocket
export const sendTypingIndicator = (chatRoomId: number, isTyping: boolean) => {
  if (!chatRoomId || isNaN(chatRoomId)) {
    console.error('Invalid chat room ID for typing indicator:', chatRoomId);
    return false;
  }
  
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log(`Sending typing indicator: ${isTyping ? 'typing' : 'stopped typing'} in room ${chatRoomId}`);
    ws.send(JSON.stringify({
      action: "typing",
      chat_room_id: chatRoomId,
      is_typing: isTyping
    }));
    return true;
  }
  return false;
};

// Flag message for review
export const flagMessage = async (messageId: number | string, isFlagged: boolean) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    console.log(`${isFlagged ? 'Flagging' : 'Unflagging'} message ${messageId}`);
    const response = await axios.put(
      `${API_BASE_URL}/api/chat/messages/${messageId}/flag`,
      { flagged: isFlagged },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log('Message flag updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update message flag:', error);
    toast.error(`Failed to ${isFlagged ? 'flag' : 'unflag'} message`);
    return null;
  }
};
