
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';
import { MessageSquare, Users } from 'lucide-react';

const ChatPage = () => {
  const { theme } = useTheme();

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
                  <h1 className="text-2xl font-bold">Chat</h1>
                  <p className="opacity-80">Connect with your favorite models</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                  Active Chats
                </span>
              </div>
            </div>
          </div>
          
          <div className={`glass-card rounded-xl p-8 text-center ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
          }`}>
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-metadite-primary" />
            <h2 className="text-2xl font-bold mb-4">Welcome to Chat</h2>
            <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Start conversations with your favorite models and enjoy personalized interactions.
            </p>
            <button className="bg-metadite-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Browse Models
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
