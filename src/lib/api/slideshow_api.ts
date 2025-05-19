import { toast } from "sonner";
import { BaseApiService } from "./base_api";
import { User } from "./admin_users_api";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export interface SlideshowItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  caption: string;
  is_video: boolean;
  created_at?: string;
  updated_at?: string;
}

export const slideshowApi = {
  /**
   * Fetch slideshow items with pagination
   * @param skip Number of items to skip
   * @param limit Maximum number of items to return
   * @returns Promise<SlideshowItem[]>
   */
  async getSlideshows(skip: number = 0, limit: number = 50): Promise<SlideshowItem[]> {
    try {
      const res = await fetch(
        `${API_BASE}/api/slideshow/slideshows?skip=${skip}&limit=${limit}`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (!res.ok) {
        throw new Error(`Failed to fetch slideshows: ${res.statusText}`);
      }

      const data = await res.json();
      const backendUrl = API_BASE;

      return Array.isArray(data) 
        ? data.map(item => {
            const isVideo = item.is_video || (item.slideshow_video_url !== null);
            const mediaUrl = isVideo ? item.slideshow_video_url : item.slideshow_image_url;
            
            return {
              id: item.id,
              type: isVideo ? 'video' : 'image',
              url: /^https?:\/\//.test(mediaUrl) 
                ? mediaUrl 
                : `${backendUrl}${mediaUrl}`,
              caption: item.slideshow_caption || item.caption || '',
              is_video: isVideo,
              created_at: item.created_at,
              updated_at: item.updated_at
            };
          })
        : [];
    } catch (error) {
      toast.error('Failed to load slideshow items');
      console.error('Error fetching slideshows:', error);
      throw error;
    }
  },

  /**
   * Upload a new slideshow item (image or video)
   * @param param0 { file: File, caption: string, is_video: boolean, token: string }
   * @returns Promise<SlideshowItem>
   */
  async uploadSlideshow({ 
    file, 
    caption = '', 
    is_video = false, 
    token 
  }: { 
    file: File; 
    caption?: string; 
    is_video?: boolean;
  }): Promise<SlideshowItem> {
    try {
      const token = this.validateAuth();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);
      formData.append('is_video', String(is_video));

      const res = await fetch(`${API_BASE}/api/slideshow/upload/slideshow`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.detail || 'Failed to upload slideshow item'
        );
      }

      const data = await res.json();
      toast.success('Slideshow item uploaded successfully');
      return data;
    } catch (error) {
      toast.error('Failed to upload slideshow item');
      console.error('Error uploading slideshow:', error);
      throw error;
    }
  },

  /**
   * Delete a slideshow item by ID
   * @param id Slideshow item ID
   * @param token Authentication token
   * @returns Promise<boolean>
   */
  async deleteSlideshow(id: number): Promise<boolean> {
    try {
      const token = this.validateAuth();
      const res = await fetch(`${API_BASE}/api/slideshow/slideshows/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.detail || 'Failed to delete slideshow item'
        );
      }

      toast.success('Slideshow item deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete slideshow item');
      console.error('Error deleting slideshow:', error);
      throw error;
    }
  }
};
