
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
  available_regions?: string[];
}

interface CartItem {
  id: number; // cart row id
  doll_id: number | string; // model id
  name: string;
  price: number;
  description: string;
  image: string;
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

interface CartProviderProps {
  children: ReactNode;
}

// Utility to merge cart items by doll_id, summing their quantities
function mergeCartItemsByDollId(items: CartItem[]): CartItem[] {
  const merged: { [key: string]: CartItem } = {};
  for (const item of items) {
    const key = String(item.doll_id);
    if (merged[key]) {
      merged[key].quantity += item.quantity;
    } else {
      merged[key] = { ...item };
    }
  }
  return Object.values(merged);
}

// Provider component that wraps your app and makes cart object available
const LOCAL_STORAGE_CART_KEY = 'metaditeCart';

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Check if user is staff (admin or moderator) who shouldn't use cart
  const isStaffUser = user?.role === 'admin' || user?.role === 'moderator';

  // Transform API cart items to our CartItem format
  const transformApiCartItems = (apiItems: ApiCartItem[]): CartItem[] => {
    return apiItems.map(item => ({
      id: item.id, // cart row id
      doll_id: item.doll_id, // model id
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
      // Skip cart operations for admin and moderator users
      if (isStaffUser) {
        setItems([]);
        setLoading(false);
        return;
      }

      if (!user) {
        // If no user is logged in, try to load from localStorage
        const storedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        if (storedCart) {
          const parsed = JSON.parse(storedCart);
          setItems(mergeCartItemsByDollId(parsed));
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
          setItems(mergeCartItemsByDollId(transformedItems));
        } else {
          // If API returns empty but we have local cart, sync it to backend
          const storedCart = localStorage.getItem('metaditeCart');
          if (storedCart) {
            const localItems = JSON.parse(storedCart);
            setItems(mergeCartItemsByDollId(localItems));
            // Optional: could sync local cart to backend here
          }
        }
      } catch (error) {
        // If API fails, load from localStorage as fallback
        const storedCart = localStorage.getItem('metaditeCart');
        if (storedCart) {
          const parsed = JSON.parse(storedCart);
          setItems(mergeCartItemsByDollId(parsed));
        }
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user, isStaffUser]);

  // Save cart to localStorage whenever it changes (but not for staff users)
  useEffect(() => {
    if (!loading && !isStaffUser) {
      localStorage.setItem('metaditeCart', JSON.stringify(items));
    }
  }, [items, loading, isStaffUser]);

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
    // Don't allow staff users to add to cart
    if (isStaffUser) {
      toast.error('Cart functionality is not available for staff accounts');
      return;
    }

    try {
      if (user) {
        // Add to backend
        await cartApiService.addToCart(Number(item.id), 1);
        // Fetch the latest cart from backend to get real IDs
        const cartItems = await cartApiService.getCartItems();
        const transformedItems = transformApiCartItems(cartItems);
        setItems(mergeCartItemsByDollId(transformedItems));
        return;
      }
      // Not logged in: create local item
      const newItem: CartItem = {
        id: Date.now(), // temporary id (only for guests)
        doll_id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        quantity: 1
      };
      setItems(mergeCartItemsByDollId([...items, newItem]));
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Still update local cart even if API fails
      const newItem: CartItem = {
        id: Date.now(),
        doll_id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        quantity: 1
      };
      setItems(mergeCartItemsByDollId([...items, newItem]));
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: number | string) => {
    // Don't allow staff users to modify cart
    if (isStaffUser) {
      return;
    }

    try {
      // Find the cart item with this cart row ID
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
    // Don't allow staff users to modify cart
    if (isStaffUser) {
      return;
    }

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
    // Don't allow staff users to modify cart
    if (isStaffUser) {
      return;
    }

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
    // Implement with real data source or API
    return undefined;
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
