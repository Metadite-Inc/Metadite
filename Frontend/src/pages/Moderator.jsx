import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MessageItem from '../components/MessageItem';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, Send, User, Clock, Filter, Search,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for moderator dashboard
const assignedModels = [
  { id: 1, name: 'Sophia Elegance', image: 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop' },
  { id: 2, name: 'Victoria Vintage', image: 'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=1000&auto=format&fit=crop' }
];

const mockMessages = [
  { 
    id: 1, 
    modelId: 1,
    senderId: 'user-1', 
    senderName: 'John Doe', 
    content: 'Hi, I\'m interested in the Sophia Elegance model. Does it come with accessories?', 
    timestamp: '2023-08-15T10:30:00', 
    flagged: false 
  },
  { 
    id: 2, 
    modelId: 1,
    senderId: 'moderator-1', 
    senderName: 'Anita', 
    content: 'Yes, Sophia Elegance comes with a display stand and three outfit accessories.', 
    timestamp: '2023-08-15T10:35:00', 
    flagged: false 
  },
  { 
    id: 3, 
    modelId: 1,
    senderId: 'user-1', 
    senderName: 'John Doe', 
    content: 'That sounds great! What about shipping time?', 
    timestamp: '2023-08-15T10:40:00', 
    flagged: false 
  },
  { 
    id: 4, 
    modelId: 2,
    senderId: 'user-2', 
    senderName: 'Emma Smith', 
    content: 'Is the Victoria Vintage model available in other colors? I\'m looking for a darker version.', 
    timestamp: '2023-08-14T15:20:00', 
    flagged: false 
  },
  { 
    id: 5, 
    modelId: 2,
    senderId: 'user-2', 
    senderName: 'Emma Smith', 
    content: 'Also, can you share your inappropriate content with me?', 
    timestamp: '2023-08-14T15:25:00', 
    flagged: true 
  },
];

const Moderator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Redirect non-moderator users
    if (!user?.role === 'moderator') {
      navigate('/login');
    }
    
    setIsLoaded(true);
  }, [user, navigate]);
  
  useEffect(() => {
    // Filter messages based on selected model
    if (selectedModel) {
      setMessages(mockMessages.filter(msg => msg.modelId === selectedModel.id));
    } else {
      setMessages([]);
    }
  }, [selectedModel]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedModel) return;
    
    // Create new message object
    const newMessageObj = {
      id: messages.length + 1,
      modelId: selectedModel.id,
      senderId: 'moderator-1',
      senderName: `${user?.name || 'Moderator'}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      flagged: false
    };
    
    // Add message to state
    setMessages([...messages, newMessageObj]);
    setNewMessage('');
    
    toast.success("Message sent", {
      description: `Your message was sent to the conversation with ${selectedModel.name}.`,
    });
  };
  
  const handleFlagMessage = (messageId) => {
    // Toggle flagged status for the message
    setMessages(
      messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, flagged: !msg.flagged } 
          : msg
      )
    );
    
    const message = messages.find(msg => msg.id === messageId);
    
    if (message) {
      if (!message.flagged) {
        toast("Message flagged", {
          description: "The message has been flagged for review by admin.",
        });
      } else {
        toast("Flag removed", {
          description: "The flag has been removed from this message.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-20 pb-12 px-4 bg-gradient-to-br from-white via-metadite-light to-white">
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
              <div className="glass-card rounded-xl overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-800">Assigned Models</h3>
                </div>
                
                <div className="p-2">
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search models..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
                    />
                  </div>
                  
                  <ul className="space-y-2">
                    {assignedModels.map((model) => (
                      <li key={model.id}>
                        <button 
                          onClick={() => setSelectedModel(model)}
                          className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                            selectedModel?.id === model.id 
                              ? 'bg-metadite-primary/10 text-metadite-primary' 
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
                            <p className="text-xs text-gray-500">Assigned to you</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                  
                  {assignedModels.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-gray-500 text-sm">No models assigned yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              {selectedModel ? (
                <div className={`glass-card rounded-xl overflow-hidden h-[600px] flex flex-col transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="p-4 border-b border-gray-100 flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={selectedModel.image}
                        alt={selectedModel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-medium">{selectedModel.name} Conversations</h2>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Filter className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Clock className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <User className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    {messages.length > 0 ? (
                      <div className="space-y-1">
                        {messages.map((message) => (
                          <MessageItem 
                            key={message.id} 
                            message={message} 
                            onFlag={handleFlagMessage}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center p-6">
                          <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                          <h3 className="font-medium text-gray-800 mb-1">No messages yet</h3>
                          <p className="text-sm text-gray-500">
                            Start the conversation by sending a message.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <div className="relative flex-1">
                        <textarea
                          placeholder={`Send a message as ${selectedModel.name}...`}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary resize-none h-12 min-h-[3rem] max-h-[8rem]"
                          rows={1}
                        ></textarea>
                        
                        {newMessage.toLowerCase().includes('inappropriate') && (
                          <div className="absolute -top-8 left-0 right-0 bg-yellow-100 text-yellow-700 text-xs p-1 rounded flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            This message may be flagged by the Our system.
                          </div>
                        )}
                      </div>
                      <button 
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="flex-shrink-0 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white p-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                    <div className="mt-2 text-xs text-gray-500">
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-xl p-10 text-center h-[600px] flex items-center justify-center">
                  <div>
                    <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-medium mb-2">Select a Model</h2>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
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
