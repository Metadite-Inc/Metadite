
// Mock data for the home page
import { apiService } from '../lib/api';

/**
 * Fetches up to 3 featured models from the backend with category 'limited_edition'.
 * @returns {Promise<Array>} Array of featured models
 */
export async function fetchFeaturedModels() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const url = `${API_URL}/api/dolls/category/limited_edition`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch featured models: ${res.status}`);
      return [];
    }
    const dolls = await res.json();
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
        available_regions: doll.available_regions || ['usa', 'canada', 'mexico', 'uk', 'eu', 'australia', 'new_zealand'],
      };
    });
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
