import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { favoriteApiService } from '../lib/api/favorite_api';

const ModelCard = ({ model, user, isFavorite: initialIsFavorite, onRemoveFavorite }) => {
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsFavorite || false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Check if model is favorited on component mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!model?.id) return;
      
      try {
        // Don't check if we already know it's a favorite (like in FavoritesTab)
        if (initialIsFavorite) {
          setIsLiked(true);
          return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) return;

        const { is_favorite, favorite_id } = await favoriteApiService.checkIsFavorite(model.id);
        setIsLiked(is_favorite);
        if (favorite_id) {
          setFavoriteId(favorite_id);
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [model?.id, initialIsFavorite]);

  const handleAddToCart = () => {
    addToCart(model);
    toast.success("Added to cart!", {
      description: `${model.name} has been added to your cart.`,
    });
  };

  const handleLike = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      toast.error("Please log in to save favorites");
      return;
    }

    try {
      if (!isLiked) {
        // Add to favorites
        const result = await favoriteApiService.addToFavorites(model.id);
        if (result) {
          setFavoriteId(result.id);
          setIsLiked(true);
        }
      } else {
        // Remove from favorites
        if (onRemoveFavorite && typeof onRemoveFavorite === 'function') {
          // If callback provided (used in FavoritesTab), use that
          onRemoveFavorite();
        } else if (favoriteId) {
          // Otherwise call API directly
          await favoriteApiService.removeFromFavorites(favoriteId);
          setIsLiked(false);
          setFavoriteId(null);
        }
      }
    } catch (error) {
      console.error("Favorite operation failed:", error);
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

  // Check if model exists and has required properties
  if (!model) {
    return null;
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="relative overflow-hidden">
        {!imageLoaded && <div className="absolute inset-0 shimmer"></div>}
        <div className="aspect-square w-full">
          <img
            src={model.image}
            alt={model.name}
            className={`w-full h-80% object-cover transition-transform duration-700 hover:scale-110 ${imageLoaded ? 'image-fade-in loaded' : 'image-fade-in'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x400?text=No+Image';
            }}
          />
        </div>
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
