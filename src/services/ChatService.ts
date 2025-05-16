import axios from 'axios';
import { MessageCreate, MessageInDB, ChatRoom, MessageStatus, MessageType } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;//|| "http://127.0.0.1:8000";

// WebSocket connection
let ws: WebSocket | null = null;

export const connectWebSocket = (userId: string, onMessage: (data: any) => void) => {
    ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/${userId}`);
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    };
    
    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };
    
    return ws;
};

export const sendMessage = async (message: MessageCreate, token: string) => {
    const response = await axios.post(`${API_BASE_URL}/messages`, message, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const sendFileMessage = async (file: File, dollId: string, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doll_id', dollId);
    
    const response = await axios.post(`${API_BASE_URL}/messages/file`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getMessages = async (dollId: string, limit: number = 50, before?: Date, token: string) => {
    //edited to use URLSearchParams for query parameters
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (before) params.append('before', before.toISOString());

    
    const response = await axios.get(`${API_BASE_URL}/messages/${dollId}?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getModeratorMessages = async (limit: number = 50, token: string) => {
    const response = await axios.get(`${API_BASE_URL}/moderator/messages?limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateMessageStatus = async (messageId: string, status: MessageStatus, token: string) => {
    const response = await axios.put(
        `${API_BASE_URL}/messages/${messageId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const deleteMessage = async (messageId: string, token: string) => {
    const response = await axios.delete(`${API_BASE_URL}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getUnreadCount = async (token: string) => {
    const response = await axios.get(`${API_BASE_URL}/unread/count`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const sendTypingIndicator = (dollId: string, isTyping: boolean) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'typing',
            doll_id: dollId,
            is_typing: isTyping
        }));
    }
}; 
