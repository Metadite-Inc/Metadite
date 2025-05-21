
import axios from 'axios';
import { toast } from 'sonner';
import { MessageStatus, MessageType, WebSocketMessage } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Helper method to get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// ----- User Chat Functions -----

// Get chat messages
export const getMessages = async (dollId: string, limit = 50, before?: Date, token?: string) => {
  const authToken = token || getToken();
  if (!authToken) return [];

  try {
    let url = `${API_BASE_URL}/api/chat/messages?doll_id=${dollId}&limit=${limit}`;
    if (before) {
      url += `&before=${before.toISOString()}`;
    }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    toast.error('Failed to load messages');
    return [];
  }
};

// Send a text message
export const sendMessage = async (message: { content: string, message_type: MessageType, doll_id: string }, token?: string) => {
  const authToken = token || getToken();
  if (!authToken) throw new Error('Authentication token required');

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/chat/messages`, 
      message,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Failed to send message');
    throw error;
  }
};

// Send a file message (image or document)
export const sendFileMessage = async (file: File, dollId: string, token?: string) => {
  const authToken = token || getToken();
  if (!authToken) throw new Error('Authentication token required');

  try {
    // Determine message type based on file type
    const isImage = file.type.startsWith('image/');
    const messageType = isImage ? MessageType.IMAGE : MessageType.FILE;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doll_id', dollId);
    formData.append('message_type', messageType);

    const response = await axios.post(
      `${API_BASE_URL}/api/chat/messages/upload`, 
      formData,
      { 
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        } 
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload file');
    throw error;
  }
};

// Connect to WebSocket for real-time chat
export const connectWebSocket = (userId: string, onMessage: (data: any) => void) => {
  const authToken = getToken();
  if (!authToken) return null;
  
  const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/api/chat/ws/${userId}`;
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('WebSocket connected for user:', userId);
    // Send authentication token
    ws.send(JSON.stringify({ type: 'auth', token: authToken }));
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return ws;
};

// Send typing indicator
export const sendTypingIndicator = (dollId: string, isTyping: boolean) => {
  const authToken = getToken();
  if (!authToken) return;
  
  try {
    axios.post(
      `${API_BASE_URL}/api/chat/typing`, 
      { doll_id: dollId, is_typing: isTyping },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
  } catch (error) {
    console.error('Error sending typing indicator:', error);
  }
};

// Update message status (read, delivered)
export const updateMessageStatus = async (messageId: string, status: MessageStatus, token?: string) => {
  const authToken = token || getToken();
  if (!authToken) throw new Error('Authentication token required');

  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/chat/messages/${messageId}/status`, 
      { status },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating message status:', error);
    toast.error('Failed to update message status');
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (messageId: string, token?: string) => {
  const authToken = token || getToken();
  if (!authToken) throw new Error('Authentication token required');

  try {
    await axios.delete(
      `${API_BASE_URL}/api/chat/messages/${messageId}`, 
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    toast.error('Failed to delete message');
    throw error;
  }
};

// ----- Moderator Chat Functions -----

// Get chat rooms assigned to a moderator
export const getAssignedRooms = async () => {
  const token = getToken();
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
  const token = getToken();
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
  const token = getToken();
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

// Send a file message as moderator (image or document)
export const sendModeratorFileMessage = async (file: File, chatRoomId: number, receiverId: number) => {
  const token = getToken();
  if (!token) return null;
  
  try {
    // Determine message type based on file type
    const messageType = file.type.startsWith('image/') ? "IMAGE" : "FILE";
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chat_room_id', chatRoomId.toString());
    formData.append('receiver_id', receiverId.toString());
    formData.append('message_type', messageType);
    
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

// Flag a message for review
export const flagMessage = async (messageId: number, flagged: boolean) => {
  const token = getToken();
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

// WebSocket connection for real-time chat moderator
export const connectToChatWebSocket = (chatRoomId: number, onMessage: (data: any) => void) => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/api/chat/ws/${chatRoomId}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected for chat room:', chatRoomId);
      // Send authentication token
      ws.send(JSON.stringify({ type: 'auth', token: token }));
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
