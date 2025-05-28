
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export class BaseApiService {
  protected async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

  protected getAuthHeaders(): { Authorization: string } | Record<string, never> {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  protected validateAuth(): string {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Authentication required');
    }
    return token;
  }

  // Server-side role validation using getCurrentUser()
  protected async validateRole(requiredRole: 'admin' | 'moderator'): Promise<void> {
    try {
      // Import authApi dynamically to avoid circular dependencies
      const { authApi } = await import('./auth_api');
      const currentUser = await authApi.getCurrentUser();
      
      if (currentUser.role !== requiredRole) {
        throw new Error(`Access denied. ${requiredRole} privileges required.`);
      }
    } catch (error) {
      console.error('Role validation failed:', error);
      throw new Error(`Access denied. Unable to verify ${requiredRole} privileges.`);
    }
  }
}
