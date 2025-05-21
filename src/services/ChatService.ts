
import axios from 'axios';
import { toast } from 'sonner';
import { MessageStatus } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// WebSocket connection
let ws: WebSocket | null = null;

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

export const connectWebSocket = (chatRoomId: number, onMessage: (data: any) => void) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const userId = getUserIdFromToken(token);
    
    ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/api/chat/ws/${chatRoomId}/${userId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    return ws;
  } catch (error) {
    console.error('Failed to connect WebSocket:', error);
    return null;
  }
};

// Chat Room APIs
export const createChatRoom = async (dollId: string) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/chat/rooms/`, 
      { doll_id: dollId },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
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
  
  const response = await axios.get(
    `${API_BASE_URL}/api/chat/user/rooms/?skip=${skip}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

export const getModeratorChatRooms = async (skip: number = 0, limit: number = 100) => {
  const token = getAuthToken();
  if (!token) return null;
  
  const response = await axios.get(
    `${API_BASE_URL}/api/chat/moderator/rooms/?skip=${skip}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

export const getChatRoomById = async (chatRoomId: number) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/rooms/${chatRoomId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to get chat room:', error);
    return null;
  }
};

// Message APIs
export const sendMessage = async (content: string, chatRoomId: number, receiverId: number) => {
  const token = getAuthToken();
  if (!token) return null;
  
  const message = {
    content,
    chat_room_id: chatRoomId,
    receiver_id: receiverId,
    message_type: "TEXT"
  };
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/chat/messages/`, 
      message, 
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);
    toast.error('Failed to send message');
    return null;
  }
};

export const sendFileMessage = async (file: File, chatRoomId: number) => {
  const token = getAuthToken();
  if (!token) return null;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('chat_room_id', chatRoomId.toString());
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/chat/messages/upload`, 
      formData, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
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
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/rooms/${chatRoomId}/messages?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to get messages:', error);
    return [];
  }
};

export const deleteMessage = async (messageId: number) => {
  const token = getAuthToken();
  if (!token) return null;
  
  const response = await axios.delete(
    `${API_BASE_URL}/api/chat/messages/${messageId}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

export const getUnreadCount = async () => {
  const token = getAuthToken();
  if (!token) return null;
  
  const response = await axios.get(
    `${API_BASE_URL}/api/chat/unread-count`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

// Add a function to update message status (Read/Delivered)
export const updateMessageStatus = async (messageId: string, status: MessageStatus) => {
  const token = getAuthToken();
  if (!token) return null;
  
  const response = await axios.put(
    `${API_BASE_URL}/api/chat/messages/${messageId}/status`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data;
};

// File handling
export const getFileUrl = (filename: string) => {
  return `${API_BASE_URL}/api/chat/files/${filename}`;
};

// Mark messages as read via WebSocket
export const markMessagesAsRead = (chatRoomId: number) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
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
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      action: "typing",
      chat_room_id: chatRoomId,
      is_typing: isTyping
    }));
    return true;
  }
  return false;
};
