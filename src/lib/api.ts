
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
const API_URL = "https://fakestoreapi.com"; // Example API URL

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
      console.error("API request failed:", error);
      toast.error("Failed to load data", {
        description: "Please try again later",
      });
      throw error;
    }
  }

  // Get all models (products)
  async getModels(): Promise<ModelBasic[]> {
    try {
      const products = await this.request<any[]>("/products");
      // Transform the API response to match our ModelBasic interface
      return products.map(product => ({
        id: product.id,
        name: product.title,
        price: product.price,
        description: product.description.substring(0, 100) + "...", // Truncate for preview
        image: product.image,
        category: product.category
      }));
    } catch (error) {
      console.error("Failed to fetch models:", error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  // Get a single model details
  async getModelDetails(id: number): Promise<ModelDetail | null> {
    try {
      const product = await this.request<any>(`/products/${id}`);
      
      // Transform the API response to match our ModelDetail interface
      return {
        id: product.id,
        name: product.title,
        price: product.price,
        description: product.description.substring(0, 100) + "...",
        longDescription: product.description,
        image: product.image,
        gallery: [product.image, product.image, product.image], // API doesn't provide multiple images
        rating: product.rating?.rate || 4.5,
        reviews: product.rating?.count || 10,
        inStock: true,
        category: product.category,
        specifications: [
          { name: "Category", value: product.category },
          { name: "Rating", value: `${product.rating?.rate || 4.5}/5` },
          { name: "Material", value: "Premium Quality" },
        ],
        detailedDescription: product.description,
        shippingInfo: {
          dimensions: "20\" x 12\" x 8\"",
          weight: "3.5 lbs",
          handlingTime: "3-5 business days",
          shippingOptions: [
            { method: "Standard", time: "7-10 business days", price: "Free" },
            { method: "Express", time: "2-3 business days", price: "$9.99" },
            { method: "International", time: "10-14 business days", price: "$14.99" },
          ],
          specialNotes: "Packaged with care for safe delivery."
        },
        customerReviews: [
          { 
            rating: 5, 
            date: "2023-05-15", 
            comment: "Excellent product, very satisfied with the quality." 
          },
          { 
            rating: 4, 
            date: "2023-04-22", 
            comment: "Good value for money, would recommend." 
          }
        ]
      };
    } catch (error) {
      console.error(`Failed to fetch model ${id}:`, error);
      return null;
    }
  }

  // Get related models based on category
  async getRelatedModels(currentModelId: number, category: string): Promise<ModelBasic[]> {
    try {
      const products = await this.request<any[]>(`/products/category/${category}`);
      return products
        .filter(product => product.id !== currentModelId)
        .slice(0, 3)
        .map(product => ({
          id: product.id,
          name: product.title,
          price: product.price,
          description: product.description.substring(0, 100) + "...",
          image: product.image,
          category: product.category
        }));
    } catch (error) {
      console.error("Failed to fetch related models:", error);
      return [];
    }
  }
}

export const apiService = new ApiService();
