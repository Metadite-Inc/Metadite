import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    sendMessage, 
    sendFileMessage, 
    getMessages, 
    connectWebSocket, 
    sendTypingIndicator,
    updateMessageStatus,
    deleteMessage
} from '../services/ChatService';
import { MessageCreate, MessageInDB, MessageType, MessageStatus, WebSocketMessage } from '../types/chat';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Message Status Component
const MessageStatusIndicator = ({ status }: { status: MessageStatus }) => {
  switch (status) {
    case 'SENT':
      return <Check className="w-4 h-4 text-gray-400" />;
    case 'DELIVERED':
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    case 'READ':
      return <CheckCheck className="w-4 h-4 text-blue-400" />;
    default:
      return null;
  }
};

// Message Component
const Message = ({ message, onDelete, isOwnMessage }: { 
  message: MessageInDB; 
  onDelete: (id: string) => void;
  isOwnMessage: boolean;
}) => {
  return (
    <div className={`message ${isOwnMessage ? 'sent' : 'received'}`}>
      <div className="message-content">
        {message.message_type === MessageType.IMAGE ? (
          <img src={message.content} alt="Shared image" className="max-w-full rounded-lg" />
        ) : message.message_type === MessageType.FILE ? (
          <a 
            href={message.content} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
          >
            <span>📎</span>
            <span>Download File</span>
          </a>
        ) : (
          <p className="text-sm">{message.content}</p>
        )}
      </div>
      <div className="message-meta flex items-center justify-between mt-1">
        <span className="time text-xs text-gray-500">
          {format(new Date(message.created_at), 'HH:mm')}
        </span>
        <div className="flex items-center space-x-2">
          {isOwnMessage && (
            <>
              <MessageStatusIndicator status={message.status} />
              <button 
                onClick={() => onDelete(message.id)}
                className="delete-button text-red-500 hover:text-red-600 text-xs"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface ChatProps {
    dollId: string;
    moderatorId: string;
}

const Chat: React.FC<ChatProps> = ({ dollId, moderatorId }) => {
    const [messages, setMessages] = useState<MessageInDB[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load initial messages
    useEffect(() => {
        loadMessages();
    }, [dollId]);

    // Setup WebSocket connection
    useEffect(() => {
        if (!user) return;

        const ws = connectWebSocket(parseInt(dollId), handleWebSocketMessage);

        return () => {
            if (ws) ws.close();
        };
    }, [user, dollId]);

    const handleWebSocketMessage = (data: WebSocketMessage) => {
        switch (data.type) {
            case 'new_message':
                if (data.message) {
                    setMessages(prev => {
                        // Check if message already exists
                        const exists = prev.some(msg => msg.id === data.message!.id);
                        if (exists) return prev;
                        return [...prev, data.message!];
                    });
                    scrollToBottom();
                }
                break;
            case 'status_update':
                if (data.message_id && data.status) {
                    setMessages(prev => prev.map(msg => 
                        msg.id === data.message_id 
                            ? { ...msg, status: data.status! }
                            : msg
                    ));
                }
                break;
            case 'typing':
                if (data.user_id && data.is_typing !== undefined) {
                    setTypingUsers(prev => {
                        const newSet = new Set(prev);
                        if (data.is_typing) {
                            newSet.add(data.user_id!);
                        } else {
                            newSet.delete(data.user_id!);
                        }
                        return newSet;
                    });
                }
                break;
            case 'error':
                toast.error(data.message || 'An error occurred');
                break;
        }
    };

    const loadMessages = async (before?: Date) => {
        if (!user || isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const newMessages = await getMessages(parseInt(dollId), 0, 50);
            if (newMessages) {
                setMessages(prev => [...newMessages, ...prev]);
                setHasMore(newMessages.length === 50);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await sendMessage(newMessage.trim(), parseInt(dollId), parseInt(moderatorId));
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length || !user) return;

        const file = e.target.files[0];
        try {
            await sendFileMessage(file, parseInt(dollId));
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleTyping = useCallback(() => {
        if (!isTyping) {
            setIsTyping(true);
            sendTypingIndicator(parseInt(dollId), true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            sendTypingIndicator(parseInt(dollId), false);
        }, 3000);
    }, [dollId, isTyping]);

    const handleMessageStatus = async (messageId: string, status: MessageStatus) => {
        if (!user) return;
        try {
            await updateMessageStatus(messageId, status);
        } catch (error) {
            console.error('Error updating message status:', error);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!user) return;
        try {
            await deleteMessage(parseInt(messageId));
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
            toast.success('Message deleted');
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
        }
    };

    return (
        <div className="chat-container flex flex-col h-full">
            <div className="messages-container flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                    <Message
                        key={message.id}
                        message={message}
                        onDelete={handleDeleteMessage}
                        isOwnMessage={message.sender_id === user?.id}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {typingUsers.size > 0 && (
                <div className="typing-indicator p-2 text-sm text-gray-500">
                    {Array.from(typingUsers).map(userId => (
                        <span key={userId} className="mr-2">
                            {userId} is typing...
                        </span>
                    ))}
                </div>
            )}

            <form onSubmit={handleSendMessage} className="message-form p-4 border-t">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                        }}
                        placeholder="Type a message..."
                        className="message-input flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        📎
                    </label>
                    <button 
                        type="submit" 
                        className="send-button bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
