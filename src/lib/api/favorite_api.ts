import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Interface for favorite model data returned by API
 */
export interface FavoriteModel {
  id: number;
  user_id: number;
  doll_id: number;
  doll?: {
    id: number;
    name: string;
    description: string;
    price: number;
    image?: string;
    category?: string;
    is_available: boolean;
    images?: {
      id: number;
      image_url: string;
      is_primary: boolean;
    }[];
  };
  created_at: string;
}

/**
 * Request data for adding a favorite
 */
export interface AddFavoriteRequest {
  user_id: number;
  doll_id: number;
}

class FavoriteApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      toast.error('Authentication required', {
        description: 'You need to be logged in to manage favorites.',
      });
      throw new Error('Authentication required');
    }
    
    try {
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
        console.error('Favorites API Error:', response.status, errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Favorites request error:', error);
      throw error;
    }
  }

  /**
   * Get all favorites for the current user
   */
  async getUserFavorites(): Promise<FavoriteModel[]> {
    try {
      return await this.request<FavoriteModel[]>('/api/favorites/');
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      toast.error('Failed to load favorites', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      return [];
    }
  }

  /**
   * Add a model to favorites
   */
  async addToFavorites(dollId: number, userId: number): Promise<FavoriteModel | null> {
    try {
      const data: AddFavoriteRequest = {
        user_id: userId,
        doll_id: dollId
      };
      
      const result = await this.request<FavoriteModel>('/api/favorites/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      toast.success('Added to favorites');
      return result;
    } catch (error) {
      toast.error('Failed to add to favorites', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return null;
    }
  }

  /**
   * Remove a model from favorites
   */
  async removeFromFavorites(favoriteId: number): Promise<boolean> {
    try {
      // Use the new endpoint that deletes by unique favorite ID
      await this.request<void>(`/api/favorites/by-id/${favoriteId}`, {
        method: 'DELETE',
      });
      
      toast.success('Removed from favorites');
      return true;
    } catch (error) {
      toast.error('Failed to remove from favorites', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return false;
    }
  }

  /**
   * Check if a model is in the user's favorites
   */
  async checkIsFavorite(dollId: number): Promise<{is_favorite: boolean, favorite_id?: number}> {
    try {
      const response = await this.request<{message: string, user_id: number, is_favorite: boolean, favorite_id?: number}>(
        `/api/favorites/check/${dollId}`
      );
      
      return {
        is_favorite: response.is_favorite,
        favorite_id: response.favorite_id
      };
    } catch (error) {
      console.error('Failed to check favorite status:', error);
      return { is_favorite: false };
    }
  }
}

export const favoriteApiService = new FavoriteApiService();
