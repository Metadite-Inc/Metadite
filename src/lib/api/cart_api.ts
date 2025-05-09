
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface CartItem {
  id: number;
  user_id: number;
  doll_id: number;
  quantity: number;
  doll?: {
    id: number;
    name: string;
    price: number;
    description: string;
    image_url: string;
  };
}

class CartApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Cart API Error:', response.status, errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Cart request error:', error);
      throw error;
    }
  }

  // Add item to cart
  async addToCart(userID: number, dollId: number, quantity = 1): Promise<void> {
    try {
      await this.request('/api/cart/', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userID,
          doll_id: dollId,
          quantity: quantity
        }),
      });
      toast.success('Item added to cart');
    } catch (error) {
      toast.error('Failed to add item to cart', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Get cart items
  async getCartItems(): Promise<CartItem[]> {
    try {
      return await this.request<CartItem[]>('/api/cart/?skip=0&limit=100');
    } catch (error) {
      toast.error('Failed to fetch cart items', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      return [];
    }
  }

  // Update cart item quantity
  async updateCartItemQuantity(cartItemId: number, quantity: number): Promise<void> {
    try {
      await this.request(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        body: JSON.stringify({
          quantity: quantity
        }),
      });
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Remove item from cart
  async removeFromCart(cartItemId: number): Promise<void> {
    try {
      await this.request(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
      });
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Clear cart
  async clearCart(): Promise<void> {
    try {
      await this.request('/api/cart/', {
        method: 'DELETE',
      });
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}

export const cartApiService = new CartApiService();
