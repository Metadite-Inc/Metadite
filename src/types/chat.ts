
// Add/expand types if not already present
export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO"
}

export enum MessageStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ"
}

export interface MessageCreate {
  content: string;
  message_type: MessageType;
  doll_id: string;
}

export interface MessageInDB {
  id: string;
  content: string;
  sender_id: string;
  receiver_id?: string;
  chat_room_id?: string;
  message_type: MessageType;
  status?: MessageStatus;
  created_at: string;
  updated_at?: string;
  flagged?: boolean;
}

export interface WebSocketMessage {
  type: 'new_message' | 'status_update' | 'typing';
  message?: MessageInDB;
  message_id?: string;
  status?: MessageStatus;
  user_id?: string;
  is_typing?: boolean;
}

export interface ChatRoom {
  id: number;
  user_id: number;
  doll_id: number;
  moderator_id: number;
  created_at: string;
  updated_at: string;
}
