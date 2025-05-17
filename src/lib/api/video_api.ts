
import { toast } from "sonner";
import { BaseApiService } from "./base_api";
import { apiService } from "../api";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export interface VideoUploadRequest {
  doll_id: number;
  title: string;
  description: string;
  is_featured: boolean;
  file: File;
  created_at: Date
}

export interface Video {
  id: number;
  model_id: number;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  is_featured: boolean;
  created_at: string;
  duration?: number;
  doll?: {
    id: number;
    name: string;
  };
}

class VideoApiService extends BaseApiService {
  async getAllVideos(): Promise<Video[]> {
    try {
      const token = this.validateAuth();
      return await this.request<Video[]>('/api/videos/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      toast.error('Failed to fetch videos', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error('Error fetching all videos:', error);
      return [];
    }
  }

  async getVideoById(videoId: number): Promise<Video | null> {
    try {
      const token = this.validateAuth();
      return await this.request<Video>(`/api/videos/${videoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      toast.error('Failed to fetch video', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(`Error fetching video with ID ${videoId}:`, error);
      return null;
    }
  }

  async uploadVideo(data: VideoUploadRequest): Promise<Video | null> {
    try {
      const token = this.validateAuth();

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('doll_id', data.doll_id.toString());
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('is_featured', data.is_featured.toString());
      formData.append('created_at', data.created_at);

      const response = await fetch(`${API_URL}/api/videos/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `Failed to upload video: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Parse and return the video data including the ID
      const videoData = await response.json();
      return videoData;
    } catch (error) {
      toast.error('Failed to upload video', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error('Error uploading video:', error);
      throw error;//return null;
    }
  }

  async getModelVideos(modelId: number): Promise<Video[]> {
    try {
      const token = this.validateAuth();
      return await this.request<Video[]>(`/api/videos/doll/${modelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      toast.error('Failed to fetch model videos', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(`Error fetching videos for model ${modelId}:`, error);
      return [];
    }
  }

  async updateVideo(videoId: number, data: { title?: string; description?: string; is_featured?: boolean }): Promise<boolean> {
    try {
      const token = this.validateAuth();
      
      const response = await fetch(`${API_URL}/api/videos/${videoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update video: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      toast.error('Failed to update video', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(`Error updating video ${videoId}:`, error);
      return false;
    }
  }

  async uploadThumbnail(videoId: number, file: File): Promise<boolean> {
    try {
      const token = this.validateAuth();
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/api/images/videos/${videoId}/thumbnail`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload thumbnail: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      toast.error('Failed to upload thumbnail', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error(`Error uploading thumbnail for video ${videoId}:`, error);
      return false;
    }
  }

  async deleteVideo(videoId: number): Promise<boolean> {
    try {
      const token = this.validateAuth();

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
      console.error(`Error deleting video ${videoId}:`, error);
      return false;
    }
  }

  async getFeaturedVideos(): Promise<Video[]> {
    try {
      const token = this.validateAuth();
      return await this.request<Video[]>('/api/videos/featured', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      toast.error('Failed to fetch featured videos', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
      console.error('Error fetching featured videos:', error);
      return [];
    }
  }
}

export const videoApiService = new VideoApiService();