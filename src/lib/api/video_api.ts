
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined. Please set the VITE_API_BASE_URL environment variable.");
}

interface VideoInDB {
    id: number;
    title: string;
    description: string;
    url: string;
    thumbnail_url: string;
    category: string;
    tags: string[];
    created_at: string;
    updated_at: string;
    views: number;
    likes: number;
    doll_id?: number;
    release_date?: string;
}

interface VideoCreate {
    title: string;
    description: string;
    url: string;
    thumbnail_url: string;
    category: string;
    tags: string[];
    doll_id?: number;
    release_date?: Date;
}

interface VideoUpdate {
    title?: string;
    description?: string;
    url?: string;
    thumbnail_url?: string;
    category?: string;
    tags?: string[];
    doll_id?: number;
    release_date?: Date;
}

// Create axios instance with base config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const videoApi = {
    // Get all videos
    async getVideos(skip: number = 0, limit: number = 10): Promise<VideoInDB[]> {
        const response = await api.get<VideoInDB[]>(`/api/videos/?skip=${skip}&limit=${limit}`);
        return response.data;
    },

    // Get video by ID
    async getVideo(id: number): Promise<VideoInDB> {
        const response = await api.get<VideoInDB>(`/api/videos/${id}`);
        return response.data;
    },

    // Create new video
    async createVideo(data: VideoCreate): Promise<VideoInDB> {
        const response = await api.post<VideoInDB>('/api/videos/', data);
        return response.data;
    },

    // Update video
    async updateVideo(id: number, data: VideoUpdate): Promise<VideoInDB> {
        const response = await api.put<VideoInDB>(`/api/videos/${id}`, data);
        return response.data;
    },

    // Delete video
    async deleteVideo(id: number): Promise<void> {
        await api.delete(`/api/videos/${id}`);
    },

    // Get videos by category
    async getVideosByCategory(category: string, skip: number = 0, limit: number = 10): Promise<VideoInDB[]> {
        const response = await api.get<VideoInDB[]>(`/api/videos/category/${category}?skip=${skip}&limit=${limit}`);
        return response.data;
    },

    // Get videos by tag
    async getVideosByTag(tag: string, skip: number = 0, limit: number = 10): Promise<VideoInDB[]> {
        const response = await api.get<VideoInDB[]>(`/api/videos/tag/${tag}?skip=${skip}&limit=${limit}`);
        return response.data;
    },

    // Get videos by doll ID
    async getVideosByDollId(dollId: number, skip: number = 0, limit: number = 10): Promise<VideoInDB[]> {
        const response = await api.get<VideoInDB[]>(`/api/videos/doll/${dollId}?skip=${skip}&limit=${limit}`);
        return response.data;
    },

    // Increment video views
    async incrementVideoViews(id: number): Promise<void> {
        await api.post(`/api/videos/${id}/views`);
    },

    // Increment video likes
    async incrementVideoLikes(id: number): Promise<void> {
        await api.post(`/api/videos/${id}/likes`);
    },
};

// Create videoApiService with methods expected by useVipVideos
export const videoApiService = {
    // Get all videos - alias for compatibility
    async getAllVideos(): Promise<VideoInDB[]> {
        return videoApi.getVideos(0, 100); // Get more videos for VIP content
    },

    // Get video by ID - alias for compatibility
    async getVideoById(id: number): Promise<VideoInDB> {
        return videoApi.getVideo(id);
    },

    // Get featured videos
    async getFeaturedVideos(): Promise<VideoInDB[]> {
        // For now, return all videos but could be filtered by a featured flag
        return videoApi.getVideos(0, 20);
    },

    // Get videos by model (doll) ID
    async getModelVideos(modelId: number): Promise<VideoInDB[]> {
        return videoApi.getVideosByDollId(modelId);
    },

    // Delete video - alias for compatibility
    async deleteVideo(id: number): Promise<boolean> {
        try {
            await videoApi.deleteVideo(id);
            return true;
        } catch (error) {
            console.error('Error deleting video:', error);
            return false;
        }
    },

    // Upload video with file
    async uploadVideo(videoData: any): Promise<VideoInDB | null> {
        try {
            const formData = new FormData();
            
            // Add the video file
            if (videoData.file) {
                formData.append('file', videoData.file);
            }
            
            // Add other video data
            formData.append('title', videoData.title);
            formData.append('description', videoData.description);
            formData.append('doll_id', videoData.doll_id.toString());
            
            if (videoData.is_featured !== undefined) {
                formData.append('is_featured', videoData.is_featured.toString());
            }
            
            if (videoData.created_at) {
                formData.append('release_date', videoData.created_at);
            }

            const response = await api.post<VideoInDB>('/api/videos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading video:', error);
            throw error;
        }
    },

    // Upload thumbnail for video - try multiple endpoint approaches
    async uploadThumbnail(videoId: number, thumbnailFile: File): Promise<boolean> {
        try {
            const formData = new FormData();
            formData.append('file', thumbnailFile);
            formData.append('thumbnail', thumbnailFile);

            // Try the standard video update endpoint first
            try {
                await api.put(`/api/videos/${videoId}/thumbnail`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return true;
            } catch (error) {
                console.log('First thumbnail upload method failed, trying alternative...');
                
                // Try alternative endpoint
                await api.post(`/api/videos/${videoId}/thumbnail`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return true;
            }
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            
            // If both specific thumbnail endpoints fail, try updating the video with thumbnail
            try {
                const updateData = new FormData();
                updateData.append('thumbnail_file', thumbnailFile);
                
                await api.put(`/api/videos/${videoId}`, updateData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return true;
            } catch (updateError) {
                console.error('All thumbnail upload methods failed:', updateError);
                throw new Error('Unable to upload thumbnail. Please check if the thumbnail upload endpoint is available.');
            }
        }
    }
};

export const uploadVideo = async (
  file: File,
  title: string,
  description: string,
  category: string,
  tags: string[],
  dollId?: number,
  releaseDate?: Date
): Promise<VideoInDB> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('category', category);
  formData.append('tags', JSON.stringify(tags));
  
  if (dollId) {
    formData.append('doll_id', dollId.toString());
  }
  
  if (releaseDate) {
    formData.append('release_date', releaseDate.toISOString());
  }

  const response = await api.post<VideoInDB>('/api/videos/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
