
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useChatRoomList from '../hooks/useChatRoomList';

const ChatPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { chatRooms, loading, refreshChatRooms } = useChatRoomList();

  if (!user || user.membership_level === 'free') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-24 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="container mx-auto max-w-4xl text-center py-16">
            <MessageSquare className="h-16 w-16 mx-auto mb-6 text-metadite-primary" />
            <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>
              Premium Feature
            </h1>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Messaging is available for Standard, VIP, and VVIP members only.
            </p>
            <Link
              to="/upgrade"
              className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Upgrade Your Plan
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
      
      <div className={`flex-1 pt-24 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>
              My Conversations
            </h1>
            <button
              onClick={refreshChatRooms}
              className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`glass-card p-6 rounded-xl shimmer ${
                  theme === 'dark' ? 'bg-gray-800/70' : ''
                }`}>
                  <div className="h-48"></div>
                </div>
              ))}
            </div>
          ) : chatRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chatRooms.map((room) => (
                <Link
                  key={room.id}
                  to={`/model/${room.doll_id}/chat?roomId=${room.id}`}
                  className={`glass-card p-6 rounded-xl hover:scale-105 transition-transform group ${
                    theme === 'dark' ? 'bg-gray-800/70 hover:bg-gray-700/70' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative mb-4">
                    <img
                      src={room.doll?.image || 'https://placehold.co/300x200?text=Model'}
                      alt={room.doll?.name || 'Model'}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/300x200?text=Model';
                      }}
                    />
                    {room.unreadCount > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {room.unreadCount > 99 ? '99+' : room.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <h3 className={`font-semibold text-lg mb-2 group-hover:text-metadite-primary transition-colors ${
                    theme === 'dark' ? 'text-white' : ''
                  }`}>
                    {room.doll?.name || 'Unknown Model'}
                  </h3>
                  
                  <p className={`text-sm mb-3 line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {room.lastMessage || 'No messages yet'}
                  </p>
                  
                  {room.lastMessageTime && (
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {new Date(room.lastMessageTime).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className={`glass-card rounded-xl p-12 text-center ${
              theme === 'dark' ? 'bg-gray-800/70' : ''
            }`}>
              <MessageSquare className={`h-16 w-16 mx-auto mb-6 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
              }`} />
              <h2 className={`text-2xl font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : ''
              }`}>
                No Conversations Yet
              </h2>
              <p className={`mb-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Start chatting with models to see your conversations here.
              </p>
              <Link
                to="/models"
                className="inline-flex items-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus className="h-5 w-5 mr-2" />
                Browse Models
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
