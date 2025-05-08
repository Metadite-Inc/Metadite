
import { adminUsersApiService, Admin, CreateAdminRequest } from './admin_users_api';
import { moderatorApiService, Moderator, CreateModeratorRequest } from './moderator_api';

class AdminApiService {
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
}

export const adminApiService = new AdminApiService();
export type { Admin, CreateAdminRequest } from './admin_users_api';
export type { Moderator, CreateModeratorRequest, Model } from './moderator_api';
