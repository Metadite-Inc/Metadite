
// Mock data for the home page
import { apiService } from '../lib/api';

/**
 * Fetches featured models from the backend, filtered by user region if provided.
 * @param {string} userRegion - The user's region to filter models by
 * @returns {Promise<Array>} Array of featured models available in user's region
 */
export async function fetchFeaturedModels(userRegion = null) {
  try {
    const { apiService } = await import('../lib/api');
    return await apiService.getFeaturedModels(10, userRegion); // Fetch up to 10 featured models for carousel
  } catch (error) {
    console.error('Error in fetchFeaturedModels:', error);
    return [];
  }
}


export const testimonials = [
  {
    id: 1,
    text: 'I was skeptical at first, but once she arrived — I was blown away. The quality, the realism... it’s better than I imagined.',
    rating: 5
  },
  {
    id: 2,
    text: 'This was my first doll, and I couldn’t be happier. She looks and feels incredible. Worth every dollar.',
    rating: 5
  },
  {
    id: 3,
    text: 'Discreet shipping, fast delivery, and absolutely stunning design. Metadite nailed it — I’ll definitely be ordering again',
    rating: 4
  },
  {
    id: 4,
    text: 'She’s not just beautiful — she’s comforting. I didn’t expect to feel this level of connection.',
    rating: 5
  },
  {
    id: 5,
    text: 'Everything from the unboxing to the first touch felt premium. Metadite takes the experience seriously, and it shows.',
    rating: 4
  },
  {
    id: 6,
    text: 'I’ve browsed many sites before, but none felt this clean, professional, and trustworthy. Metadite delivers exactly what it promises.',
    rating: 5
  }
];
