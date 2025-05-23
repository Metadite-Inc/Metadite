
import { toast } from 'sonner';

// WebSocket connection management
interface WebSocketOptions {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
}

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private chatRoomId: number | string | null = null;
  private userId: number | null = null;
  private onMessageCallback: ((data: any) => void) | null = null;
  
  // Connect to WebSocket
  public connect(chatRoomId: number | string, userId: number, options: WebSocketOptions = {}): WebSocket | null {
    try {
      // Store parameters for reconnection
      this.chatRoomId = chatRoomId;
      this.userId = userId;
      this.onMessageCallback = options.onMessage || null;
      
      // Close existing connection if any
      if (this.ws) {
        this.ws.close();
      }
      
      // Make sure chatRoomId is valid
      if (!chatRoomId || (typeof chatRoomId === 'number' && isNaN(chatRoomId))) {
        console.error('Invalid chat room ID:', chatRoomId);
        toast.error('Invalid chat room ID. Please try again later.');
        return null;
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/api/chat/ws/${chatRoomId}/${userId}`;
      
      console.log(`Connecting to WebSocket: ${wsUrl}`);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        toast.success('Connected to chat server');
        this.reconnectAttempts = 0;
        
        // Process any queued messages
        this.processMessageQueue();
        
        // Execute custom onOpen callback if provided
        if (options.onOpen) {
          options.onOpen();
        }
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          if (options.onMessage) {
            options.onMessage(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Connection error. Please check your internet connection.');
        
        if (options.onError) {
          options.onError(error);
        }
      };
      
      this.ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        
        if (options.onClose) {
          options.onClose(event);
        }
        
        if (event.code !== 1000) { // Not a normal closure
          this.attemptReconnect();
        }
      };
      
      return this.ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      toast.error('Failed to establish connection. Please try again.');
      return null;
    }
  }
  
  // Reconnection logic
  private attemptReconnect(): void {
    if (!this.chatRoomId || !this.userId) return;
    
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      toast.error('Failed to reconnect. Please refresh the page.');
      return;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    const backoffTime = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`Attempting to reconnect in ${backoffTime/1000} seconds (attempt ${this.reconnectAttempts + 1}/${this.MAX_RECONNECT_ATTEMPTS})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect(this.chatRoomId!, this.userId!, { onMessage: this.onMessageCallback || undefined });
    }, backoffTime);
  }
  
  // Close the WebSocket connection
  public close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
  
  // Check if WebSocket is connected
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
  
  // Send a message through WebSocket
  public send(message: object): boolean {
    if (!this.isConnected()) return false;
    
    try {
      this.ws!.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }
  
  // Helper function to process message queue
  private processMessageQueue(): void {
    if (!this.isConnected()) return;
    
    const queue = JSON.parse(localStorage.getItem('messageQueue') || '[]');
    if (queue.length === 0) return;
    
    console.log(`Processing ${queue.length} queued messages`);
    
    for (const message of queue) {
      try {
        this.ws!.send(JSON.stringify({
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
  }
}

export default new WebSocketManager();
