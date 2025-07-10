import { BaseApiService } from './base_api';

interface ImageInDB {
    id: number;
    title: string;
    description: string;
    image_url: string;
    thumbnail_url?: string;
    is_featured: boolean;
    created_at: string;
    updated_at?: string;
    doll_id: number;
    release_date?: string;
    doll_name?: string;
}

interface ImageCreate {
    title: string;
    description: string;
    doll_id: number;
    is_featured?: boolean;
    release_date?: string;
}

interface ImageUpdate {
    title?: string;
    description?: string;
    is_featured?: boolean;
    release_date?: string;
}

export const imageApiService = {
    // Get all images
    async getAllImages(skip: number = 0, limit: number = 100): Promise<ImageInDB[]> {
        try {
            const token = this.validateAuth();
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/?skip=${skip}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch images: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching images:', error);
            throw error;
        }
    },

    // Get images by doll ID
    async getImagesByDoll(dollId: number, skip: number = 0, limit: number = 100): Promise<ImageInDB[]> {
        try {
            const token = this.validateAuth();
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/doll/${dollId}/?skip=${skip}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch images for doll ${dollId}: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching images by doll:', error);
            throw error;
        }
    },

    // Upload image
    async uploadImage(imageData: any): Promise<ImageInDB> {
        try {
            const token = this.validateAuth();
            const formData = new FormData();
            
            // Add the image file
            if (imageData.file) {
                formData.append('file', imageData.file);
            }
            
            // Add other image data
            formData.append('title', imageData.title);
            formData.append('description', imageData.description);
            formData.append('doll_id', imageData.doll_id.toString());
            
            if (imageData.is_featured !== undefined) {
                formData.append('is_featured', imageData.is_featured.toString());
            }
            
            if (imageData.release_date) {
                formData.append('release_date', imageData.release_date);
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Failed to upload image: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },

    // Update image
    async updateImage(imageId: number, imageData: ImageUpdate): Promise<ImageInDB> {
        try {
            const token = this.validateAuth();
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${imageId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(imageData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Failed to update image: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating image:', error);
            throw error;
        }
    },

    // Delete image
    async deleteImage(imageId: number): Promise<boolean> {
        try {
            const token = this.validateAuth();
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${imageId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete image: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    },

    // Helper method to validate auth
    validateAuth(): string {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('Authentication required');
        }
        return token;
    }
}; 