
export interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  timestamp: string;
  read: boolean;
}
