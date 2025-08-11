import React from 'react';
import { Flag, Heart, Share2, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTheme } from '../../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { createChatRoom } from '../../../services/ChatService';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import RegionDisplay from '../../../components/RegionDisplay';

const ModelDetails = ({ 
  model, 
  quantity, 
  setQuantity, 
  isLiked, 
  handleLike, 
  handleShare, 
  handleAddToCart
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  
  const handleChatButtonClick = async () => {
    if (!user) {
      toast.error("Please log in to start a chat");
      return;
    }

    // Check if user has free membership - redirect to upgrade page
    if (user.membership_level === 'free') {
      navigate('/upgrade');
      toast.info("Upgrade your membership to chat with models");
      return;
    }

    try {
      // Create a chat room first
      const chatRoom = await createChatRoom(model.id.toString());
      
      if (chatRoom) {
        // Navigate to the model chat page with the chat room ID
        navigate(`/model-chat/${model.id}?roomId=${chatRoom.id}`);
      } else {
        toast.error("Failed to create chat room");
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
      toast.error("Error creating chat session");
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold">{model.name}</h1>
        <div className="flex gap-2">
          <button 
            onClick={handleLike}
            className={`p-2 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded-full ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : isDark ? 'text-gray-300' : 'text-gray-500'}`} />
          </button>
          <button 
            onClick={handleShare}
            className={`p-2 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded-full ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors`}
          >
            <Share2 className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center mt-2 mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < Math.floor(model.rating) ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm ml-2`}>{model.rating} ({model.reviews} reviews)</span>
      </div>
      
      <div className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded mb-4">
        {model.category}
      </div>
      
      <div className="text-2xl font-bold text-metadite-primary mb-4">
        ${model.price}
      </div>
      
      <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
        {model.description}
      </p>
      
      <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-6 mb-6`}></div>
      
      <div className="flex items-center space-x-6 mb-6">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? 'border-gray-100 hover:bg-gray-700' : 'border-gray-900 hover:bg-gray-100'} border`}
          >
            -
          </button>
          <span className="w-10 text-center">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? 'border-gray-100 hover:bg-gray-700' : 'border-gray-900 hover:bg-gray-100'} border`}
          >
            +
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {model.inStock ? (
            <span className="text-green-600">In Stock</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleAddToCart}
          disabled={!model.inStock}
          className="flex-1 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Add to Cart
        </button>
        
        <a
          href="/checkout"
          className={`flex-1 border-2 border-metadite-primary text-metadite-primary px-6 py-3 rounded-lg ${isDark ? 'hover:bg-metadite-primary/10' : 'hover:bg-metadite-primary/5'} transition-colors text-center`}
        >
          Buy Now
        </a>
      </div>



      {/*<div className="mt-6">
        <Button 
          variant="outline" 
          className={`w-full flex items-center justify-center ${isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : ''}`}
          onClick={handleChatButtonClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {user?.membership_level === 'free' ? 'Upgrade to Chat' : 'Chat'}
        </Button>
      </div>*/}
    </div>
  );
};

export default ModelDetails;
