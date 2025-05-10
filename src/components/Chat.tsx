import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../components/Chat.css';
import { Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ChatService from '../services/ChatService';
import { Message } from '../types/chat';
import { useAuth } from '../context/AuthContext';

const Chat: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { modelId } = useParams<{ modelId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock initial chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        if (user) {
          // If we have a real user, fetch real messages
          const fetchedMessages = await ChatService.fetchMessages(user.id);
          setMessages(fetchedMessages);
        } else {
          // Otherwise use demo messages
          setMessages([
            {
              id: '1',
              content: 'Hello! How can I help you with your model selection today?',
              sender_id: 'moderator',
              recipient_id: 'user',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              read: true
            },
            {
              id: '2',
              content: 'I am looking for a model with specific dimensions, can you help?',
              sender_id: 'user',
              recipient_id: 'moderator',
              timestamp: new Date(Date.now() - 3500000).toISOString(),
              read: true
            },
            {
              id: '3',
              content: 'Of course! Could you tell me what dimensions you\'re looking for?',
              sender_id: 'moderator',
              recipient_id: 'user',
              timestamp: new Date(Date.now() - 3400000).toISOString(),
              read: true
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Create a new message object
    const tempMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender_id: user?.id || 'user',
      recipient_id: modelId || 'moderator',
      timestamp: new Date().toISOString(),
      read: false
    };

    // Optimistically update UI
    setMessages(prevMessages => [...prevMessages, tempMessage]);
    setNewMessage('');

    try {
      if (user) {
        // If we have a real user, send the message to the API
        await ChatService.sendMessage(user.id, newMessage, modelId);
      }
      
      // Simulate a response after a delay
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thank you for your message. A moderator will respond shortly.",
          sender_id: 'moderator',
          recipient_id: user?.id || 'user',
          timestamp: new Date().toISOString(),
          read: false
        };
        setMessages(prevMessages => [...prevMessages, responseMessage]);
      }, 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metadite-primary"></div>
          </div>
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender_id === (user?.id || 'user') ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] rounded-lg px-4 py-3 ${
                  message.sender_id === (user?.id || 'user') 
                    ? 'bg-metadite-primary text-white' 
                    : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              >
                <p>{message.content}</p>
                <span className={`text-xs mt-1 block ${
                  message.sender_id === (user?.id || 'user') ? 'text-gray-200' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No messages yet. Start a conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form 
        onSubmit={handleSubmit} 
        className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-metadite-primary ${
              theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-gray-100 border-gray-200 text-gray-800'
            }`}
          />
          <button
            type="submit"
            className="bg-metadite-primary hover:bg-metadite-secondary text-white p-2 rounded-full transition duration-200"
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
