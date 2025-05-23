
import axios from 'axios';
import { toast } from 'sonner';
import { MessageStatus, MessageType } from '../types/chat';
import WebSocketManager from './websocket/WebSocketManager';
import MessageQueue from './websocket/MessageQueue';
import TokenUtils from './utils/TokenUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Enhanced WebSocket connection
export const connectWebSocket = (chatRoomId: number | string, onMessage: (data: any) => void) => {
  const token = TokenUtils.getAuthToken();
  if (!token) return null;
  
  try {
    const userId = TokenUtils.getUserIdFromToken(token);
    
    return WebSocketManager.connect(chatRoomId, userId, {
      onMessage,
      onOpen: () => {
        // Mark messages as read on connection
        markMessagesAsRead(Number(chatRoomId));
      }
    });
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
  if (WebSocketManager.isConnected()) {
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
      
      const success = WebSocketManager.send(message);
      if (success) {
        console.log('Message sent via WebSocket');
        return true;
      }
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
    MessageQueue.queueMessage({ content, chatRoomId, type: "text", moderatorId });
    throw error;
  }
};

// Send messages with HTTP
export const sendHttpMessage = async (content: string, chatRoomId: number, moderatorId?: number) => {
  const token = TokenUtils.getAuthToken();
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
  const token = TokenUtils.getAuthToken();
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
  const token = TokenUtils.getAuthToken();
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
  const token = TokenUtils.getAuthToken();
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
  const token = TokenUtils.getAuthToken();
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
  const token = TokenUtils.getAuthToken();
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
  const token = TokenUtils.getAuthToken();
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
  const token = TokenUtils.getAuthToken();
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
  const token = TokenUtils.getAuthToken();
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
  const token = TokenUtils.getAuthToken();
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
  
  if (WebSocketManager.isConnected()) {
    console.log(`Marking all messages as read in room ${chatRoomId}`);
    return WebSocketManager.send({
      action: "read",
      chat_room_id: chatRoomId
    });
  }
  return false;
};

// Send typing indicator via WebSocket
export const sendTypingIndicator = (chatRoomId: number, isTyping: boolean) => {
  if (!chatRoomId || isNaN(chatRoomId)) {
    console.error('Invalid chat room ID for typing indicator:', chatRoomId);
    return false;
  }
  
  if (WebSocketManager.isConnected()) {
    console.log(`Sending typing indicator: ${isTyping ? 'typing' : 'stopped typing'} in room ${chatRoomId}`);
    return WebSocketManager.send({
      action: "typing",
      chat_room_id: chatRoomId,
      is_typing: isTyping
    });
  }
  return false;
};

// Flag message for review
export const flagMessage = async (messageId: number | string, isFlagged: boolean) => {
  const token = TokenUtils.getAuthToken();
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
