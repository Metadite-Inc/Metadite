
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
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-metadite-primary hover:underline flex items-center space-x-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-bold mb-4">Chat Support</h1>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-h-[70vh] flex flex-col">
        {/* Messages area with scrolling */}
        <div className="overflow-y-auto mb-4 flex-grow">
          {messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-md ${
                    message.sender_id === user?.id 
                      ? 'bg-metadite-primary/10 ml-auto max-w-[80%]' 
                      : 'bg-gray-100 dark:bg-gray-700 mr-auto max-w-[80%]'
                  }`}
                >
                  <p className="text-sm font-medium">{message.sender_name || 'Unknown'}</p>
                  
                  {/* Message content based on type */}
                  {message.message_type === 'IMAGE' ? (
                    <img 
                      src={message.content} 
                      alt="Shared image" 
                      className="mt-1 max-w-full rounded-md"
                    />
                  ) : message.message_type === 'FILE' ? (
                    <a 
                      href={message.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center text-blue-500 hover:underline"
                    >
                      <FileImage className="mr-1 h-4 w-4" />
                      Download file
                    </a>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message.content}</p>
                  )}
                  
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-2 text-gray-500 dark:text-gray-400">No messages yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Start the conversation below</p>
            </div>
          )}
        </div>
        
        {/* File preview */}
        {selectedFile && (
          <div className="border border-gray-200 dark:border-gray-700 p-2 mb-3 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="h-12 w-12 object-cover rounded-md" 
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-md">
                    <FileImage className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <span className="text-sm truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
              </div>
              <button 
                onClick={clearSelectedFile}
                className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Message input */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-metadite-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          
          {/* File input button */}
          <button 
            type="button"
            onClick={promptFileSelection}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Paperclip className="h-5 w-5 text-gray-500 dark:text-gray-300" />
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
            className="bg-metadite-primary text-white px-4 py-2 rounded-md hover:bg-metadite-secondary transition"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
