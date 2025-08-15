import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Define types for the API

export interface Order {
  id: string;
  date: string;
  items: number;
  total: number;
  status: string;
}

interface ModelReview {
  id?: number;
  doll_id: number;
  rating: number;
  comment: string;
  created_at?: string;
  updated_at?: string;
}

interface FavoriteModel {
  id?: number;
  doll_id: number;
  created_at?: string;
}

export interface ChatAccessStatus {
  can_send_messages: boolean;
  can_watch_videos: boolean;
}

class userApiService {
  async getUserOrders(): Promise<Order[]> {
    try {
      // Fetches the authenticated user's orders
      const result = await this.request<Order[]>(`/api/orders/`, {
        method: 'GET',
      });
      return result;
    } catch (error) {
      if (error.message?.includes('401') || error.message?.includes('403')) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error('Failed to fetch order history');
      }
      throw error;
    }
  }

  async updateProfile(data: { full_name: string; email: string; region: string }): Promise<any> {
    try {
      const result = await this.request<any>(`/api/auth/me/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      toast.success('Profile updated successfully');
      return result;
    } catch (error: any) {
      if (error.message?.includes('401') || error.message?.includes('403')) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error('Failed to update profile');
      }
      throw error;
    }
  }

  async updatePassword(data: { current_password: string; new_password: string }): Promise<any> {
    try {
      const result = await this.request<any>(`/api/auth/password-update`, {
        method: 'POST',
        body: JSON.stringify({
          old_password: data.current_password,
          new_password: data.new_password
        }),
      });
      toast.success('Password updated successfully');
      return result;
    } catch (error: any) {
      if (error.message?.includes('401') || error.message?.includes('403')) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error('Failed to update password');
      }
      throw error;
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await this.request<void>(`/api/auth/me`, {
        method: 'DELETE',
      });
      toast.success('Account deleted successfully');
    } catch (error: any) {
      if (error.message?.includes('401') || error.message?.includes('403')) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error('Failed to delete account');
      }
      throw error;
    }
  }

  async getChatAccessStatus(): Promise<ChatAccessStatus> {
    try {
      const result = await this.request<ChatAccessStatus>(`/api/chat/access-status/`, {
        method: 'GET',
      });
      return result;
    } catch (error) {
      console.error("Failed to fetch chat access status:", error);
      // Return default restricted access on error
      return {
        can_send_messages: false,
        can_watch_videos: false
      };
    }
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const result = await this.request<Order>(`/api/orders/${orderId}`, {
        method: 'GET',
      });
      return result;
    } catch (error) {
      if (error.message?.includes('401') || error.message?.includes('403')) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error('Failed to fetch order details');
      }
      throw error;
    }
  }

  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      await this.request(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      toast.success('Order deleted successfully');
      return true;
    } catch (error) {
      if (error.message?.includes('401') || error.message?.includes('403')) {
        toast.error('Authentication failed. Please log in again.');
      } else {
        toast.error('Failed to delete order');
      }
      return false;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Use access_token to match auth_api.ts implementation
    const token = localStorage.getItem('access_token');
    
    try {
      // Prepare headers with authentication
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      console.log(`Making request to ${API_URL}${endpoint}`);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle different response statuses
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error("Authentication error:", response.status);
          // Optionally clear token if it's expired
          // localStorage.removeItem('access_token');
          throw new Error(`Authentication error (${response.status}): Please log in again`);
        }
        
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.detail || "Unknown error"}`);
      }

      // Return successful response
      return response.json();
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  async getUserFavoriteModels(skip: number = 0, limit: number = 10): Promise<FavoriteModel[]> {
    try {
      const result = await this.request<FavoriteModel[]>(`/api/favorites/?skip=${skip}&limit=${limit}`, {
        method: 'GET',
      });
      return result;
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      toast.error("Failed to fetch favorite models");
      throw error;
    }
  }

  async addModelToFavorites(dollId: number): Promise<FavoriteModel> {
    try {
      const result = await this.request<FavoriteModel>('/api/favorites/', {
        method: 'POST',
        body: JSON.stringify({
          doll_id: dollId
        })
      });
      return result;
    } catch (error) {
      // Re-throw the error to be handled by the calling component
      throw error;
    }
  }

  async removeModelFromFavorites(dollId: number): Promise<void> {
    try {
      await this.request<void>(`/api/favorites/${dollId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      // Re-throw the error to be handled by the calling component
      throw error;
    }
  }

  async createModelReview(dollId: number, rating: number, comment: string): Promise<ModelReview> {
    try {
      const result = await this.request<ModelReview>('/api/reviews/', {
        method: 'POST',
        body: JSON.stringify({
          doll_id: dollId,
          rating,
          comment
        })
      });
      toast.success("Review submitted successfully");
      return result;
    } catch (error) {
      // Show more specific error messages
      if (error.message?.includes("401") || error.message?.includes("403")) {
        toast.error("Authentication failed. Please log in again.");
      } else {
        toast.error("Failed to submit review");
      }
      throw error;
    }
  }

  async updateModelReview(reviewId: number, rating: number, comment: string): Promise<ModelReview> {
    try {
      const result = await this.request<ModelReview>(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify({
          rating,
          comment
        })
      });
      toast.success("Review updated successfully");
      return result;
    } catch (error) {
      // Show more specific error messages
      if (error.message?.includes("401") || error.message?.includes("403")) {
        toast.error("Authentication failed. Please log in again.");
      } else {
        toast.error("Failed to update review");
      }
      throw error;
    }
  }

  async deleteModelReview(reviewId: number): Promise<void> {
    try {
      await this.request<void>(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      toast.success("Review deleted successfully");
    } catch (error) {
      // Show more specific error messages
      if (error.message?.includes("401") || error.message?.includes("403")) {
        toast.error("Authentication failed. Please log in again.");
      } else {
        toast.error("Failed to delete review");
      }
      throw error;
    }
  }
  
  async getUserModelReviews(skip: number = 0, limit: number = 10): Promise<ModelReview[]> {
    try {
      const result = await this.request<ModelReview[]>(`/api/reviews/user/?skip=${skip}&limit=${limit}`, {
        method: 'GET',
      });
      return result;
    } catch (error) {
      // Show more specific error messages
      if (error.message?.includes("401") || error.message?.includes("403")) {
        toast.error("Authentication failed. Please log in again.");
      } else {
        toast.error("Failed to fetch user reviews");
      }
      throw error;
    }
  }
}

export const userApi = new userApiService();
