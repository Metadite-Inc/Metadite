
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Model {
  id: number;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
  doll_category: string;
  doll_height: number;
  doll_vaginal_depth: number;
  doll_material: string;
  doll_anal_depth: number;
  doll_oral_depth: number;
  doll_weight: number;
  doll_gross_weight: number;
  doll_packing_size: string;
  doll_body_size: string;
  created_at: string;
}

interface ModelCreateRequest {
  name: string;
  description: string;
  price: number | string;
  is_available: boolean;
  doll_category: string;
  doll_height: number | string;
  doll_vaginal_depth: number | string;
  doll_material: string;
  doll_anal_depth: number | string;
  doll_oral_depth: number | string;
  doll_weight: number | string;
  doll_gross_weight: number | string;
  doll_packing_size: string;
  doll_body_size: string;
  created_at?: string;
}

class ModelApiService {
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
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.detail || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }

  async getModels(): Promise<Model[]> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in to view models.',
        });
        return [];
      }

      return await this.request<Model[]>('/api/models', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      toast.error('Failed to fetch models', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return [];
    }
  }

  async createModel(data: ModelCreateRequest): Promise<Model | null> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to create models.',
        });
        return null;
      }

      return await this.request<Model>('/api/models', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      toast.error('Failed to create model', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return null;
    }
  }

  async uploadModelImage(modelId: number, file: File, caption = '', isPrimary = false): Promise<boolean> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to upload images.',
        });
        return false;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);
      formData.append('is_primary', isPrimary.toString());

      const response = await fetch(`${API_URL}/api/models/${modelId}/images`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      toast.error('Failed to upload image', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return false;
    }
  }

  async uploadModelImages(modelId: number, files: File[]): Promise<boolean> {
    try {
      let allSuccessful = true;
      
      for (const file of files) {
        const success = await this.uploadModelImage(modelId, file, '', false);
        if (!success) {
          allSuccessful = false;
        }
      }
      
      return allSuccessful;
    } catch (error) {
      toast.error('Failed to upload images', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return false;
    }
  }

  async deleteModel(modelId: number): Promise<void> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to delete models.',
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/models/${modelId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete model with ID ${modelId}`);
      }
    } catch (error) {
      toast.error('Failed to delete model', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
    }
  }
}

export const modelApiService = new ModelApiService();
