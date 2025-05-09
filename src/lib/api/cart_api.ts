
import { toast } from "sonner";
import { BaseApiService } from "./base_api";
import { apiService } from "../api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export interface CartItem {
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

class CartApiService extends BaseApiService {
  // Add item to cart
  async addToCart(dollId: number, quantity = 1): Promise<void> {
    try {
      // Get user ID from JWT token
      const token = this.validateAuth();
      const userId = this.getUserIdFromToken(token);
      
      await this.request('/api/cart/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          doll_id: dollId,
          quantity: quantity
        }),
      });
      
      toast.success('Item added to cart');
    } catch (error) {
      toast.error('Failed to add item to cart', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Get cart items with full doll details
  async getCartItems(): Promise<CartItem[]> {
    try {
      const token = this.validateAuth();
      
      // First get the basic cart items from API
      const cartItems = await this.request<CartItem[]>('/api/cart/?skip=0&limit=100', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If we have cart items, fetch the full details for each doll
      if (cartItems.length > 0) {
        // For each cart item, fetch the doll details
        const itemsWithDetails = await Promise.all(cartItems.map(async (item) => {
          try {
            // Get the full doll details from the API
            const dollDetails = await apiService.getModelDetails(item.doll_id);
            
            // Merge the doll details with the cart item
            return {
              ...item,
              doll: {
                id: dollDetails?.id || item.doll_id,
                name: dollDetails?.name || 'Unknown Model',
                price: dollDetails?.price || 0,
                description: dollDetails?.description || '',
                image_url: dollDetails?.image || ''
              }
            };
          } catch (error) {
            console.error(`Failed to fetch details for doll ID ${item.doll_id}:`, error);
            // Return the original cart item if we couldn't fetch details
            return item;
          }
        }));
        
        return itemsWithDetails;
      }
      
      return cartItems;
    } catch (error) {
      toast.error('Failed to fetch cart items', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      console.error('Failed to fetch cart:', error);
      return [];
    }
  }

  // Update cart item quantity
  async updateCartItemQuantity(cartItemId: number, quantity: number): Promise<void> {
    try {
      const token = this.validateAuth();
      
      await this.request(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: quantity
        }),
      });
      
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      console.error('Failed to update cart:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeFromCart(cartItemId: number): Promise<void> {
    try {
      const token = this.validateAuth();
      
      await this.request(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  }

  // Clear cart
  async clearCart(): Promise<void> {
    try {
      const token = this.validateAuth();
      
      await this.request('/api/cart/', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }

  // Helper method to extract user ID from JWT token
  private getUserIdFromToken(token: string): number {
    try {
      // JWT tokens consist of three parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      // Decode the payload (middle part)
      const payload = JSON.parse(atob(parts[1]));
      
      // Extract the 'sub' claim which contains the user ID
      if (payload && payload.sub) {
        return Number(payload.sub);
      } else {
        throw new Error('User ID not found in token');
      }
    } catch (error) {
      console.error('Failed to extract user ID from token:', error);
      throw new Error('Failed to extract user ID from token');
    }
  }
}

export const cartApiService = new CartApiService();
