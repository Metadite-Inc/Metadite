
import { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const { theme } = useTheme();

  useEffect(() => {
    // Keep in sync with external changes like reload or global cart update
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleIncrease = async () => {
    const newQty = localQuantity + 1;
    setLocalQuantity(newQty);
    setIsUpdating(true);
    try {
      await updateQuantity(item.id, newQty);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async () => {
    if (localQuantity > 1) {
      const newQty = localQuantity - 1;
      setLocalQuantity(newQty);
      setIsUpdating(true);
      try {
        await updateQuantity(item.id, newQty);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeFromCart(item.id);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`glass-card rounded-lg p-4 mb-4 flex items-center ${
      theme === 'dark' ? 'bg-gray-800/70' : ''
    }`}>
      <div className="relative w-20 h-20 overflow-hidden rounded-md mr-4">
        {!imageLoaded && <div className="absolute inset-0 shimmer"></div>}
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover ${imageLoaded ? 'image-fade-in loaded' : 'image-fade-in'}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      <div className="flex-1">
        <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{item.name}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>${item.price}</p>
        
        <div className="flex items-center space-x-2 mt-2">
          <button 
            onClick={handleDecrease}
            className={`p-1 rounded-md ${theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            disabled={item.quantity <= 1 || isUpdating}
          >
            <Minus className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          
          <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'} w-6 text-center`}>
            {isUpdating ? '...' : localQuantity}
          </span>
          
          <button 
            onClick={handleIncrease}
            className={`p-1 rounded-md ${theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            disabled={isUpdating}
          >
            <Plus className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        
        <button 
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 transition-colors mt-2"
          disabled={isUpdating}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;