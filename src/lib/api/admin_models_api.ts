import { toast } from "sonner";
import { BaseApiService } from "./base_api";

export interface Doll {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

class AdminModelsApiService extends BaseApiService {
  // Get all active dolls with pagination
  async getActiveDolls(skip = 0, limit = 100): Promise<Doll[]> {
    try {
      // Validate admin role server-side before making request
      await this.validateRole('admin');
      this.validateAuth();
      
      // Return empty array since the endpoint doesn't exist
      console.warn('Active dolls endpoint not available, returning empty array');
      return [];
    } catch (error) {
      console.warn('Error in getActiveDolls:', error);
      return [];
    }
  }
  
  // Get count of active dolls
  async getActiveDollsCount(): Promise<number> {
    try {
      // Since the endpoint doesn't exist, return 0 as a fallback
      // In a real app, you would implement proper error handling or use a different endpoint
      console.warn('Active dolls count not available, returning 0');
      return 0;
    } catch (error) {
      console.warn('Error in getActiveDollsCount:', error);
      return 0;
    }
  }
}

export const adminModelsApiService = new AdminModelsApiService();
