
// Mock data for the home page
import { apiService } from '../lib/api';

/**
 * Fetches up to 3 featured models from the backend with category 'limited_edition'.
 * @returns {Promise<Array>} Array of featured models
 */
export async function fetchFeaturedModels() {
  try {
    const dolls = await apiService.request('/api/dolls/category/limited_edition');
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    return (dolls || []).slice(0, 3).map(doll => {
      let mainImage = '';
      if (Array.isArray(doll.images)) {
        const primary = doll.images.find(img => img.is_primary);
        mainImage = primary ? `${backendUrl}${primary.image_url}` : '';
      }
      return {
        id: doll.id,
        name: doll.name,
        price: doll.price,
        description: doll.description.substring(0, 100) + "...",
        image: mainImage,
        category: doll.doll_category,
      };
    });
  } catch (error) {
    return [];
  }
}


export const testimonials = [
  {
    id: 1,
    text: 'The quality of these model dolls is exceptional! The attention to detail and craftsmanship is outstanding.',
    rating: 5
  },
  {
    id: 2,
    text: 'I\'ve been collecting for years and Metadite offers some of the most unique and beautiful designs I\'ve ever seen.',
    rating: 5
  },
  {
    id: 3,
    text: 'The VIP membership is absolutely worth it! Access to exclusive content and early releases has enhanced my collecting experience.',
    rating: 4
  }
];
