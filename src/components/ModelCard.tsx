import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

// Import the Model type directly from CartContext
import type { Model } from '../context/CartContext';

interface ModelProps {
  model: Model;
}

const ModelCard = ({ model }: ModelProps) => {
  const { addToCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(model);
    toast.success("Added to cart!", {
      description: `${model.name} has been added to your cart.`,
    });
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      toast("Added to favorites", {
        description: `${model.name} has been added to your favorites.`,
      });
    } else {
      toast("Removed from favorites", {
        description: `${model.name} has been removed from your favorites.`,
      });
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
      <div className="relative overflow-hidden h-64">
        {!imageLoaded && <div className="absolute inset-0 shimmer"></div>}
        <img
          src={model.image}
          alt={model.name}
          className={`w-full h-full object-contain bg-gray-100 transition-transform duration-700 hover:scale-110 ${imageLoaded ? 'image-fade-in loaded' : 'image-fade-in'}`}
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
            onClick={handleAddToCart}
            className="flex items-center space-x-1 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-3 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
