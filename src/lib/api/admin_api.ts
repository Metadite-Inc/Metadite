import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface User {
  id: number;
  email: string;
  full_name: string;
  region: string;
  role: string;
  membership_level: string;
  is_active: boolean;
  video_access_count: number;
}

interface Admin extends User {}

interface Moderator extends User {
  assigned_dolls: number[];
}

interface CreateAdminRequest {
  email: string;
  full_name: string;
  region: string;
  role: string;
  membership_level: string;
  is_active: boolean;
  video_access_count: number;
  password: string;
}

interface CreateModeratorRequest {
  email: string;
  full_name: string;
  region: string;
  role: string;
  membership_level: string;
  is_active: boolean;
  video_access_count: 0;
  assigned_dolls: number[];
  password: string;
}

class AdminApiService {
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

  // New method to get all admins
  async getAdmins(): Promise<Admin[]> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to view admins.',
        });
        return [];
      }
      
      return await this.request<Admin[]>('/api/admin/admins', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      toast.error('Failed to fetch admins', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return [];
    }
  }

  // New method to get all moderators
  async getModerators(): Promise<Moderator[]> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to view moderators.',
        });
        return [];
      }
      
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

  async createAdmin(data: CreateAdminRequest): Promise<void> {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          toast.error('Authentication required', {
            description: 'You must be logged in as an admin to create admins.',
          });
          return;
        }
        
        await this.request('/api/admin/admins', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        
        toast.success('Admin created successfully');
      } catch (error) {
        toast.error('Failed to create admin', {
          description: error instanceof Error ? error.message : 'Unknown error occurred',
        });
        console.error(error);
      }
  }

  async createModerator(data: CreateModeratorRequest): Promise<void> {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          toast.error('Authentication required', {
            description: 'You must be logged in as an admin to create moderators.',
          });
          return;
        }
        
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

  async deleteModerator(moderatorId: number): Promise<void> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to delete moderators.',
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/moderators/${moderatorId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete model with ID ${moderatorId}`);
      }

      toast.success('Moderator deleted successfully');
    } catch (error) {
      toast.error('Failed to delete moderator', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
    }
  }

  async deleteAdmin(adminId: number): Promise<void> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to delete admins.',
        });
        return;
      }

      const response = await fetch(`${API_URL}/api/admin/admins/${adminId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete model with ID ${adminId}`);
      }

      toast.success('admin deleted successfully');
    } catch (error) {
      toast.error('Failed to delete admin', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
    }
  }
}

export const adminApiService = new AdminApiService();
