import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MessageItem from '../components/MessageItem';
import { Textarea } from "@/components/ui/textarea";
import { apiService } from '../lib/api';
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
  cleanup
} from '../services/ChatService';

const ModelChat = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [model, setModel] = useState(null);
  const [chatRoom, setChatRoom] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);
  const [fetchError, setFetchError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const wsRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Get room ID from URL or null if not present
  const roomIdFromUrl = searchParams.get('roomId');
  
  // Set up connection state listener
  useEffect(() => {
    if (!chatRoom) return;
    
    console.log(`Setting up connection listener for room ${chatRoom.id}`);
    const unsubscribe = addConnectionListener(chatRoom.id, (state) => {
      console.log(`Connection state changed for room ${chatRoom.id}:`, state.status);
      setConnectionStatus(state.status);
      
      if (state.status === 'connected') {
        // Mark messages as read when connection is established
        markMessagesAsRead(chatRoom.id);
      }
    });
    
    return unsubscribe;
  }, [chatRoom?.id]);
  
  // Fetch model data and set up chat room
  useEffect(() => {
    const initializeChat = async () => {
      if (!user) return;
      
      try {
        setIsLoaded(false);
        setFetchError(false);
        
        // Fetch model details
        const modelDetails = await apiService.getModelDetails(parseInt(id));
        
        if (!modelDetails) {
          setFetchError(true);
          setIsLoaded(true);
          return;
        }
        
        setModel(modelDetails);
        
        // If we have a room ID, get chat room details
        let chatRoomData;
        if (roomIdFromUrl) {
          console.log(`Loading existing chat room: ${roomIdFromUrl}`);
          chatRoomData = await getChatRoomById(parseInt(roomIdFromUrl));
        }
        
        // If no room ID in URL or failed to get room, create a new one
        if (!chatRoomData) {
          console.log(`Creating new chat room for doll ${id}`);
          chatRoomData = await createChatRoom(id.toString());
          if (!chatRoomData) {
            toast.error("Failed to create chat session");
            setFetchError(true);
            setIsLoaded(true);
            return;
          }
        }
        
        console.log('Chat room data:', chatRoomData);
        setChatRoom(chatRoomData);
        
        // Load messages for this chat room
        console.log(`Loading messages for chat room ${chatRoomData.id}`);
        const chatMessages = await getMessages(chatRoomData.id);
        if (chatMessages && chatMessages.length) {
          console.log(`Loaded ${chatMessages.length} messages`);
          setMessages(chatMessages);
          setHasMoreMessages(chatMessages.length === 50);
        } else {
          console.log('No existing messages found');
          setMessages([]);
        }
        
        // Mark messages as read after loading them
        markMessagesAsRead(chatRoomData.id);
        
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setFetchError(true);
        setIsLoaded(true);
      }
    };

    initializeChat();
  }, [id, roomIdFromUrl]); // Removed user?.id from dependencies
  
  // Separate effect for WebSocket connection that only runs when chatRoom is set
  useEffect(() => {
    if (!chatRoom || !user) return;
    
    console.log(`Connecting to WebSocket for chat room ${chatRoom.id}`);
    const connectToRoom = async () => {
      const ws = await connectWebSocket(chatRoom.id, handleWebSocketMessage);
      if (ws) {
        wsRef.current = ws;
        console.log(`WebSocket connection established for room ${chatRoom.id}`);
      }
    };
    
    connectToRoom();
    
    // Cleanup function
    return () => {
      console.log(`Cleaning up WebSocket connection for room ${chatRoom.id}`);
      cleanup(chatRoom.id);
      wsRef.current = null;
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatRoom?.id]); // Only depend on chatRoom.id, not the user
  
  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (data) => {
    console.log("User WebSocket message received:", data);
    
    // Handle different types of messages
    if (data.type === 'new_message' && data.message) {
      setMessages(prev => {
        // Prevent duplicate messages
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

  // Add scroll handler to mark messages as read when user scrolls to bottom
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // If user is within 50px of the bottom, mark messages as read
    if (scrollHeight - scrollTop - clientHeight < 50) {
      if (chatRoom) {
        markMessagesAsRead(chatRoom.id);
      }
    }
  };

  const loadMoreMessages = async () => {
    if (!chatRoom || isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    try {
      console.log(`Loading more messages from offset ${messages.length}`);
      const olderMessages = await getMessages(chatRoom.id, messages.length);
      
      if (olderMessages.length > 0) {
        console.log(`Loaded ${olderMessages.length} older messages`);
        setMessages(prev => [...olderMessages, ...prev]);
        setHasMoreMessages(olderMessages.length === 50);
        
        // Mark messages as read after loading more messages
        markMessagesAsRead(chatRoom.id);
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


  
  // Handle typing indicator
  const handleTyping = () => {
    if (chatRoom) {
      sendTypingIndicator(chatRoom.id, true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to indicate stopped typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(chatRoom.id, false);
      }, 3000);
    }
  };
  
  // Fixed handleSendMessage to prevent event object rendering
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !model || !chatRoom) return;
    
    if (!user) {
      toast.error("Please login to send messages");
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Get the moderator ID for this chat room
      const moderatorId = chatRoom.moderator_id || null;
      
      // Handle text message
      if (newMessage.trim()) {
        try {
          await sendMessage(newMessage.trim(), chatRoom.id, moderatorId);
          
          // Add message to local state for immediate feedback
          const textMessage = {
            id: Date.now() + 1,
            chat_room_id: chatRoom.id,
            sender_id: user.id,
            sender_uuid: user.uuid,
            sender_name: 'You',
            content: newMessage,
            created_at: new Date().toISOString(),
            flagged: false,
            message_type: 'TEXT'
          };
          
          setMessages(prev => [...prev, textMessage]);
          setNewMessage('');
          
          // Stop typing indicator
          sendTypingIndicator(chatRoom.id, false);
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

  // Render connection status indicator
  const renderConnectionStatus = () => {
    if (connectionStatus === 'connected') {
      return (
        <div className="text-center py-1 px-2 bg-green-500 text-white text-xs font-medium rounded-b-lg animate-fade-in">
          Connected
        </div>
      );
    } else if (connectionStatus === 'connecting') {
      return (
        <div className="text-center py-1 px-2 bg-yellow-500 text-white text-xs font-medium rounded-b-lg animate-fade-in">
          Connecting...
        </div>
      );
    } else if (connectionStatus === 'disconnected' || connectionStatus === 'error') {
      return (
        <div className="text-center py-1 px-2 bg-red-500 text-white text-xs font-medium rounded-b-lg animate-fade-in">
          {connectionStatus === 'error' ? 'Connection Error' : 'Disconnected'}
        </div>
      );
    }
    return null;
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-24 pb-12 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
          <div className="container mx-auto max-w-4xl">
            <div className={`glass-card rounded-xl overflow-hidden p-8 shimmer h-96 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!model || fetchError || !chatRoom) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-24 pb-12 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
          <div className="container mx-auto max-w-4xl text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Chat Not Available</h1>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>We couldn't establish a chat session. Please try again later.</p>
            <Link 
              to={`/model/${id}`}
              className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Back to Model Details
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Link
              to={`/model/${model.id}`}
              className="inline-flex items-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white rounded-md px-4 py-2 font-medium shadow hover:opacity-90 focus:ring-2 focus:ring-metadite-primary transition"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to {model.name}
            </Link>
          </div>
          
          <div className={`glass-card rounded-xl overflow-hidden h-[600px] flex flex-col ${theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : ''}`}>
            <div className={`p-4 border-b flex items-center justify-between ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/200?text=Model';
                    }}
                  />
                </div>
                <div>
                  <h2 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{model.name}</h2>
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
            
            {renderConnectionStatus()}
            
            <div className="overflow-y-auto p-4 flex-grow space-y-4" onScroll={handleScroll}>
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
                      onDelete={message.sender_uuid === user?.uuid || message.sender_id === user?.uuid ? () => handleDeleteMessage(message.id) : null}
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
            

            
            <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <div className="relative flex-1">
                  <Textarea
                    placeholder={connectionStatus === 'connected' 
                      ? `Send a message to ${model.name}...` 
                      : '...'}
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
                        // Fixed: Create a synthetic event instead of passing the actual event
                        const syntheticEvent = { preventDefault: () => {} };
                        handleSendMessage(syntheticEvent);
                      }
                    }}
                  />
                </div>
                

                
                <button 
                  type="submit"
                  disabled={!newMessage.trim() || isUploading || connectionStatus !== 'connected'}
                  className="flex-shrink-0 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white p-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isUploading ? (
                    <span className="inline-block h-5 w-5 rounded-full border-2 border-white border-r-transparent animate-spin"></span>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ModelChat;
