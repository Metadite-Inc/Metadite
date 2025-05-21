
import axios from 'axios';
import { MessageStatus, MessageType } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Get authentication token from localStorage
const getToken = () => localStorage.getItem('access_token');

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
    throw error;
  }
};
