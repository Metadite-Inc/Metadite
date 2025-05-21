import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MessageSquare, Send, AlertTriangle, Paperclip, FileImage, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MessageItem from '../components/MessageItem';
import { Textarea } from "@/components/ui/textarea";
import { apiService } from '../lib/api'; // Import the API service
import { sendMessage, sendFileMessage } from '../services/ChatService';

const ModelChat = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [model, setModel] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [fetchError, setFetchError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Fetch model data using our API service
  useEffect(() => {
    const fetchModelDetails = async () => {
      try {
        setIsLoaded(false);
        setFetchError(false);
        
        const modelDetails = await apiService.getModelDetails(parseInt(id));
        
        if (!modelDetails) {
          setFetchError(true);
          setIsLoaded(true);
          return;
        }
        
        setModel(modelDetails);
        
        // Initial message from model
        const modelMessage = {
          id: 1,
          modelId: modelDetails.id,
          senderId: 'model.id',
          senderName: modelDetails.name,
          content: `Hello! I'm ${modelDetails.name}. How are you today?`,
          timestamp: new Date().toISOString(),
          flagged: false,
          message_type: 'TEXT'
        };
        
        setMessages([modelMessage]);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch model details:", error);
        setFetchError(true);
        setIsLoaded(true);
      }
    };

    fetchModelDetails();
  }, [id]);
  
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
    
    if ((!newMessage.trim() && !selectedFile) || !model) return;
    
    if (!user) {
      toast.error("Please login to send messages");
      return;
    }
    
    try {
      setIsUploading(true);
      
      let messageData = null;
      
      // Handle file upload
      if (selectedFile) {
        try {
          messageData = await sendFileMessage(selectedFile, model.id.toString());
          
          // Add message to state immediately for responsive UI
          const fileMessage = {
            id: Date.now(), // temporary ID
            modelId: model.id,
            senderId: user.id || 'user-temp',
            senderName: user.name || 'User',
            content: selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : selectedFile.name,
            timestamp: new Date().toISOString(),
            flagged: false,
            message_type: selectedFile.type.startsWith('image/') ? 'IMAGE' : 'FILE'
          };
          
          setMessages(prev => [...prev, fileMessage]);
          
          // Clear file selection
          clearSelectedFile();
        } catch (error) {
          console.error("Failed to upload file:", error);
          toast.error("Failed to upload file");
        }
      }
      
      // Handle text message
      if (newMessage.trim()) {
        try {
          messageData = await sendMessage({
            content: newMessage.trim(),
            message_type: 'TEXT',
            doll_id: model.id.toString()
          });
          
          // Add message to state immediately for responsive UI
          const textMessage = {
            id: Date.now() + 1, // temporary ID
            modelId: model.id,
            senderId: user.id || 'user-temp',
            senderName: user.name || 'User',
            content: newMessage,
            timestamp: new Date().toISOString(),
            flagged: false,
            message_type: 'TEXT'
          };
          
          setMessages(prev => [...prev, textMessage]);
          setNewMessage('');
        } catch (error) {
          console.error("Failed to send message:", error);
          toast.error("Failed to send message");
        }
      }
      
      // Simulate moderator response
      setTimeout(() => {
        const moderatorResponse = {
          id: Date.now() + 2,
          modelId: model.id,
          senderId: 'moderator-1',
          senderName: 'Support Team',
          content: `Thank you for your message about ${model.name}. I'll get back to you soon.`,
          timestamp: new Date().toISOString(),
          flagged: false,
          message_type: 'TEXT'
        };
        
        setMessages(prev => [...prev, moderatorResponse]);
        toast.success("Message received", {
          description: "Our team will respond shortly.",
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsUploading(false);
    }
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

  const promptFileSelection = () => {
    fileInputRef.current?.click();
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

  if (!model || fetchError) {
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
                  {model.description && model.description.substring(0, 40)}...
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
                        <FileImage className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
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
                
                {/* File upload button */}
                <button 
                  type="button"
                  onClick={promptFileSelection}
                  className={`flex-shrink-0 p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
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
                  disabled={(!newMessage.trim() && !selectedFile) || isUploading}
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
      
      <Footer />
    </div>
  );
};

export default ModelChat;
