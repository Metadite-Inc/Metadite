
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { favoriteApiService } from '../lib/api/favorite_api';
import { createChatRoom } from '../services/ChatService';
import { useAuth } from '../context/AuthContext';
import { useChatAccess } from '../hooks/useChatAccess';

const ModelCard = ({ model, user, isFavorite: initialIsFavorite, onRemoveFavorite }) => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { addToCart } = useCart();
  const { canSendMessages } = useChatAccess();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsFavorite || false);
  const [favoriteId, setFavoriteId] = useState(null);
  
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

        const { is_favorite, favorite_id } = await favoriteApiService.checkIsFavorite(Number(model.id));
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
        if (!user?.id) {
          toast.error("User ID not found. Please log in again.");
          return;
        }
        console.log('Adding to favorites for model:', model.id, 'Model data:', model);
        
        // Validate model ID
        if (!model.id || model.id <= 0) {
          toast.error('Invalid model ID');
          console.error('Invalid model ID:', model.id);
          return;
        }
        
        const result = await favoriteApiService.addToFavorites(Number(model.id));
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
  
  const handleChatButtonClick = async () => {
    if (!authUser) {
      toast.error("Please log in to start a chat");
      return;
    }
    
    // Check if user has free membership - redirect to upgrade page
    if (authUser.membership_level === 'free') {
      navigate('/upgrade');
      toast.info("Upgrade your membership to chat with models");
      return;
    }

    // Check if user has chat access
    if (!canSendMessages) {
      toast.error("You don't have permission to send messages");
      return;
    }
    
    try {
      // Create a chat room
      const chatRoom = await createChatRoom(model.id.toString());
      if (chatRoom) {
        // Navigate to the chat page with the room ID
        navigate(`/model-chat/${model.id}?roomId=${chatRoom.id}`);
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
      toast.error("Failed to start chat. Please try again later.");
    }
  };

  // Check if model exists and has required properties
  if (!model) {
    return null;
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="relative overflow-hidden group">
        {!imageLoaded && <div className="absolute inset-0 shimmer"></div>}
        <div className="aspect-square w-full">
          <Link to={`/model/${model.id}`}>
            <img
              src={model.image}
              alt={model.name}
              className={`w-full h-80% object-cover transition-transform duration-700 hover:scale-110 cursor-pointer ${imageLoaded ? 'image-fade-in loaded' : 'image-fade-in'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/600x400?text=No+Image';
              }}
              loading="lazy"
              decoding="async"
            />
          </Link>
          
                    {/* Location Overlay - Bottom Left */}
          {model.available_regions && model.available_regions.length > 0 && (
            <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded-md text-xs">
              <div className="flex items-center space-x-2">
                {model.available_regions.map((region) => {
                  const regionConfig = {
                    usa: 'USA',
                    canada: 'CA',
                    mexico: 'MX',
                    uk: 'UK',
                    eu: 'EU',
                    asia: 'AS'
                  };
                  return (
                    <span key={region} className="text-xs">
                      {regionConfig[region] || region}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        

        
        <button 
          onClick={handleLike}
          className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors z-10"
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
          {/*<button 
            onClick={handleChatButtonClick}
            className="flex items-center space-x-1 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <MessageSquare className="h-4 w-4" />
          </button>*/}
          <button 
            onClick={handleAddToCart}
            className="flex items-center space-x-1 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
