export enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    FILE = "file"
}

export enum MessageStatus {
    SENT = "sent",
    DELIVERED = "delivered",
    READ = "read"
}

export interface MessageBase {
    content: string;
    message_type: MessageType;
    doll_id: string;
}

export interface MessageCreate extends MessageBase {}

export interface MessageInDB extends MessageBase {
    id: string;
    sender_id: string;
    receiver_id: string;
    status: MessageStatus;
    created_at: string;
    updated_at: string;
}

export interface ChatRoom {
    id: string;
    doll_id: string;
    user_id: string;
    moderator_id: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    last_message?: MessageInDB;
}

export interface ChatMessage {
    id: string;
    content: string;
    message_type: MessageType;
    sender_id: string;
    receiver_id: string;
    status: MessageStatus;
    created_at: string;
    updated_at: string;
    is_deleted?: boolean;
}

export interface TypingIndicator {
    user_id: string;
    is_typing: boolean;
}

export interface UnreadCount {
    unread_count: number;
}

export interface WebSocketMessage {
    type: 'new_message' | 'status_update' | 'typing';
    message?: MessageInDB;
    message_id?: string;
    status?: MessageStatus;
    user_id?: string;
    is_typing?: boolean;
} 