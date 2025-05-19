import { toast } from "sonner";

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

function getMediaInfo(item: any, backendUrl: string): SlideshowItem {
  const isVideo = item.is_video || (item.slideshow_video_url !== null);
  const mediaUrl = isVideo ? item.slideshow_video_url : item.slideshow_image_url;
  return {
    id: item.id,
    type: isVideo ? 'video' : 'image',
    url: /^https?:\/\//.test(mediaUrl) ? mediaUrl : `${backendUrl}${mediaUrl}`,
    caption: item.slideshow_caption || item.caption || '',
    is_video: !!isVideo,
    created_at: item.created_at,
    updated_at: item.updated_at
  };
}

function validateAuth() {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('Not authenticated');
  return token;
}

export const slideshowApi = {
  /**
   * Fetch slideshow items with pagination
   */
  async getSlideshows(skip: number = 0, limit: number = 50): Promise<SlideshowItem[]> {
    try {
      const res = await fetch(
        `${API_BASE}/api/slideshow/slideshows?skip=${skip}&limit=${limit}`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );
      if (!res.ok) throw new Error(`Failed to fetch slideshows: ${res.statusText}`);
      const data = await res.json();
      const backendUrl = API_BASE;
      return Array.isArray(data) ? data.map(item => getMediaInfo(item, backendUrl)) : [];
    } catch (error) {
      toast.error('Failed to load slideshow items');
      console.error('Error fetching slideshows:', error);
      throw error;
    }
  },

  /**
   * Upload a new slideshow item (image or video)
   */
  async uploadSlideshow({ file, caption = '', is_video = false }: { file: File; caption?: string; is_video?: boolean; }): Promise<SlideshowItem> {
    try {
      const token = validateAuth();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);
      formData.append('is_video', String(is_video));
      const res = await fetch(`${API_BASE}/api/slideshow/upload`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || 'Failed to upload slideshow item');
      }
      const data = await res.json();
      toast.success('Slideshow item uploaded successfully');
      return getMediaInfo(data, API_BASE);
    } catch (error) {
      toast.error('Failed to upload slideshow item');
      console.error('Error uploading slideshow:', error);
      throw error;
    }
  },

  /**
   * Delete a slideshow item by ID
   */
  async deleteSlideshow(id: number): Promise<boolean> {
    try {
      const token = validateAuth();
      const res = await fetch(`${API_BASE}/api/slideshow/slideshows/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.detail || 'Failed to delete slideshow item');
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
