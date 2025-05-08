
import { toast } from "sonner";
import { BaseApiService } from "./base_api";
import { User } from "./admin_users_api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export interface Moderator extends User {
  assigned_dolls: number[];
}

export interface Model {
  id: number;
  name: string;
  image_url: string;
}

export interface CreateModeratorRequest {
  email: string;
  full_name: string;
  region: string;
  role: string;
  membership_level: string;
  is_active: boolean;
  video_access_count: number;
  assigned_dolls: number[];
  password: string;
}

class ModeratorApiService extends BaseApiService {
  // Get all moderators
  async getModerators(): Promise<Moderator[]> {
    try {
      const token = this.validateAuth();
      
      return await this.request<Moderator[]>('api/moderators/moderators?skip=0&limit=5', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      toast.error('Failed to fetch moderators', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return [];
    }
  }

  // Create a new moderator
  async createModerator(data: CreateModeratorRequest): Promise<void> {
    try {
      const token = this.validateAuth();
      
      await this.request('/api/admin/moderators', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      toast.success('Moderator created successfully');
    } catch (error) {
      toast.error('Failed to create moderator', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
    }
  }

  // Delete a moderator
  async deleteModerator(moderatorId: number): Promise<void> {
    try {
      const token = this.validateAuth();

      const response = await fetch(`${API_URL}/api/moderators/${moderatorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete moderator with ID ${moderatorId}`);
      }

      toast.success('Moderator deleted successfully');
    } catch (error) {
      toast.error('Failed to delete moderator', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
    }
  }

  // Get unassigned models/dolls
  async getUnassignedDolls(skip = 0, limit = 10): Promise<Model[]> {
    try {
      const token = this.validateAuth();
      
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
      const token = this.validateAuth();
      
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
      const token = this.validateAuth();
      
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
      const token = this.validateAuth();
      
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
