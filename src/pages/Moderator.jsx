
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MessageItem from '../components/MessageItem';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  MessageSquare, Send, User, Clock, Filter, Search,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getAssignedRooms, 
  getChatMessages, 
  sendModeratorMessage, 
  flagMessage,
  connectToChatWebSocket
} from '../lib/api/chat_api';

const Moderator = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [assignedModels, setAssignedModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const [websocket, setWebsocket] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Redirect non-moderator users
  useEffect(() => {
    if (user?.role !== 'moderator') {
      navigate('/');
    } else {
      setIsLoaded(true);
    }
  }, [user, navigate]);
  
  // Load assigned models/dolls when component mounts
  useEffect(() => {
    const loadAssignedModels = async () => {
      setLoading(true);
      try {
        const rooms = await getAssignedRooms();
        
        // Format the rooms data for display
        const models = rooms.map(room => ({
          id: room.id,
          name: room.doll_name || `Model ${room.id}`,
          image: room.doll_image || 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
          receiverId: room.user_id // Save the user_id for sending messages
        }));
        
        setAssignedModels(models);
      } catch (error) {
        console.error('Error loading assigned models:', error);
        toast.error('Failed to load assigned models');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'moderator') {
      loadAssignedModels();
    }
  }, [user]);
  
  // Load messages when a model is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedModel) return;
      
      setLoading(true);
      try {
        const chatMessages = await getChatMessages(selectedModel.id);
        setMessages(chatMessages);
        setReceiverId(selectedModel.receiverId);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    loadMessages();
    
    // Set up WebSocket connection for real-time updates
    if (selectedModel) {
      const ws = connectToChatWebSocket(selectedModel.id, handleWebSocketMessage);
      setWebsocket(ws);
      
      return () => {
        if (ws) {
          ws.close();
        }
      };
    }
  }, [selectedModel]);
  
  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (data) => {
    if (data.type === 'new_message') {
      setMessages(prev => [...prev, data.message]);
    }
  };
  
  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedModel || !receiverId) return;
    
    try {
      const sentMessage = await sendModeratorMessage(newMessage, selectedModel.id, receiverId);
      if (sentMessage) {
        // If WebSocket doesn't update the UI, we can add the message manually
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
        toast.success('Message sent');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };
  
  // Toggle flag status for a message
  const handleFlagMessage = async (messageId) => {
    try {
      const message = messages.find(msg => msg.id === messageId);
      if (!message) return;
      
      const updatedMessage = await flagMessage(messageId, !message.flagged);
      if (updatedMessage) {
        setMessages(prev => 
          prev.map(msg => msg.id === messageId 
            ? { ...msg, flagged: !msg.flagged } 
            : msg
          )
        );
        
        toast(message.flagged ? 'Flag removed' : 'Message flagged', {
          description: message.flagged 
            ? 'The flag has been removed from this message.' 
            : 'The message has been flagged for review by admin.',
        });
      }
    } catch (error) {
      console.error('Error flagging message:', error);
      toast.error('Failed to update message flag');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Moderator Dashboard</h1>
                  <p className="opacity-80">Manage conversations with users</p>
                </div>
              </div>
              
              <div>
                <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                  Moderator Account
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className={`glass-card rounded-xl overflow-hidden sticky top-24 ${
                theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : ''
              }`}>
                <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Assigned Models</h3>
                </div>
                
                <div className="p-2">
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search models..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`block w-full pl-9 pr-3 py-2 border rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  
                  {loading && assignedModels.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-metadite-primary mx-auto mb-2"></div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Loading assigned models...
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {assignedModels
                        .filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((model) => (
                        <li key={model.id}>
                          <button 
                            onClick={() => setSelectedModel(model)}
                            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                              selectedModel?.id === model.id 
                                ? 'bg-metadite-primary/10 text-metadite-primary' 
                                : theme === 'dark'
                                  ? 'text-gray-200 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                              <img
                                src={model.image}
                                alt={model.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-left">
                              <p className="font-medium">{model.name}</p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Assigned to you</p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {!loading && assignedModels.length === 0 && (
                    <div className="text-center py-6">
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No models assigned yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              {selectedModel ? (
                <div className={`glass-card rounded-xl overflow-hidden h-[600px] flex flex-col transition-opacity duration-300 ${
                  theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : ''
                } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <div className={`p-4 border-b flex items-center ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={selectedModel.image}
                        alt={selectedModel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{selectedModel.name} Conversations</h2>
                    </div>
                    <div className="flex space-x-2">
                      <button className={`p-2 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Filter className="h-5 w-5" />
                      </button>
                      <button className={`p-2 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                        <Clock className="h-5 w-5" />
                      </button>
                      <button className={`p-2 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                        <User className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-metadite-primary mx-auto mb-2"></div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading messages...</p>
                        </div>
                      </div>
                    ) : messages.length > 0 ? (
                      <div className="space-y-1">
                        {messages.map((message) => (
                          <MessageItem 
                            key={message.id} 
                            message={message} 
                            onFlag={() => handleFlagMessage(message.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center p-6">
                          <MessageSquare className={`h-10 w-10 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                          <h3 className={`font-medium mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>No messages yet</h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Start the conversation by sending a message.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <div className="relative flex-1">
                        <textarea
                          placeholder={`Send a message as ${selectedModel.name}...`}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary resize-none h-12 min-h-[3rem] max-h-[8rem] ${
                            theme === 'dark' 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'border-gray-300 text-gray-900'
                          }`}
                          rows={1}
                        ></textarea>
                      </div>
                      <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="flex-shrink-0 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white p-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className={`glass-card rounded-xl p-10 text-center h-[600px] flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : ''
                }`}>
                  <div>
                    <MessageSquare className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
                    <h2 className={`text-2xl font-medium mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Select a Model</h2>
                    <p className={`mb-6 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Choose a model from the list to view and respond to conversations from users interested in that model.
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

export default Moderator;
