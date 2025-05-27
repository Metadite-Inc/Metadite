
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Users, Clock, ArrowRight, Search, Send, Paperclip, X, File } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import MessageItem from '../components/MessageItem';
import { 
  getUserChatRooms,
  getMessages,
  sendMessage,
  sendFileMessage,
  connectWebSocket,
  deleteMessage,
  sendTypingIndicator,
  markMessagesAsRead
} from '../services/ChatService';

const ChatPage = () => {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (user && !loading) {
      loadUserChatRooms();
    } else if (!loading && !user) {
      setLoadingRooms(false);
    }
  }, [user, loading]);

  // Load chat rooms
  const loadUserChatRooms = async () => {
    try {
      setLoadingRooms(true);
      console.log('Loading chat rooms for user:', user?.id);
      
      const rooms = await getUserChatRooms();
      
      if (rooms && Array.isArray(rooms)) {
        const userRooms = rooms.map(room => ({
          id: room.id,
          modelId: room.doll_id,
          modelName: room.doll_name || `Model ${room.doll_id}`,
          modelImage: room.doll_image || 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
          lastMessage: room.last_message?.content || 'No messages yet',
          lastMessageTime: room.last_message?.created_at,
          unreadCount: room.unread_count || 0,
          createdAt: room.created_at,
          moderatorId: room.moderator_id
        }));
        
        setChatRooms(userRooms);
        console.log('Loaded chat rooms:', userRooms);
      } else {
        console.log('No chat rooms found or invalid response');
        setChatRooms([]);
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
      toast.error('Failed to load chat rooms');
      setChatRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Handle room selection
  const handleRoomSelect = async (room) => {
    // Clean up previous connection
    if (wsRef.current) {
      wsRef.current.close(1000, 'Switching rooms');
      wsRef.current = null;
    }

    setSelectedRoom(room);
    setMessages([]);
    setNewMessage('');
    clearSelectedFile();
    setTypingUsers(new Set());
    
    try {
      // Load messages for selected room
      console.log(`Loading messages for chat room ${room.id}`);
      const chatMessages = await getMessages(room.id);
      if (chatMessages && chatMessages.length) {
        console.log(`Loaded ${chatMessages.length} messages`);
        setMessages(chatMessages);
        setHasMoreMessages(chatMessages.length === 50);
      } else {
        console.log('No existing messages found');
        setMessages([]);
      }

      // Connect to WebSocket for this chat room
      setConnectionStatus('connecting');
      console.log(`Connecting to WebSocket for chat room ${room.id}`);
      const ws = connectWebSocket(room.id, handleWebSocketMessage);
      
      if (ws) {
        wsRef.current = ws;
        
        const originalOnOpen = ws.onopen;
        const originalOnClose = ws.onclose;
        const originalOnError = ws.onerror;
        
        ws.onopen = (event) => {
          console.log('WebSocket connected');
          setConnectionStatus('connected');
          markMessagesAsRead(room.id);
          
          // Update unread count in room list
          setChatRooms(prev => 
            prev.map(r => r.id === room.id ? { ...r, unreadCount: 0 } : r)
          );
          
          if (originalOnOpen) originalOnOpen.call(ws, event);
        };
        
        ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          setConnectionStatus('disconnected');
          if (originalOnClose) originalOnClose.call(ws, event);
        };
        
        ws.onerror = (event) => {
          console.error('WebSocket error:', event);
          setConnectionStatus('error');
          if (originalOnError) originalOnError.call(ws, event);
        };
      }
    } catch (error) {
      console.error('Error loading room:', error);
      toast.error('Failed to load chat room');
    }
  };

  // Handle WebSocket messages
  const handleWebSocketMessage = (data) => {
    console.log("WebSocket message received:", data);
    
    if (data.type === 'new_message' && data.message) {
      setMessages(prev => {
        const exists = prev.some(msg => 
          msg.id === data.message.id ||
          (msg.content === data.message.content && 
           Math.abs(new Date(msg.created_at) - new Date(data.message.created_at)) < 1000)
        );
        if (exists) {
          console.log('Duplicate message detected, skipping');
          return prev;
        }
        console.log('Adding new message:', data.message);
        return [...prev, data.message];
      });
      
      // Update last message in room list
      setChatRooms(prev => 
        prev.map(room => 
          room.id === data.message.chat_room_id 
            ? { 
                ...room, 
                lastMessage: data.message.content, 
                lastMessageTime: data.message.created_at 
              } 
            : room
        )
      );
    } else if (data.type === 'typing' && data.user_id) {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (data.is_typing) {
          newSet.add(data.user_id);
        } else {
          newSet.delete(data.user_id);
        }
        return newSet;
      });
    } else if (data.type === 'message_deleted' && data.message_id) {
      setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load more messages
  const loadMoreMessages = async () => {
    if (!selectedRoom || isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    try {
      console.log(`Loading more messages from offset ${messages.length}`);
      const olderMessages = await getMessages(selectedRoom.id, messages.length);
      
      if (olderMessages.length > 0) {
        console.log(`Loaded ${olderMessages.length} older messages`);
        setMessages(prev => [...olderMessages, ...prev]);
        setHasMoreMessages(olderMessages.length === 50);
      } else {
        console.log('No more messages to load');
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
      toast.error('Failed to load more messages');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 10MB"
      });
      return;
    }
    
    setSelectedFile(file);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };
  
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const promptFileSelection = () => {
    fileInputRef.current?.click();
  };
  
  // Handle typing
  const handleTyping = () => {
    if (selectedRoom) {
      sendTypingIndicator(selectedRoom.id, true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(selectedRoom.id, false);
      }, 3000);
    }
  };
  
  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !selectedFile) || !selectedRoom) return;
    
    if (!user) {
      toast.error("Please login to send messages");
      return;
    }
    
    try {
      setIsUploading(true);
      
      const moderatorId = selectedRoom.moderatorId || null;
      
      // Handle file upload
      if (selectedFile) {
        try {
          const fileMessageResponse = await sendFileMessage(selectedFile, selectedRoom.id);
          
          if (fileMessageResponse) {
            const fileMessage = {
              id: Date.now(),
              chat_room_id: selectedRoom.id,
              sender_id: user.id,
              sender_name: user.name || user.email || 'User',
              content: selectedFile.name,
              file_name: selectedFile.name,
              created_at: new Date().toISOString(),
              flagged: false,
              message_type: selectedFile.type.startsWith('image/') ? 'IMAGE' : 'FILE',
              file_url: selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null
            };
            
            setMessages(prev => [...prev, fileMessage]);
          }
          
          clearSelectedFile();
        } catch (error) {
          console.error("Failed to upload file:", error);
          toast.error("Failed to upload file");
        }
      }
      
      // Handle text message
      if (newMessage.trim()) {
        try {
          await sendMessage(newMessage.trim(), selectedRoom.id, moderatorId);
          
          const textMessage = {
            id: Date.now() + 1,
            chat_room_id: selectedRoom.id,
            sender_id: user.id,
            sender_name: user.name || user.email || 'User',
            content: newMessage,
            created_at: new Date().toISOString(),
            flagged: false,
            message_type: 'TEXT'
          };
          
          setMessages(prev => [...prev, textMessage]);
          setNewMessage('');
          
          sendTypingIndicator(selectedRoom.id, false);
        } catch (error) {
          console.error("Failed to send message:", error);
          toast.error("Failed to send message");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const filteredChatRooms = chatRooms.filter(room =>
    room.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-20 pb-12 px-4 flex items-center justify-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="text-center">
            <div className="inline-block h-8 w-8 rounded-full border-4 border-metadite-primary border-r-transparent animate-spin"></div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-20 pb-12 px-4 flex items-center justify-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-metadite-primary opacity-50" />
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Please Log In
            </h2>
            <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              You need to be logged in to access your chats
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-20 pb-4 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-7xl h-[calc(100vh-120px)]">
          <div className={`glass-card rounded-xl overflow-hidden h-full flex ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50'
          }`}>
            
            {/* Left Sidebar - Chat Rooms */}
            <div className={`w-1/3 border-r flex flex-col ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Chats
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-metadite-primary" />
                    <span className="bg-metadite-primary/20 text-metadite-primary px-2 py-1 rounded-full text-xs font-medium">
                      {chatRooms.length}
                    </span>
                  </div>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-metadite-primary`}
                  />
                </div>
              </div>

              {/* Chat Rooms List */}
              <div className="flex-1 overflow-y-auto">
                {loadingRooms ? (
                  <div className="p-8 text-center">
                    <div className="inline-block h-6 w-6 rounded-full border-4 border-metadite-primary border-r-transparent animate-spin"></div>
                    <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Loading conversations...
                    </p>
                  </div>
                ) : filteredChatRooms.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredChatRooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => handleRoomSelect(room)}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedRoom?.id === room.id
                            ? 'bg-metadite-primary/10 border-r-2 border-metadite-primary'
                            : `hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                                room.unreadCount > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                              }`
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={room.modelImage}
                              alt={room.modelName}
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/200?text=Model';
                              }}
                            />
                            {room.unreadCount > 0 && (
                              <div className="absolute -top-1 -right-1 bg-metadite-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {room.unreadCount > 9 ? '9+' : room.unreadCount}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className={`font-medium truncate ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {room.modelName}
                              </h3>
                              <span className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {formatTime(room.lastMessageTime)}
                              </span>
                            </div>
                            <p className={`text-sm truncate mt-1 ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {room.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-metadite-primary opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Start chatting with models to see your conversations here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Chat Interface */}
            <div className="flex-1 flex flex-col">
              {selectedRoom ? (
                <>
                  {/* Chat Header */}
                  <div className={`p-4 border-b flex items-center justify-between ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img
                          src={selectedRoom.modelImage}
                          alt={selectedRoom.modelName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/200?text=Model';
                          }}
                        />
                      </div>
                      <div>
                        <h2 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                          {selectedRoom.modelName}
                        </h2>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Chat ID: {selectedRoom.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`relative w-3 h-3 rounded-full mr-2 ${
                        connectionStatus === 'connected' ? 'bg-green-500' :
                        connectionStatus === 'connecting' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}>
                        {connectionStatus === 'connecting' && (
                          <span className="absolute inset-0 rounded-full bg-yellow-500 animate-ping opacity-75"></span>
                        )}
                      </div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {connectionStatus === 'connected' ? 'Online' : 
                         connectionStatus === 'connecting' ? 'Connecting...' :
                         connectionStatus === 'error' ? 'Error' : 'Offline'}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {hasMoreMessages && (
                      <div className="text-center my-2">
                        <button
                          onClick={loadMoreMessages}
                          disabled={isLoadingMore}
                          className={`px-4 py-1 text-xs rounded-full ${
                            theme === 'dark' 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                        >
                          {isLoadingMore ? (
                            <>
                              <span className="inline-block h-3 w-3 rounded-full border-2 border-current border-r-transparent animate-spin mr-1"></span>
                              Loading...
                            </>
                          ) : (
                            'Load older messages'
                          )}
                        </button>
                      </div>
                    )}
                    
                    {messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <MessageItem
                            key={message.id}
                            message={message}
                            onDelete={message.sender_id === user?.id ? () => handleDeleteMessage(message.id) : null}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No messages yet. Start the conversation!
                      </div>
                    )}
                    
                    {/* Typing indicator */}
                    {typingUsers && typingUsers.size > 0 && (
                      <div className={`px-4 py-2 rounded-lg w-auto inline-block ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                          <span className="text-xs">Someone is typing...</span>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messageEndRef} />
                  </div>

                  {/* File preview area */}
                  {selectedFile && (
                    <div className={`p-2 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {previewUrl ? (
                            <div className="h-16 w-16 overflow-hidden rounded-md">
                              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                            </div>
                          ) : (
                            <div className={`h-12 w-12 flex items-center justify-center rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                              <File className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                          )}
                          <span className={`text-sm truncate max-w-[150px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {selectedFile.name}
                          </span>
                        </div>
                        <button 
                          onClick={clearSelectedFile}
                          className={`p-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <div className="relative flex-1">
                        <Textarea
                          placeholder={connectionStatus === 'connected' 
                            ? `Send a message about ${selectedRoom.modelName}...` 
                            : 'Reconnecting to chat...'}
                          value={newMessage}
                          onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                          }}
                          disabled={connectionStatus !== 'connected'}
                          className={`min-h-[48px] max-h-[120px] resize-none ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'border-gray-300 text-gray-900'
                          } ${connectionStatus !== 'connected' ? 'opacity-70' : ''}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              const syntheticEvent = { preventDefault: () => {} };
                              handleSendMessage(syntheticEvent);
                            }
                          }}
                        />
                      </div>
                      
                      {/* File upload button */}
                      <button 
                        type="button"
                        onClick={promptFileSelection}
                        disabled={connectionStatus !== 'connected'}
                        className={`flex-shrink-0 p-3 rounded-md ${
                          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                        } ${connectionStatus !== 'connected' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Paperclip className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                      
                      {/* Hidden file input */}
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      
                      <button 
                        type="submit"
                        disabled={(!newMessage.trim() && !selectedFile) || isUploading || connectionStatus !== 'connected'}
                        className="flex-shrink-0 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white p-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isUploading ? (
                          <span className="inline-block h-5 w-5 rounded-full border-2 border-white border-r-transparent animate-spin"></span>
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </button>
                    </form>
                    
                    {connectionStatus !== 'connected' && (
                      <div className="mt-2 text-xs text-center text-red-500">
                        {connectionStatus === 'connecting' 
                          ? 'Connecting to chat server...' 
                          : 'Connection lost. Trying to reconnect...'}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // No room selected
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                    <h2 className={`text-2xl font-medium mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
                      Select a conversation
                    </h2>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Choose a conversation from the sidebar to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
