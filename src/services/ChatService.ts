
import { Message } from '../types/chat';

class ChatService {
  private apiURL: string;
  private static instance: ChatService;

  constructor() {
    this.apiURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async fetchMessages(userId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${this.apiURL}/api/messages/${userId}`);
      if (!response.ok) {
        throw new Error(`Error fetching messages: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async sendMessage(userId: string, message: string, recipientId?: string): Promise<Message | null> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.apiURL}/api/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sender_id: userId,
          recipient_id: recipientId || 'system',
          content: message,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Error sending message: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }
}

export default ChatService.getInstance();
