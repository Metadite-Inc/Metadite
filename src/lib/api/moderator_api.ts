
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Moderator {
  id: number;
  email: string;
  full_name: string;
  region: string;
  role: string;
  membership_level: string;
  is_active: boolean;
  video_access_count: number;
  assigned_dolls: number[];
}

interface Model {
  id: number;
  name: string;
  image_url: string;
}

class ModeratorApiService {
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

  // Method to get all models for assignment
  async getModelsForAssignment(): Promise<Model[]> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to view models.',
        });
        return [];
      }
      
      return await this.request<Model[]>('/api/admin/models', {
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

  // Method to assign models to moderator
  async assignModelsToModerator(moderatorId: number, modelIds: number[]): Promise<void> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to assign models.',
        });
        return;
      }
      
      await this.request(`/api/admin/moderators/${moderatorId}/assign-models`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ model_ids: modelIds }),
      });
      
      toast.success('Models assigned successfully');
    } catch (error) {
      toast.error('Failed to assign models', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
    }
  }
}

export const moderatorApiService = new ModeratorApiService();
