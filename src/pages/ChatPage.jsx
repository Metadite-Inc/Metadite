import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, Paperclip, FileImage, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext'; 
import { 
  getMessages, 
  sendMessage, 
  sendFileMessage,
  createChatRoom,
  getChatRoomById,
  connectWebSocket 
} from '../services/ChatService';
import MessageItem from '../components/MessageItem';

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);
  const wsRef = useRef(null);

  // Redirect if the user is not a regular user
  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'moderator') {
      navigate('/'); // Redirect to the home page
    }
  }, [user, navigate]);

  // Initialize chat - either get existing room or create new
  useEffect(() => {
    const initializeChat = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        let chatRoomData;
        
        // If we have a room ID, load that chat room
        if (roomId) {
          chatRoomData = await getChatRoomById(parseInt(roomId));
        }
        
        // If no room ID or couldn't load, create a new chat room
        if (!chatRoomData) {
          // Using a default model ID or let the user select
          chatRoomData = await createChatRoom('1'); // Default to model ID 1 for generic support chat
          
          if (!chatRoomData) {
            toast.error("Couldn't create chat room");
            setIsLoading(false);
            return;
          }
        }
        
        setChatRoom(chatRoomData);
        
        // Load messages for this chat room
        const chatMessages = await getMessages(chatRoomData.id);
        
        if (chatMessages && chatMessages.length > 0) {
          setMessages(chatMessages);
        } else {
          // Add initial welcome message if there are no messages
          const welcomeMessage = {
            id: Date.now(),
            sender_id: 'moderator',
            sender_name: 'Support Team',
            content: 'Hello! How can I assist you today?',
            created_at: new Date().toISOString(),
            message_type: 'TEXT'
          };
          
          setMessages([welcomeMessage]);
        }
        
        // Connect to WebSocket for real-time messages
        const ws = connectWebSocket(chatRoomData.id, handleWebSocketMessage);
        wsRef.current = ws;
        
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to load chat");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeChat();
    
    // Clean up WebSocket connection
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId, user]);
  
  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (data) => {
    if (data.type === 'new_message' && data.message) {
      setMessages(prev => [...prev, data.message]);
    }
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 10MB"
      });
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, just show the file name
      setPreviewUrl(null);
    }
  };
  
  // Clear selected file
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!chatRoom) {
      toast.error("Chat room not initialized");
      return;
    }
    
    if ((!messageInput.trim() && !selectedFile) || !user) {
      return;
    }
    
    try {
      // Get the moderator ID for this chat room (default to 1 if not available)
      const moderatorId = chatRoom.moderator_id || 1;
      
      // Handle file upload first if there is one
      if (selectedFile) {
        try {
          await sendFileMessage(selectedFile, chatRoom.id);
          clearSelectedFile();
        } catch (error) {
          console.error("Failed to upload file:", error);
          toast.error("Failed to send file");
        }
      }
      
      // Then handle text message
      if (messageInput.trim()) {
        await sendMessage(messageInput.trim(), chatRoom.id, moderatorId);
        setMessageInput('');
      }
      
      // Note: We don't need to add the message to state here as it will come through the WebSocket
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const promptFileSelection = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-metadite-primary hover:underline flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <h1 className="text-2xl font-bold mb-4">Loading chat...</h1>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-metadite-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-metadite-primary hover:text-metadite-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Chat Support</h1>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isOwnMessage={message.sender_id === user?.id}
                  />
                ))}
                <div ref={messageEndRef} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Start the conversation below</p>
              </div>
            )}
          </div>

          {/* File preview */}
          {selectedFile && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {previewUrl ? (
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <FileImage className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button 
                  onClick={clearSelectedFile}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
          )}

          {/* Message input */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-metadite-primary dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              {/* File input button */}
              <button 
                type="button"
                onClick={promptFileSelection}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-400" />
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
                disabled={!messageInput.trim() && !selectedFile}
                className="p-3 rounded-xl bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
