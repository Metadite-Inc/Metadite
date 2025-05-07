
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface VideoUploadRequest {
  model_id: number;
  title: string;
  description: string;
  is_featured: boolean;
  file: File;
}

interface Video {
  id: number;
  model_id: number;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  is_featured: boolean;
  created_at: string;
}

class VideoApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
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

  async uploadVideo(data: VideoUploadRequest): Promise<boolean> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to upload videos.',
        });
        return false;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('model_id', data.model_id.toString());
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('is_featured', data.is_featured.toString());

      const response = await fetch(`${API_URL}/api/videos/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload video: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      toast.error('Failed to upload video', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return false;
    }
  }

  async getModelVideos(modelId: number): Promise<Video[]> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in to view model videos.',
        });
        return [];
      }

      return await this.request<Video[]>(`/api/videos/model/${modelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      toast.error('Failed to fetch model videos', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return [];
    }
  }

  async deleteVideo(videoId: number): Promise<boolean> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Authentication required', {
          description: 'You must be logged in as an admin to delete videos.',
        });
        return false;
      }

      const response = await fetch(`${API_URL}/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete video: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      toast.error('Failed to delete video', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(error);
      return false;
    }
  }
}

export const videoApiService = new VideoApiService();
