import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please set the VITE_API_BASE_URL environment variable.");
}

interface ImageInDB {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  is_featured: boolean;
  is_vip: boolean;
  doll_id: number | null;
  created_at: string;
  updated_at: string;
}

interface ImageCreate {
  title: string;
  description?: string;
  file: File;
  doll_id?: number;
  is_featured?: boolean;
  is_vip?: boolean;
  created_at?: string;
}

interface ImageUpdate {
  title?: string;
  description?: string;
  is_featured?: boolean;
  is_vip?: boolean;
  doll_id?: number;
}

// Create axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error status is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
        const { access_token, refresh_token } = response.data;
        
        // Update tokens in local storage
        localStorage.setItem('access_token', access_token);
        if (refresh_token) {
          localStorage.setItem('refresh_token', refresh_token);
        }
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Image API service
const imageApiService = {
  // Upload a new image
  async uploadImage(
    formData: FormData, 
    onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void
  ): Promise<ImageInDB> {
    try {
      const response = await api.post('/admin/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Get all images with pagination and filtering
  async getImages({
    is_vip = true,
    page = 1,
    page_size = 10,
    model_id,
    search,
  }: {
    is_vip?: boolean;
    page?: number;
    page_size?: number;
    model_id?: number;
    search?: string;
  } = {}): Promise<{ items: ImageInDB[]; total: number }> {
    try {
      const params = {
        is_vip,
        page,
        page_size,
        ...(model_id && { model_id }),
        ...(search && { search }),
      };

      const response = await api.get('/admin/images', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting images:', error);
      throw error;
    }
  },

  // Delete an image
  async deleteImage(id: number): Promise<void> {
    try {
      await api.delete(`/admin/images/${id}`);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Toggle featured status
  async toggleFeatured(id: number, isFeatured: boolean): Promise<ImageInDB> {
    try {
      const response = await api.patch(`/admin/images/${id}/featured`, {
        is_featured: isFeatured,
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  },

  // Get image by ID
  async getImageById(id: number): Promise<ImageInDB> {
    try {
      const response = await api.get(`/admin/images/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting image by ID:', error);
      throw error;
    }
  },
};

export { imageApiService };
export type { ImageInDB, ImageCreate, ImageUpdate };
