// Chat message types
export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  FILE = "FILE",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  SYSTEM = "SYSTEM"
}

export enum MessageStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  SENDING = "SENDING"
}

export interface MessageCreate {
  content: string;
  message_type: MessageType;
  chat_room_id: number;
  receiver_id?: number;
  moderator_id?: number;
}

export interface MessageInDB {
  id: string;
  content: string;
  sender_id: string;
  sender_uuid?: string; // UUID for proper message ownership comparison
  sender_name?: string;
  receiver_id?: string;
  chat_room_id?: string;
  message_type: MessageType | string;
  status?: MessageStatus;
  created_at: string;
  updated_at?: string;
  flagged?: boolean;
  file_url?: string;
  file_name?: string;
  timestamp?: string; // For backward compatibility
}

export interface WebSocketMessage {
  type: 'new_message' | 'status_update' | 'typing' | 'message_deleted' | 'message_updated';
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
  moderator_id?: number;
  created_at: string;
  updated_at: string;
  last_message?: MessageInDB;
  unread_count?: number;
  doll_name?: string;
  doll_image?: string;
}

export interface TypingIndicator {
  user_id: string;
  username?: string;
  timestamp: number;
}

// Add additional types for better chat system robustness
export interface ChatError {
  type: 'connection' | 'authentication' | 'validation' | 'server';
  message: string;
  details?: any;
}

export interface ConnectionState {
  status: 'connected' | 'connecting' | 'disconnected' | 'error' | 'reconnecting';
  lastConnected?: Date;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

export interface QueuedMessage {
  id: string;
  content: string;
  chatRoomId: number;
  type: MessageType;
  moderatorId?: number;
  timestamp: Date;
  retryCount: number;
}