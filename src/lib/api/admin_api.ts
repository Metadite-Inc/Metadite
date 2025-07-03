import { adminUsersApiService, Admin, CreateAdminRequest } from './admin_users_api';
import { moderatorApiService, Moderator, CreateModeratorRequest } from './moderator_api';
import { BaseApiService } from './base_api';

class AdminApiService extends BaseApiService {
  // Admin users methods
  getAdmins(): Promise<Admin[]> {
    return adminUsersApiService.getAdmins();
  }

  createAdmin(data: CreateAdminRequest): Promise<void> {
    return adminUsersApiService.createAdmin(data);
  }

  deleteAdmin(adminId: number): Promise<void> {
    return adminUsersApiService.deleteAdmin(adminId);
  }

  // Moderator methods
  getModerators(): Promise<Moderator[]> {
    return moderatorApiService.getModerators();
  }

  createModerator(data: CreateModeratorRequest): Promise<void> {
    return moderatorApiService.createModerator(data);
  }

  deleteModerator(moderatorId: number): Promise<void> {
    return moderatorApiService.deleteModerator(moderatorId);
  }

  // Dashboard recent activity
  async getRecentActivity(skip: number = 0, limit: number = 10): Promise<any> {
    try {
      const token = this.validateAuth();
      
      return await this.request<any>(`/api/admin/recent-activity?skip=${skip}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return { activities: [], total: 0 };
    }
  }

  // Dashboard stats
  async getDashboardStats(): Promise<any> {
    try {
      const token = this.validateAuth();
      
      return await this.request<any>('/api/admin/dashboard-stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    }
  }

  // Get subscription payments with pagination
  async getSubscriptionPayments(skip: number = 0, limit: number = 10): Promise<any> {
    try {
      const token = this.validateAuth();
      
      return await this.request<any>(`/api/admin/subscription-payments?skip=${skip}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error fetching subscription payments:', error);
      return { payments: [], total: 0 };
    }
  }

  // Get all payments with pagination
  async getAllPayments(skip: number = 0, limit: number = 10): Promise<any> {
    try {
      const token = this.validateAuth();
      
      return await this.request<any>(`/api/admin/payments?skip=${skip}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      return { payments: [], total: 0 };
    }
  }

  // Get flagged messages
  async getFlaggedMessages(): Promise<any[]> {
    try {
      const token = this.validateAuth();
      
      return await this.request<any[]>('/api/admin/flagged-messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error fetching flagged messages:', error);
      return [];
    }
  }

  // Approve flagged message
  async approveFlaggedMessage(messageId: number): Promise<void> {
    try {
      const token = this.validateAuth();
      
      await this.request(`/api/admin/flagged-messages/${messageId}/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error approving flagged message:', error);
      throw error;
    }
  }

  // Delete flagged message
  async deleteFlaggedMessage(messageId: number): Promise<void> {
    try {
      const token = this.validateAuth();
      
      await this.request(`/api/admin/flagged-messages/${messageId}/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting flagged message:', error);
      throw error;
    }
  }

  // Notify moderator about flagged message
  async notifyModerator(messageId: number): Promise<void> {
    try {
      const token = this.validateAuth();
      
      await this.request(`/api/admin/flagged-messages/${messageId}/notify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error notifying moderator:', error);
      throw error;
    }
  }

  // Get flagged messages count
  async getFlaggedMessagesCount(): Promise<number> {
    try {
      const token = this.validateAuth();
      
      const response = await this.request<{ count: number }>('/api/admin/flagged-messages/count', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.count || 0;
    } catch (error) {
      console.error('Error fetching flagged messages count:', error);
      return 0;
    }
  }
}

export const adminApiService = new AdminApiService();
export type { Admin, CreateAdminRequest } from './admin_users_api';
export type { Moderator, CreateModeratorRequest, Model } from './moderator_api';
