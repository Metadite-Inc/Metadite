import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;//|| "http://127.0.0.1:8000";

// WebSocket connection
let ws: WebSocket | null = null;

// Get auth token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in to send messages.',
        });
        return null;
      }

// Helper method to extract user ID from JWT token
  private getUserIdFromToken(token: string): number {
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
  }

const userId = this.getUserIdFromToken(token);

export const connectWebSocket = (chatRoomId: number, userId: number, onMessage: (data: any) => void) => {
    ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/api/chat/ws/${chatRoomId}/${userId}`);
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    };
    
    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
    
    return ws;
};

// Chat Room APIs
export const createChatRoom = async (dollId: string, token: string) => {
    const response = await axios.post(`${API_BASE_URL}/api/chat/rooms/`, 
        { doll_id: dollId },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
};

export const getUserChatRooms = async (skip: number = 0, limit: number = 100, token: string) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/chat/user/rooms/?skip=${skip}&limit=${limit}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
};

export const getModeratorChatRooms = async (skip: number = 0, limit: number = 100, token: string) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/chat/moderator/rooms/?skip=${skip}&limit=${limit}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
};

export const getChatRoomById = async (chatRoomId: number, token: string) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/chat/rooms/${chatRoomId}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
};

// Message APIs
export const sendMessage = async (content: string, chatRoomId: number, receiverId: number, token: string) => {
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
};

export const sendFileMessage = async (file: File, chatRoomId: number, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
        `${API_BASE_URL}/api/chat/messages/${chatRoomId}/upload`, 
        formData, 
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }
    );
    return response.data;
};

export const getMessages = async (chatRoomId: number, skip: number = 0, limit: number = 50, token: string) => {
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
};

export const deleteMessage = async (messageId: number, token: string) => {
    const response = await axios.delete(
        `${API_BASE_URL}/api/chat/messages/${messageId}`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
};

export const getUnreadCount = async (token: string) => {
    const response = await axios.get(
        `${API_BASE_URL}/api/chat/unread-count`,
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
