
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Users, Clock, ArrowRight, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getUserChatRooms } from '../services/ChatService';

const ChatPage = () => {
  const { theme } = useTheme();
  const { user, loading } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Only load chat rooms if user is authenticated
    if (user && !loading) {
      loadUserChatRooms();
    } else if (!loading && !user) {
      // User is not authenticated and auth has finished loading
      setLoadingRooms(false);
    }
  }, [user, loading]);

  const loadUserChatRooms = async () => {
    try {
      setLoadingRooms(true);
      console.log('Loading chat rooms for user:', user?.id);
      
      // Use getUserChatRooms for regular users
      const rooms = await getUserChatRooms();
      
      if (rooms && Array.isArray(rooms)) {
        // Transform the rooms data to match the expected format
        const userRooms = rooms.map(room => ({
          id: room.id,
          modelId: room.doll_id,
          modelName: room.doll_name || `Model ${room.doll_id}`,
          modelImage: room.doll_image || 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop',
          lastMessage: room.last_message?.content || 'No messages yet',
          lastMessageTime: room.last_message?.created_at,
          unreadCount: room.unread_count || 0,
          createdAt: room.created_at
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

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
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
            <Link
              to="/login"
              className="bg-metadite-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center space-x-2"
            >
              <span>Go to Login</span>
              <ArrowRight className="h-4 w-4" />
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
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">My Chats</h1>
                  <p className="opacity-80">Continue conversations with your favorite models</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                  {chatRooms.length} Conversations
                </span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-metadite-primary`}
              />
            </div>
          </div>

          {/* Chat Rooms List */}
          <div className={`glass-card rounded-xl overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50'
          }`}>
            {loadingRooms ? (
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 rounded-full border-4 border-metadite-primary border-r-transparent animate-spin"></div>
                <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Loading your conversations...
                </p>
              </div>
            ) : filteredChatRooms.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredChatRooms.map((room) => (
                  <Link
                    key={room.id}
                    to={`/model-chat/${room.modelId}?roomId=${room.id}`}
                    className={`block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      room.unreadCount > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
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
                          <div className="flex items-center space-x-2">
                            <Clock className={`h-4 w-4 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <span className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {formatTime(room.lastMessageTime)}
                            </span>
                          </div>
                        </div>
                        <p className={`text-sm truncate mt-1 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {room.lastMessage}
                        </p>
                      </div>
                      
                      <ArrowRight className={`h-5 w-5 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-metadite-primary opacity-50" />
                <h3 className="text-xl font-medium mb-2">No conversations yet</h3>
                <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Start chatting with models to see your conversations here
                </p>
                <Link
                  to="/models"
                  className="bg-metadite-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center space-x-2"
                >
                  <span>Browse Models</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
