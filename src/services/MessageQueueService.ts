import { MessageType } from '../types/chat';
import { toast } from 'sonner';

export interface QueuedMessage {
  id: string;
  content: string;
  chatRoomId: number;
  type: MessageType;
  moderatorId?: number;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
}

export interface MessageQueueState {
  messages: QueuedMessage[];
  isProcessing: boolean;
  retryInterval: number;
}

class MessageQueueService {
  private static instance: MessageQueueService;
  private queue: Map<number, QueuedMessage[]> = new Map();
  private processing: Map<number, boolean> = new Map();
  private retryIntervals: Map<number, NodeJS.Timeout> = new Map();
  private listeners: Map<number, ((messages: QueuedMessage[]) => void)[]> = new Map();

  private constructor() {
    // Initialize from localStorage if available
    this.loadFromStorage();
  }

  static getInstance(): MessageQueueService {
    if (!MessageQueueService.instance) {
      MessageQueueService.instance = new MessageQueueService();
    }
    return MessageQueueService.instance;
  }

  // Add message to queue
  addMessage(
    content: string,
    chatRoomId: number,
    type: MessageType = MessageType.TEXT,
    moderatorId?: number
  ): string {
    const messageId = `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const queuedMessage: QueuedMessage = {
      id: messageId,
      content,
      chatRoomId,
      type,
      moderatorId,
      timestamp: new Date(),
      retryCount: 0,
      maxRetries: 3
    };

    if (!this.queue.has(chatRoomId)) {
      this.queue.set(chatRoomId, []);
    }

    this.queue.get(chatRoomId)!.push(queuedMessage);
    this.saveToStorage();
    this.notifyListeners(chatRoomId);

    console.log(`Message queued for room ${chatRoomId}:`, queuedMessage);
    toast.info('Message will be sent when connection is restored');

    return messageId;
  }

  // Get messages for a specific room
  getMessages(chatRoomId: number): QueuedMessage[] {
    return this.queue.get(chatRoomId) || [];
  }

  // Remove message from queue
  removeMessage(chatRoomId: number, messageId: string): boolean {
    const messages = this.queue.get(chatRoomId);
    if (!messages) return false;

    const index = messages.findIndex(msg => msg.id === messageId);
    if (index === -1) return false;

    messages.splice(index, 1);
    this.saveToStorage();
    this.notifyListeners(chatRoomId);

    return true;
  }

  // Process queue for a specific room
  async processQueue(
    chatRoomId: number,
    sendFunction: (content: string, roomId: number, moderatorId?: number) => Promise<any>
  ): Promise<void> {
    if (this.processing.get(chatRoomId)) {
      console.log(`Already processing queue for room ${chatRoomId}`);
      return;
    }

    const messages = this.getMessages(chatRoomId);
    if (messages.length === 0) return;

    this.processing.set(chatRoomId, true);
    console.log(`Processing ${messages.length} queued messages for room ${chatRoomId}`);

    const processedMessages: string[] = [];
    const failedMessages: QueuedMessage[] = [];

    for (const message of messages) {
      try {
        if (message.retryCount >= message.maxRetries) {
          console.warn(`Message ${message.id} exceeded retry limit, discarding`);
          processedMessages.push(message.id);
          continue;
        }

        await sendFunction(message.content, message.chatRoomId, message.moderatorId);
        processedMessages.push(message.id);
        console.log(`Successfully sent queued message: ${message.id}`);
      } catch (error) {
        console.error(`Failed to send queued message ${message.id}:`, error);
        message.retryCount++;
        failedMessages.push(message);
      }
    }

    // Remove processed messages
    processedMessages.forEach(messageId => {
      this.removeMessage(chatRoomId, messageId);
    });

    // Update failed messages with new retry count
    failedMessages.forEach(message => {
      const messages = this.queue.get(chatRoomId);
      if (messages) {
        const index = messages.findIndex(msg => msg.id === message.id);
        if (index !== -1) {
          messages[index] = message;
        }
      }
    });

    this.processing.set(chatRoomId, false);
    this.saveToStorage();

    if (processedMessages.length > 0) {
      toast.success(`Sent ${processedMessages.length} queued messages`);
    }

    if (failedMessages.length > 0) {
      console.log(`${failedMessages.length} messages failed and will be retried`);
    }
  }

  // Set up automatic retry for failed messages
  setupRetry(
    chatRoomId: number,
    sendFunction: (content: string, roomId: number, moderatorId?: number) => Promise<any>
  ): void {
    // Clear existing retry interval
    const existingInterval = this.retryIntervals.get(chatRoomId);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Set up new retry interval
    const interval = setInterval(async () => {
      const messages = this.getMessages(chatRoomId);
      if (messages.length > 0) {
        await this.processQueue(chatRoomId, sendFunction);
      }
    }, 30000); // Retry every 30 seconds

    this.retryIntervals.set(chatRoomId, interval);
  }

  // Clear retry interval for a room
  clearRetry(chatRoomId: number): void {
    const interval = this.retryIntervals.get(chatRoomId);
    if (interval) {
      clearInterval(interval);
      this.retryIntervals.delete(chatRoomId);
    }
  }

  // Add listener for queue changes
  addListener(
    chatRoomId: number,
    listener: (messages: QueuedMessage[]) => void
  ): () => void {
    if (!this.listeners.has(chatRoomId)) {
      this.listeners.set(chatRoomId, []);
    }

    this.listeners.get(chatRoomId)!.push(listener);

    // Immediately call with current messages
    listener(this.getMessages(chatRoomId));

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(chatRoomId);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  // Notify listeners of queue changes
  private notifyListeners(chatRoomId: number): void {
    const listeners = this.listeners.get(chatRoomId);
    if (listeners) {
      const messages = this.getMessages(chatRoomId);
      listeners.forEach(listener => listener(messages));
    }
  }

  // Save queue to localStorage
  private saveToStorage(): void {
    try {
      const queueData = Object.fromEntries(this.queue);
      localStorage.setItem('messageQueue', JSON.stringify(queueData));
    } catch (error) {
      console.error('Failed to save message queue to storage:', error);
    }
  }

  // Load queue from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('messageQueue');
      if (stored) {
        const queueData = JSON.parse(stored);
        this.queue = new Map(Object.entries(queueData).map(([key, value]) => [
          parseInt(key),
          (value as any[]).map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        ]));
      }
    } catch (error) {
      console.error('Failed to load message queue from storage:', error);
    }
  }

  // Clear all queues
  clearAll(): void {
    this.queue.clear();
    this.processing.clear();
    this.retryIntervals.forEach(interval => clearInterval(interval));
    this.retryIntervals.clear();
    this.listeners.clear();
    localStorage.removeItem('messageQueue');
  }

  // Get queue statistics
  getStats(): { totalMessages: number; totalRooms: number } {
    let totalMessages = 0;
    this.queue.forEach(messages => {
      totalMessages += messages.length;
    });

    return {
      totalMessages,
      totalRooms: this.queue.size
    };
  }
}

export default MessageQueueService; 