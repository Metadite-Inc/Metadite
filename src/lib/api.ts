import { toast } from "sonner";

// Interfaces based on your existing model data structure
export interface ModelBasic {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export interface ModelDetail extends ModelBasic {
  longDescription: string;
  gallery: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  specifications: { name: string; value: string }[];
  detailedDescription: string;
  shippingInfo: {
    dimensions: string;
    weight: string;
    handlingTime: string;
    shippingOptions: { method: string; time: string; price: string }[];
    specialNotes: string;
  };
  customerReviews: { rating: number; date: string; comment: string }[];
}

// Base API configuration
const API_URL = "http://127.0.0.1:8000/api";

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      toast.error("Failed to load data", {
        description: "Please try again later",
      });
      throw error;
    }
  }

  // Get all models (dolls)
  async getModels(): Promise<ModelBasic[]> {
    try {
      const dolls = await this.request<any[]>("/dolls");
      // Transform the API response to match our ModelBasic interface
      return dolls.map(doll => ({
        id: doll.id,
        name: doll.name,
        price: doll.price,
        description: doll.description.substring(0, 100) + "...", // Truncate for preview
        image: doll.image,
        category: doll.doll_category,
      }));
    } catch (error) {
      return [];
    }
  }

  // Get a single model details
  async getModelDetails(id: number): Promise<ModelDetail | null> {
    try {
      const doll = await this.request<any>(`/dolls/${id}`);
      const reviews = await this.request<any[]>(`/reviews/doll/${id}`); // Fetch all reviews for the doll

      // Transform the API response to match our ModelDetail interface
      return {
        id: doll.id,
        name: doll.name,
        price: doll.price,
        description: doll.description.substring(0, 150) + "...",
        longDescription: doll.description,
        image: doll.image,
        gallery: [doll.image, doll.image, doll.image],
        rating: doll.rating || 4.5,
        reviews: reviews.length, // Total number of reviews
        inStock: doll.inStock || true,
        category: doll.doll_category,
        specifications: [
          { name: 'Height', value: `${doll.doll_height} inches` },
          { name: "Material", value: doll.doll_material },
          { name: 'Age Range', value: 'Adult Collectors' },
          { name: 'Origin', value: doll.doll_origin },
          { 
            name: 'Release Date', 
            value: new Date(doll.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
          },
          { name: "Category", value: doll.doll_category },
          { name: 'Articulation', value: `${doll.doll_articulation || 'Fixed pose'}` },
          { name: 'Hair Type', value: doll.doll_hair_type }
        ],
        detailedDescription: doll.description,
        shippingInfo: {
          dimensions: "20\" x 12\" x 8\"",
          weight: "3.5 lbs",
          handlingTime: "3-5 business days",
          shippingOptions: [
            { method: "Standard", time: "7-10 business days", price: "Free" },
            { method: "Express", time: "2-3 business days", price: "Free" },
            { method: "International", time: "10-14 business days", price: "Free" },
          ],
          specialNotes: "Packaged with care for safe delivery."
        },
        customerReviews: reviews.map(review => ({
          rating: review.rating,
          date: new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          comment: review.comment
        }))
      };
    } catch (error) {
      console.error(`Failed to fetch model details for ID ${id}:`, error);
      return null;
    }
  }

  // Get related models based on category
  async getRelatedModels(currentModelId: number, category: string): Promise<ModelBasic[]> {
    try {
      const dolls = await this.request<any[]>(`/dolls/category/${category}`);
      return dolls
        .filter(doll => doll.id !== currentModelId)
        .slice(0, 3)
        .map(doll => ({
          id: doll.id,
          name: doll.name,
          price: doll.price,
          description: doll.description.substring(0, 100) + "...",
          image: doll.image,
          category: doll.doll_category,
        }));
    } catch (error) {
      return [];
    }
  }
}

export const apiService = new ApiService();
