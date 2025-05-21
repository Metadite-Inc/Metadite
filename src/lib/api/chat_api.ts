
import axios from 'axios';
import { toast } from 'sonner';
import { MessageStatus } from '../../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Helper method to get auth token from localStorage
const getAuthToken = (): string | null => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    toast.error('Authentication required', {
      description: 'You must be logged in to access chat features.',
    });
    return null;
  }
  return token;
};

// Get chat rooms assigned to a moderator
export const getAssignedRooms = async () => {
  const token = getAuthToken();
  if (!token) return [];
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/moderator/rooms/`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch assigned rooms:', error);
    toast.error('Failed to load assigned rooms');
    return [];
  }
};

// Get messages for a specific room
export const getChatMessages = async (chatRoomId: number) => {
  const token = getAuthToken();
  if (!token) return [];
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/chat/rooms/${chatRoomId}/messages`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch chat messages:', error);
    toast.error('Failed to load chat messages');
    return [];
  }
};

// Send a message as moderator
export const sendModeratorMessage = async (content: string, chatRoomId: number, receiverId: number) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const message = {
      content,
      chat_room_id: chatRoomId,
      receiver_id: receiverId,
      message_type: "TEXT"
    };
    
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

// Flag a message for review
export const flagMessage = async (messageId: number, flagged: boolean) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/chat/messages/${messageId}/flag`,
      { flagged },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to flag message:', error);
    toast.error('Failed to update message flag status');
    return null;
  }
};

// WebSocket connection for real-time chat
export const connectToChatWebSocket = (chatRoomId: number, onMessage: (data: any) => void) => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/api/chat/ws/${chatRoomId}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected for chat room:', chatRoomId);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected for chat room:', chatRoomId);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return ws;
  } catch (error) {
    console.error('Failed to connect WebSocket:', error);
    return null;
  }
};
