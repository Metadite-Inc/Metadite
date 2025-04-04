
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Sample model data for demo purposes
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

// Provider component that wraps your app and makes cart object available to any child component that calls useCart().
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem('metaditeCart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
    setLoading(false);
  }, []);

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
  const addToCart = (item: Model) => {
    // Check if item is already in cart
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
  };

  // Remove item from cart
  const removeFromCart = (itemId: number | string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  // Update item quantity
  const updateQuantity = (itemId: number | string, quantity: number) => {
    setItems(
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: quantity } 
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
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
