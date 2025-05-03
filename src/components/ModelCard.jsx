import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { userApi } from '../lib/api/user_api';

const ModelCard = ({ model, user, isFavorite, onRemoveFavorite }) => {
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(isFavorite || false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [favoriteId, setFavoriteId] = useState(model.id); // Store the favorite ID for API operations

  useEffect(() => {
    setIsLiked(isFavorite || false);
  }, [isFavorite]);

  const handleAddToCart = () => {
    addToCart(model);
    toast.success("Added to cart!", {
      description: `${model.name} has been added to your cart.`,
    });
  };

  const handleLike = async () => {
    // Use access_token to match auth_api.ts implementation
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error("Please log in to save favorites");
      return;
    }

    try {
      if (!isLiked) {
        // Add to favorites - We'll get user ID from the backend based on the token
        const response = await userApi.addModelToFavorites(0, model.id); // 0 as placeholder, backend will use token
        setFavoriteId(response.id); // Save the favorite ID returned from the API
        setIsLiked(true);
        toast.success("Added to favorites");
      } else {
        // Remove from favorites
        if (onRemoveFavorite) {
          // If callback provided (used in FavoritesTab), use that
          onRemoveFavorite();
        } else {
          // Otherwise call API directly
          await userApi.removeModelFromFavorites(favoriteId);
        }
        setIsLiked(false);
        toast.success("Removed from favorites");
      }
    } catch (error) {
      console.error("Favorite operation failed:", error);
      if (error.message && (error.message.includes("401") || error.message.includes("403"))) {
        toast.error("Authentication failed. Please log in again.");
      } else {
        toast.error("Failed to update favorites");
      }
    }
  };

  const handleSendMessage = () => {
    setIsChatOpen(true); // Open the chat popup
  };

  const handleSendChat = () => {
    if (!user) {
      toast.error("Please log in to send a message.");
      return;
    }

    const moderatorName = model.moderator?.name || "our team";
    toast.success("Message sent!", {
      description: `Your message has been sent to ${moderatorName}.`,
    });

    // Simulate sending the message
    console.log(`Message to ${moderatorName}: ${message}`);
    setMessage(''); // Clear the input field
    setIsChatOpen(false); // Close the chat popup after sending
  };

  return (//model card size
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="relative overflow-hidden h-100">
        {!imageLoaded && <div className="absolute inset-0 shimmer"></div>}
        <img
          src={model.image}
          alt={model.name}
          className={`w-full h-full object-cover transition-transform duration-700 hover:scale-110 ${imageLoaded ? 'image-fade-in loaded' : 'image-fade-in'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <button 
          onClick={handleLike}
          className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/model/${model.id}`}>
            <h3 className="text-xl font-semibold hover:text-metadite-primary transition-colors">{model.name}</h3>
          </Link>
          <span className="bg-metadite-primary/10 text-metadite-primary px-2 py-1 rounded-full text-sm font-medium">${model.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{model.description}</p>
        
        <div className="flex justify-between items-center">
          <Link to={`/model/${model.id}`} className="text-metadite-primary text-sm font-medium hover:underline">
            View Details
          </Link>
          <button 
            onClick={handleSendMessage}
            className="flex items-center space-x-1 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          <button 
            onClick={handleAddToCart}
            className="flex items-center space-x-1 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="h-4 w-4" />
            </button>
        </div>
      </div>

      {/* Chat Popup */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Send a Message</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Write your message to ${model.moderator?.name || "our team"}...`}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-metadite-primary"
              rows="4"
            ></textarea>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsChatOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendChat}
                className="px-4 py-2 bg-metadite-primary text-white rounded-md hover:bg-metadite-secondary transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelCard;
