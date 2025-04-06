
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Send, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MessageItem from '../components/MessageItem';
import { getModelData } from './model/api/modelData';
import { Textarea } from "@/components/ui/textarea";

const ModelChat = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [model, setModel] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);
  
  // Fetch model data
  useEffect(() => {
    // Simulate fetching the model
    setTimeout(() => {
      const fetchedModel = getModelData(id);
      setModel(fetchedModel);
      setIsLoaded(true);
      
      // Initial message from moderator
      if (fetchedModel) {
        const moderatorMessage = {
          id: 1,
          modelId: fetchedModel.id,
          senderId: 'moderator-1',
          senderName: 'Support Team',
          content: `Hello! I'm the moderator assigned to ${fetchedModel.name}. How can I help you today?`,
          timestamp: new Date().toISOString(),
          flagged: false
        };
        
        setMessages([moderatorMessage]);
      }
    }, 800);
  }, [id]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !model) return;
    
    if (!user) {
      toast.error("Please login to send messages");
      return;
    }
    
    // Create new message
    const userMessage = {
      id: messages.length + 1,
      modelId: model.id,
      senderId: user.id || 'user-temp',
      senderName: user.name || 'User',
      content: newMessage,
      timestamp: new Date().toISOString(),
      flagged: false
    };
    
    // Add message to state
    setMessages([...messages, userMessage]);
    setNewMessage('');
    
    // Simulate moderator response
    setTimeout(() => {
      const moderatorResponse = {
        id: messages.length + 2,
        modelId: model.id,
        senderId: 'moderator-1',
        senderName: 'Support Team',
        content: `Thank you for your message about ${model.name}. A moderator will get back to you soon.`,
        timestamp: new Date().toISOString(),
        flagged: false
      };
      
      setMessages(prev => [...prev, moderatorResponse]);
      
      toast.success("Message received", {
        description: "Our team will respond shortly.",
      });
    }, 1000);
  };
  
  const handleFlagMessage = (messageId) => {
    // Toggle flagged status
    setMessages(prev => 
      prev.map(msg => 
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

  if (!model) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-24 pb-12 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
          <div className="container mx-auto max-w-4xl text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Model Not Found</h1>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>The model you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/models"
              className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse All Models
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
            <Link to={`/model/${model.id}`} className="flex items-center text-metadite-primary hover:underline">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to {model.name}
            </Link>
          </div>
          
          <div className={`glass-card rounded-xl overflow-hidden h-[600px] flex flex-col ${theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : ''}`}>
            <div className={`p-4 border-b flex items-center ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img
                  src={model.image}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Chat about {model.name}</h2>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Our team will respond as soon as possible
                </p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageItem 
                      key={message.id} 
                      message={message} 
                      onFlag={handleFlagMessage}
                    />
                  ))}
                  <div ref={messageEndRef} />
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
                  <Textarea
                    placeholder={`Send a message about ${model.name}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className={`min-h-[48px] max-h-[120px] resize-none ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 text-gray-900'
                    }`}
                  />
                  
                  {newMessage.toLowerCase().includes('inappropriate') && (
                    <div className="absolute -top-8 left-0 right-0 bg-yellow-100 text-yellow-700 text-xs p-1 rounded flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      This message may be flagged by our system.
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
                <span className="flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Messages are monitored by moderators and our AI system.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ModelChat;
