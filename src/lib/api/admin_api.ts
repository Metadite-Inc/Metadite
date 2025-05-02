
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

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

    async createAdmin(model: CreateModelRequest): Promise<ModelBasic | null> {
        try {
          // Get auth token from localStorage
          const token = localStorage.getItem('access_token');
          if (!token) {
            toast.error('Authentication required', {
              description: 'You must be logged in as an admin to create models.',
            });
            return null;
          }
          
          const response = await this.request<any>('/api/admin/admins/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(model)
          });
          
          toast.success('Admin created successfully');
          
          // Return the created model in the expected format
          return {
            //
          };
        } catch (error) {
          toast.error('Failed to create model');
          console.error(error);
          return null;
        }
    }

    async createModerator(model: CreateModelRequest): Promise<ModelBasic | null> {
        try {
          // Get auth token from localStorage
          const token = localStorage.getItem('access_token');
          if (!token) {
            toast.error('Authentication required', {
              description: 'You must be logged in as an admin to create models.',
            });
            return null;
          }
          
          const response = await this.request<any>('/api/admin/moderators/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(model)
          });
          
          toast.success('Moderator created successfully');
          
          // Return the created model in the expected format
          return {
            //
          };
        } catch (error) {
          toast.error('Failed to create model');
          console.error(error);
          return null;
        }
    }
}