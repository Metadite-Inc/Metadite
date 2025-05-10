
export interface Message {
  id: number | string;
  senderId: string;
  senderName?: string;
  recipientId?: string;
  content: string;
  timestamp: string;
  flagged?: boolean;
  modelId?: string;
}

export interface Chat {
  id: number | string;
  participants: string[];
  messages: Message[];
  lastMessageTime: string;
  unread?: boolean;
}
