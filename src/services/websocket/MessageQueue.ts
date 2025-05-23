
import { toast } from 'sonner';

interface QueuedMessage {
  content: string;
  chatRoomId: number | string;
  type?: string;
  moderatorId?: number;
}

class MessageQueue {
  // Queue message for later sending
  public queueMessage(message: QueuedMessage): void {
    const queue = JSON.parse(localStorage.getItem('messageQueue') || '[]');
    queue.push(message);
    localStorage.setItem('messageQueue', JSON.stringify(queue));
    console.log('Message queued for later sending:', message);
    toast.info('Message will be sent when connection is restored');
  }
  
  // Get all queued messages
  public getQueuedMessages(): QueuedMessage[] {
    return JSON.parse(localStorage.getItem('messageQueue') || '[]');
  }
  
  // Clear the message queue
  public clearQueue(): void {
    localStorage.removeItem('messageQueue');
  }
}

export default new MessageQueue();
