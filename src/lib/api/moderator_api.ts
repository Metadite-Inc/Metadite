
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

  // Get unassigned models/dolls
  async getUnassignedDolls(skip = 0, limit = 10): Promise<Model[]> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required');
        return [];
      }
      
      return await this.request<Model[]>(`/api/dolls/assigned/false?skip=${skip}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Failed to fetch unassigned dolls:', error);
      return [];
    }
  }

  // Get models for assignment (this might be the same as unassigned dolls or could be all dolls)
  async getModelsForAssignment(): Promise<Model[]> {
    // For now, use the unassigned dolls endpoint
    return this.getUnassignedDolls(0, 100);
  }

  // Assign a doll to moderator
  async assignDollToModerator(moderatorId: number, dollId: number): Promise<void> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      await this.request(`/api/moderators/${moderatorId}/dolls/${dollId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success('Doll assigned to moderator successfully');
    } catch (error) {
      toast.error('Failed to assign doll to moderator', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get dolls assigned to a moderator
  async getDollsAssignedToModerator(moderatorId: number): Promise<Model[]> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required');
        return [];
      }
      
      return await this.request<Model[]>(`/api/moderators/${moderatorId}/dolls`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Failed to fetch assigned dolls:', error);
      return [];
    }
  }

  // Update moderator profile
  async updateModeratorProfile(moderatorId: number, data: {
    email: string;
    full_name: string;
    region: string;
    is_active: boolean;
    password?: string;
  }): Promise<void> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      await this.request(`/api/moderators/moderators/${moderatorId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      toast.success('Moderator profile updated successfully');
    } catch (error) {
      toast.error('Failed to update moderator profile', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const moderatorApiService = new ModeratorApiService();
