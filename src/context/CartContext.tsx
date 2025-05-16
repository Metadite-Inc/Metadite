
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartApiService, CartItem as ApiCartItem } from '../lib/api/cart_api';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

export interface Model {
  id: number | string;
  name: string;
  price: number;
  description: string;
  image: string;
}

interface CartItem extends Model {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  totalAmount: number;
  totalItems: number;
  addToCart: (item: Model) => void;
  removeFromCart: (itemId: number | string) => void;
  updateQuantity: (itemId: number | string, quantity: number) => void;
  clearCart: () => void;
  getModel: (modelId: number | string) => Model | undefined;
}

// Create a context for cart
const CartContext = createContext<CartContextType | undefined>(undefined);

// Sample model data for demo or fallback purposes
const sampleModels: Model[] = [
  {
    id: 1,
    name: 'Sophia Elegance',
    price: 129.99,
    description: 'Handcrafted porcelain doll with intricate details and premium fabric clothing. A classic addition to any collection.',
    image: 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Victoria Vintage',
    price: 159.99,
    description: 'Inspired by Victorian era fashion, this doll features authentic period clothing and accessories with incredible attention to detail.',
    image: 'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Modern Mila',
    price: 99.99,
    description: 'Contemporary doll design with customizable features and modern fashion elements. Perfect for the trendy collector.',
    image: 'https://images.unsplash.com/photo-1603552489088-b8304faff8ad?q=80&w=1000&auto=format&fit=crop'
  }
];

interface CartProviderProps {
  children: ReactNode;
}

// Provider component that wraps your app and makes cart object available
const LOCAL_STORAGE_CART_KEY = 'metaditeCart';

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Transform API cart items to our CartItem format
  const transformApiCartItems = (apiItems: ApiCartItem[]): CartItem[] => {
    return apiItems.map(item => ({
      id: item.doll_id,
      name: item.doll?.name || 'Unknown Model',
      price: item.doll?.price || 0,
      description: item.doll?.description || '',
      image: item.doll?.image_url || '',
      quantity: item.quantity
    }));
  };

  // Fetch cart items on component mount or when user changes
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) {
        // If no user is logged in, try to load from localStorage
        const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        if (storedCart) {
          setItems(JSON.parse(storedCart));
        }
        setLoading(false);
        return;
      }

      try {
        // Try to get cart items from API
        const cartItems = await cartApiService.getCartItems();
        
        if (cartItems.length > 0) {
          // Transform API cart items to our CartItem format
          const transformedItems = transformApiCartItems(cartItems);
          setItems(transformedItems);
        } else {
          // If API returns empty but we have local cart, sync it to backend
          const storedCart = localStorage.getItem('metaditeCart');
          if (storedCart) {
            const localItems = JSON.parse(storedCart);
            setItems(localItems);
            // Optional: could sync local cart to backend here
          }
        }
      } catch (error) {
        // If API fails, load from localStorage as fallback
        const storedCart = localStorage.getItem('metaditeCart');
        if (storedCart) {
          setItems(JSON.parse(storedCart));
        }
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('metaditeCart', JSON.stringify(items));
    }
  }, [items, loading]);

  // Calculate total amount and items in cart
  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity, 
    0
  );
  
  const totalItems = items.reduce(
    (count, item) => count + item.quantity, 
    0
  );

  // Add item to cart
  const addToCart = async (item: Model) => {
    try {
      if (user) {
        // Try to add to API if user is logged in
        await cartApiService.addToCart(Number(item.id), 1);
      }
      
      // Update local state regardless of API success
      const itemIndex = items.findIndex(cartItem => cartItem.id === item.id);
      
      if (itemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...items];
        updatedItems[itemIndex].quantity += 1;
        setItems(updatedItems);
      } else {
        // Item doesn't exist, add it with quantity 1
        setItems([...items, { ...item, quantity: 1 }]);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Still update local cart even if API fails
      const itemIndex = items.findIndex(cartItem => cartItem.id === item.id);
      
      if (itemIndex !== -1) {
        const updatedItems = [...items];
        updatedItems[itemIndex].quantity += 1;
        setItems(updatedItems);
      } else {
        setItems([...items, { ...item, quantity: 1 }]);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: number | string) => {
    try {
      // Find the cart item with this model ID
      const cartItem = items.find(item => item.id === itemId);
      if (!cartItem) return;
      
      if (user) {
        // Try to remove via API if user is logged in
        await cartApiService.removeFromCart(Number(itemId));
      }
      
      // Update local state
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing from cart:", error);
      // Fallback to local cart if API fails
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: number | string, quantity: number) => {
    try {
      if (user) {
        // Try to update via API if user is logged in
        await cartApiService.updateCartItemQuantity(Number(itemId), quantity);
      }
      
      // Update local state
      setItems(
        items.map(item => 
          item.id === itemId 
            ? { ...item, quantity: quantity } 
            : item
        )
      );
    } catch (error) {
      console.error("Error updating cart:", error);
      // Fallback to local cart if API fails
      setItems(
        items.map(item => 
          item.id === itemId 
            ? { ...item, quantity: quantity } 
            : item
        )
      );
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      if (user) {
        // Try to clear via API if user is logged in
        await cartApiService.clearCart();
      }
      
      // Clear local state
      setItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      // Clear local state even if API fails
      setItems([]);
    }
  };

  // Get model by ID
  const getModel = (modelId: number | string) => {
    return sampleModels.find(model => model.id === modelId);
  };

  // Context value
  const value = {
    items,
    loading,
    totalAmount,
    totalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getModel
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook for components to get the cart object and re-render when it changes
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};