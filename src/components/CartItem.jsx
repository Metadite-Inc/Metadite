
import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleIncrease = async () => {
    setIsUpdating(true);
    try {
      await updateQuantity(item.id, item.quantity + 1);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrease = async () => {
    if (item.quantity > 1) {
      setIsUpdating(true);
      try {
        await updateQuantity(item.id, item.quantity - 1);
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
    <div className="glass-card rounded-lg p-4 mb-4 flex items-center">
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
        <h3 className="font-medium text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-1">${item.price}</p>
        
        <div className="flex items-center space-x-2 mt-2">
          <button 
            onClick={handleDecrease}
            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={item.quantity <= 1 || isUpdating}
          >
            <Minus className="h-4 w-4 text-gray-600" />
          </button>
          
          <span className="text-gray-800 w-6 text-center">
            {isUpdating ? '...' : item.quantity}
          </span>
          
          <button 
            onClick={handleIncrease}
            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={isUpdating}
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
        
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
