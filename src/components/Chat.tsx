
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
    const { user, token } = useAuth();
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

        const ws = connectWebSocket(user.uid, handleWebSocketMessage);

        return () => {
            ws.close();
        };
    }, [user]);

    const handleWebSocketMessage = (data: WebSocketMessage) => {
        switch (data.type) {
            case 'new_message':
                if (data.message) {
                    setMessages(prev => [...prev, data.message!]);
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
        }
    };

    const loadMessages = async (before?: Date) => {
        if (!token || isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const newMessages = await getMessages(dollId, 50, before, token);
            setMessages(prev => [...newMessages, ...prev]);
            setHasMore(newMessages.length === 50);
        } catch (error) {
            console.error('Error loading messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !token) return;

        const message: MessageCreate = {
            content: newMessage.trim(),
            message_type: MessageType.TEXT,
            doll_id: dollId
        };

        try {
            await sendMessage(message, token);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length || !token) return;

        const file = e.target.files[0];
        try {
            await sendFileMessage(file, dollId, token);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleTyping = useCallback(() => {
        if (!isTyping) {
            setIsTyping(true);
            sendTypingIndicator(dollId, true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            sendTypingIndicator(dollId, false);
        }, 3000);
    }, [dollId, isTyping]);

    const handleMessageStatus = async (messageId: string, status: MessageStatus) => {
        if (!token) return;
        try {
            await updateMessageStatus(messageId, status, token);
        } catch (error) {
            console.error('Error updating message status:', error);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!token) return;
        try {
            await deleteMessage(messageId, token);
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map(message => (
                    <div 
                        key={message.id} 
                        className={`message ${message.sender_id === user?.uid ? 'sent' : 'received'}`}
                    >
                        <div className="message-content">
                            {message.message_type === MessageType.IMAGE ? (
                                <img src={message.content} alt="Shared image" />
                            ) : message.message_type === MessageType.FILE ? (
                                <a href={message.content} target="_blank" rel="noopener noreferrer">
                                    Download File
                                </a>
                            ) : (
                                message.content
                            )}
                        </div>
                        <div className="message-meta">
                            <span className="time">
                                {format(new Date(message.created_at), 'HH:mm')}
                            </span>
                            {message.sender_id === user?.uid && (
                                <button 
                                    onClick={() => handleDeleteMessage(message.id)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {typingUsers.size > 0 && (
                <div className="typing-indicator">
                    {Array.from(typingUsers).map(userId => (
                        <span key={userId}>{userId} is typing...</span>
                    ))}
                </div>
            )}

            <form onSubmit={handleSendMessage} className="message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                    }}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                    className="file-input"
                />
                <button type="submit" className="send-button">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
