
import { toast } from "sonner";
import { BaseApiService } from "./base_api";

export interface User {
  id: number;
  email: string;
  full_name: string;
  region: string;
  role: string;
  membership_level: string;
  is_active: boolean;
  video_access_count: number;
}

export interface Admin extends User {}

export interface CreateAdminRequest {
  email: string;
  full_name: string;
  region: string;
  role: string;
  membership_level: string;
  is_active: boolean;
  video_access_count: number;
  password: string;
}

class AdminUsersApiService extends BaseApiService {
  // Get all admins
  async getAdmins(): Promise<Admin[]> {
    try {
      // Validate admin role server-side before making request
      await this.validateRole('admin');
      const token = this.validateAuth();
      
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

  // Create a new admin
  async createAdmin(data: CreateAdminRequest): Promise<void> {
    try {
      // Validate admin role server-side before making request
      await this.validateRole('admin');
      const token = this.validateAuth();
      
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

  // Delete an admin
  async deleteAdmin(adminId: number): Promise<void> {
    try {
      // Validate admin role server-side before making request
      await this.validateRole('admin');
      const token = this.validateAuth();

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/admins/${adminId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete admin with ID ${adminId}`);
      }

      toast.success('Admin deleted successfully');
    } catch (error) {
      toast.error('Failed to delete admin', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
    }
  }
}

export const adminUsersApiService = new AdminUsersApiService();
