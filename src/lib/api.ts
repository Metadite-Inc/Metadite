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

export interface CreateModelRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  is_available: boolean;
  doll_category: string;
  doll_height: number;
  doll_material: string;
  doll_vaginal_depth: number;
  doll_anal_depth: number;
  doll_oral_depth: number;
  doll_weight: number;
  doll_gross_weight: number;
  doll_packing_size: string;
  doll_body_size: string;
  created_at: Date; // Fixed: date to Date
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

// Pagination response interface
export interface PaginationResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

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

  // Get all models (dolls) with pagination - removed category parameter
  async getModels(skip = 0, limit = 50): Promise<PaginationResponse<ModelBasic>> {
    try {
      // Build query parameters without category
      let queryParams = `skip=${skip}&limit=${limit}`;
      
      // Add pagination parameters to the API request
      const dolls = await this.request<any[]>(`/api/dolls?${queryParams}`);
      const backendUrl = import.meta.env.VITE_API_BASE_URL;

      // Transform the API response to match our ModelBasic interface
      const transformedData = dolls.map(doll => {
        let mainImage = '';
        if (Array.isArray(doll.images)) {
          const primary = doll.images.find((img: any) => img.is_primary);
          mainImage = primary ? `${backendUrl}${primary.image_url}` : '';
        }
        return {
          id: doll.id,
          name: doll.name,
          price: doll.price,
          description: doll.description.substring(0, 100) + "...", // Truncate for preview
          image: mainImage,
          category: doll.doll_category,
        };
      });

      // For now, estimate the total from what we have
      // In a real API, this would come from the backend
      const total = Math.max(skip + dolls.length + (dolls.length === limit ? 22 : 0), dolls.length);

      return {
        data: transformedData,
        total: total,
        skip: skip,
        limit: limit
      };
    } catch (error) {
      return {
        data: [],
        total: 0,
        skip: skip,
        limit: limit
      };
    }
  }

  // Get models filtered by category with pagination
  async getModelsByCategory(category: string, skip = 0, limit = 50): Promise<PaginationResponse<ModelBasic>> {
    try {
      const dolls = await this.request<any[]>(`/api/dolls/category/${category}`);
      const backendUrl = import.meta.env.VITE_API_BASE_URL;

      // Transform the API response to match our ModelBasic interface
      const transformedData = dolls.map(doll => {
        let mainImage = '';
        if (Array.isArray(doll.images)) {
          const primary = doll.images.find((img: any) => img.is_primary);
          mainImage = primary ? `${backendUrl}${primary.image_url}` : '';
        }
        return {
          id: doll.id,
          name: doll.name,
          price: doll.price,
          description: doll.description.substring(0, 100) + "...",
          image: mainImage,
          category: doll.doll_category,
        };
      });

      // Apply pagination to the filtered results
      const paginatedData = transformedData.slice(skip, skip + limit);

      return {
        data: paginatedData,
        total: transformedData.length,
        skip: skip,
        limit: limit
      };
    } catch (error) {
      return {
        data: [],
        total: 0,
        skip: skip,
        limit: limit
      };
    }
  }

  // create a new model
  async createModel(model: CreateModelRequest): Promise<ModelBasic | null> {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to create models.',
        });
        return null;
      }
      
      const response = await this.request<any>('/api/dolls/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(model)
      });
      
      toast.success('Model created successfully');
      
      // Return the created model in the expected format
      return {
        id: response.id,
        name: response.name,
        price: response.price,
        description: response.description.substring(0, 100) + "...",
        image: '', // New models won't have images yet
        category: response.doll_category
      };
    } catch (error) {
      toast.error('Failed to create model');
      console.error(error);
      return null;
    }
  }

  // Upload an image for a model
  async uploadModelImage(dollId: number, imageFile: File, caption: string = '', isPrimary: boolean = true): Promise<boolean> {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to upload images.',
        });
        return false;
      }

      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('doll_id', dollId.toString());
      formData.append('caption', caption);
      formData.append('is_primary', isPrimary.toString());

      const response = await fetch(`${API_URL}/api/images/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.status}`);
      }

      toast.success('Image uploaded successfully');
      return true;
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
      return false;
    }
  }

  // Upload multiple images for a model
  async uploadModelImages(dollId: number, imageFiles: File[]): Promise<boolean> {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to upload images.',
        });
        return false;
      }

      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('files', file);
      });
      
      // These images are additional images, not primary ones
      formData.append('is_primary', 'false');

      const response = await fetch(`${API_URL}/api/images/${dollId}/images/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to upload images: ${response.status}`);
      }

      toast.success('Additional images uploaded successfully');
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Failed to upload additional images', {
          description: error.message
        });
      } else {
        toast.error('Failed to upload additional images');
      }
      console.error(error);
      return false;
    }
  }

  // Get a single model details
  async getModelDetails(id: number): Promise<ModelDetail | null> {
    try {
      const doll = await this.request<any>(`/api/dolls/${id}`);
      const reviews = await this.request<any[]>(`/api/reviews/doll/${id}`);
      const images = await this.request<any[]>(`/api/images/${id}/images`);

      // Determine backend URL
      const backendUrl = import.meta.env.VITE_API_BASE_URL;

      // Find primary image and gallery
      let mainImage = '';
      let gallery: string[] = [];

      if (Array.isArray(images)) {
        const primary = images.find(img => img.is_primary);
        mainImage = primary ? `${backendUrl}${primary.image_url}` : '';
        gallery = images.filter(img => !img.is_primary).map(img => `${backendUrl}${img.image_url}`);
      }

      // Transform the API response to match our ModelDetail interface
      return {
        id: doll.id,
        name: doll.name,
        price: doll.price,
        description: doll.description.substring(0, 150) + "...",
        longDescription: doll.description,
        image: mainImage,
        gallery: gallery,
        rating: doll.rating || 4.5,
        reviews: reviews.length, // Total number of reviews
        inStock: doll.is_available,
        category: doll.doll_category,
        specifications: [
          { name: 'Height', value: `${doll.doll_height} CM` },
          { name: "Material", value: doll.doll_material },
          { name: 'Age Range', value: 'Adult Collectors' },
          //{ name: 'Origin', value: doll.doll_origin },
          { 
            name: 'Release Date', 
            value: new Date(doll.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) 
          },
          { name: "Category", value: doll.doll_category },
          //{ name: 'Articulation', value: `${doll.doll_articulation || 'Fixed pose'}` },
          //{ name: 'Hair Type', value: doll.doll_hair_type }
          { name: 'Vaginal Depth', value: `${doll.doll_vaginal_depth} CM` },
          { name: 'Anal Depth', value: `${doll.doll_anal_depth} CM` },
          { name: 'Oral Depth', value: `${doll.doll_oral_depth} CM` },
          { name: 'Weight', value: `${doll.doll_weight} KG` },
          { name: 'Gross Weight', value: `${doll.doll_gross_weight} KG` },
          { name: 'Packing Size', value: `${doll.doll_packing_size} CM` },
          { name: 'Body Size', value: `${doll.doll_body_size} CM` }
        ],
        detailedDescription: doll.description,
        shippingInfo: {
          dimensions: doll.doll_packing_size,
          weight: `${doll.doll_gross_weight} KG`,
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
      const dolls = await this.request<any[]>(`/api/dolls/category/${category}`);

      const backendUrl = import.meta.env.VITE_API_BASE_URL;
      return dolls
        .filter(doll => doll.id !== currentModelId)
        .slice(0, 3)
        .map(doll => {
          let mainImage = '';
          if (Array.isArray(doll.images)) {
            const primary = doll.images.find((img: any) => img.is_primary);
            mainImage = primary ? `${backendUrl}${primary.image_url}` : '';
          }
          return {
            id: doll.id,
            name: doll.name,
            price: doll.price,
            description: doll.description.substring(0, 100) + "...",
            image: mainImage,
            category: doll.doll_category,
          };
        });
    } catch (error) {
      return [];
    }
  }

  // get moderator assigned to doll
  async getAssignedModerator(modelId: number): Promise<any | any[]> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to view assigned moderators.',
        });
        return null;
      }

      return await this.request<any>(`/api/dolls/moderator/${modelId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    catch (error) {
      toast.error('Failed to fetch assigned moderators', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return null;
    }
  }

  // delete a model by id
  async deleteModel(id: number): Promise<void> {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to delete models.',
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/dolls/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete model with ID ${id}`);
      }

      toast.success("Model deleted successfully");
    } catch (error) {
      toast.error("Failed to delete model");
      console.error(error);
    }
  }
}

export const apiService = new ApiService();
