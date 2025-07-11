import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MessageType, MessageStatus } from '../types/chat';
import { 
  sendMessage, 
  getMessages, 
  connectWebSocket,
  getChatRoomById,
  createChatRoom,
  deleteMessage,
  sendTypingIndicator,
  markMessagesAsRead,
  addConnectionListener,
  cleanup,
  getUnreadCount,
  getUserChatRooms
} from '../services/ChatService';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string | number;
  content: string;
  sender_id: string | number;
  sender_uuid?: string;
  sender_name?: string;
  receiver_id?: string | number;
  chat_room_id: string | number;
  message_type: MessageType | string;
  status?: MessageStatus;
  created_at: string;
  updated_at?: string;
  flagged?: boolean;
  file_url?: string;
  file_name?: string;
  timestamp?: string;
}

export interface ChatRoom {
  id: number;
  user_id: number;
  doll_id: number;
  moderator_id?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
  };
  doll?: {
    id: number;
    name: string;
    image_url?: string;
    description?: string;
  };
  last_message?: ChatMessage;
  unread_count?: number;
}

export interface ConnectionState {
  status: 'disconnected' | 'connecting' | 'connected' | 'error' | 'reconnecting';
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  lastConnected?: Date;
}

export interface ChatState {
  // Chat rooms
  chatRooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  loadingRooms: boolean;
  searchTerm: string;
  
  // Messages
  messages: ChatMessage[];
  loadingMessages: boolean;
  hasMoreMessages: boolean;
  isLoadingMore: boolean;
  
  // Input state
  newMessage: string;
  isUploading: boolean;
  
  // Connection state
  connectionStatus: ConnectionState;
  typingUsers: Set<string>;
  
  // Unread counts
  unreadCounts: Record<number, number>;
  totalUnreadCount: number;
  
  // Actions
  setChatRooms: (rooms: ChatRoom[]) => void;
  setSelectedRoom: (room: ChatRoom | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string | number, updates: Partial<ChatMessage>) => void;
  removeMessage: (messageId: string | number) => void;
  setNewMessage: (message: string) => void;
  setSearchTerm: (term: string) => void;
  setLoadingMessages: (loading: boolean) => void;
  setHasMoreMessages: (hasMore: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setConnectionStatus: (status: ConnectionState) => void;
  setTypingUsers: (users: Set<string>) => void;
  addTypingUser: (userId: string) => void;
  removeTypingUser: (userId: string) => void;
  setUnreadCounts: (counts: Record<number, number>) => void;
  setTotalUnreadCount: (count: number) => void;
  
  // Async actions
  loadChatRooms: () => Promise<void>;
  loadMessages: (roomId: number, skip?: number, limit?: number) => Promise<void>;
  loadMoreMessages: (roomId: number) => Promise<void>;
  sendMessage: (content: string, roomId: number, moderatorId?: number) => Promise<void>;
  deleteMessage: (messageId: string | number) => Promise<void>;
  connectToRoom: (roomId: number) => Promise<void>;
  disconnectFromRoom: (roomId: number) => void;
  loadUnreadCounts: () => Promise<void>;
  
  // Optimistic updates
  addOptimisticMessage: (content: string, roomId: number) => void;
  removeOptimisticMessage: (tempId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      chatRooms: [],
      selectedRoom: null,
      loadingRooms: false,
      searchTerm: '',
      messages: [],
      loadingMessages: false,
      hasMoreMessages: true,
      isLoadingMore: false,
      newMessage: '',
      isUploading: false,
      connectionStatus: {
        status: 'disconnected',
        reconnectAttempts: 0,
        maxReconnectAttempts: 5
      },
      typingUsers: new Set(),
      unreadCounts: {},
      totalUnreadCount: 0,

      // Synchronous actions
      setChatRooms: (rooms) => set({ chatRooms: rooms }),
      setSelectedRoom: (room) => set({ selectedRoom: room }),
      setMessages: (messages) => set({ messages }),
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      updateMessage: (messageId, updates) => set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === messageId ? { ...msg, ...updates } : msg
        )
      })),
      removeMessage: (messageId) => set((state) => ({
        messages: state.messages.filter(msg => msg.id !== messageId)
      })),
      setNewMessage: (message) => set({ newMessage: message }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setLoadingMessages: (loading) => set({ loadingMessages: loading }),
      setHasMoreMessages: (hasMore) => set({ hasMoreMessages: hasMore }),
      setLoadingMore: (loading) => set({ isLoadingMore: loading }),
      setConnectionStatus: (status) => set({ connectionStatus: status }),
      setTypingUsers: (users) => set({ typingUsers: users }),
      addTypingUser: (userId) => set((state) => ({
        typingUsers: new Set([...state.typingUsers, userId])
      })),
      removeTypingUser: (userId) => set((state) => {
        const newSet = new Set(state.typingUsers);
        newSet.delete(userId);
        return { typingUsers: newSet };
      }),
      setUnreadCounts: (counts) => set({ unreadCounts: counts }),
      setTotalUnreadCount: (count) => set({ totalUnreadCount: count }),

      // Async actions
      loadChatRooms: async () => {
        set({ loadingRooms: true });
        try {
          const rooms = await getUserChatRooms();
          set({ chatRooms: rooms });
        } catch (error) {
          console.error('Failed to load chat rooms:', error);
          toast.error('Failed to load chat rooms');
        } finally {
          set({ loadingRooms: false });
        }
      },

      loadMessages: async (roomId, skip = 0, limit = 50) => {
        const { setLoadingMessages, setMessages, setHasMoreMessages } = get();
        setLoadingMessages(true);
        
        try {
          const messages = await getMessages(roomId, skip, limit);
          setMessages(messages);
          setHasMoreMessages(messages.length === limit);
        } catch (error) {
          console.error('Failed to load messages:', error);
          toast.error('Failed to load messages');
        } finally {
          setLoadingMessages(false);
        }
      },

      loadMoreMessages: async (roomId) => {
        const { isLoadingMore, messages, setLoadingMore, setMessages, setHasMoreMessages } = get();
        if (isLoadingMore) return;
        
        setLoadingMore(true);
        try {
          const newMessages = await getMessages(roomId, messages.length, 50);
          setMessages([...newMessages, ...messages]);
          setHasMoreMessages(newMessages.length === 50);
        } catch (error) {
          console.error('Failed to load more messages:', error);
          toast.error('Failed to load more messages');
        } finally {
          setLoadingMore(false);
        }
      },

      sendMessage: async (content, roomId, moderatorId) => {
        const { addOptimisticMessage, addMessage, removeOptimisticMessage, setNewMessage } = get();
        
        if (!content.trim()) return;
        
        // Create optimistic message
        const tempId = `temp_${Date.now()}`;
        const optimisticMessage: ChatMessage = {
          id: tempId,
          content: content.trim(),
          sender_id: 'current_user', // This should be replaced with actual user ID
          sender_name: 'You',
          chat_room_id: roomId,
          message_type: MessageType.TEXT,
          created_at: new Date().toISOString(),
          status: MessageStatus.SENDING
        };
        
        addOptimisticMessage(content, roomId);
        setNewMessage('');
        
        try {
          const result = await sendMessage(content, roomId, moderatorId);
          
          // Remove optimistic message and add real message
          removeOptimisticMessage(tempId);
          if (result?.message) {
            addMessage(result.message);
          }
        } catch (error) {
          console.error('Failed to send message:', error);
          removeOptimisticMessage(tempId);
          toast.error('Failed to send message');
        }
      },

      deleteMessage: async (messageId) => {
        const { removeMessage } = get();
        
        try {
          await deleteMessage(messageId);
          removeMessage(messageId);
          toast.success('Message deleted');
        } catch (error) {
          console.error('Failed to delete message:', error);
          toast.error('Failed to delete message');
        }
      },

      connectToRoom: async (roomId) => {
        const { setConnectionStatus, addMessage, removeTypingUser } = get();
        
        try {
          setConnectionStatus({ status: 'connecting', reconnectAttempts: 0, maxReconnectAttempts: 5 });
          
          addConnectionListener(roomId, (state) => {
            setConnectionStatus(state);
          });
          
          await connectWebSocket(roomId, (data) => {
            if (data.type === 'new_message' && data.message) {
              addMessage(data.message);
            } else if (data.type === 'typing' && data.user_id) {
              if (data.is_typing) {
                get().addTypingUser(data.user_id);
              } else {
                removeTypingUser(data.user_id);
              }
            } else if (data.type === 'message_deleted' && data.message_id) {
              get().removeMessage(data.message_id);
            }
          });
        } catch (error) {
          console.error('Failed to connect to room:', error);
          setConnectionStatus({ status: 'error', reconnectAttempts: 0, maxReconnectAttempts: 5 });
        }
      },

      disconnectFromRoom: (roomId) => {
        cleanup(roomId);
        set({ 
          connectionStatus: { status: 'disconnected', reconnectAttempts: 0, maxReconnectAttempts: 5 },
          typingUsers: new Set()
        });
      },

      loadUnreadCounts: async () => {
        try {
          const unreadData = await getUnreadCount();
          set({ 
            unreadCounts: unreadData.unread_counts || {},
            totalUnreadCount: unreadData.total_unread || 0
          });
        } catch (error) {
          console.error('Failed to load unread counts:', error);
        }
      },

      // Optimistic updates
      addOptimisticMessage: (content, roomId) => {
        const { addMessage } = get();
        const tempId = `temp_${Date.now()}`;
        const optimisticMessage: ChatMessage = {
          id: tempId,
          content: content.trim(),
          sender_id: 'current_user',
          sender_name: 'You',
          chat_room_id: roomId,
          message_type: MessageType.TEXT,
          created_at: new Date().toISOString(),
          status: MessageStatus.SENDING
        };
        addMessage(optimisticMessage);
      },

      removeOptimisticMessage: (tempId) => {
        const { removeMessage } = get();
        removeMessage(tempId);
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        chatRooms: state.chatRooms,
        unreadCounts: state.unreadCounts,
        totalUnreadCount: state.totalUnreadCount
      })
    }
  )
); 