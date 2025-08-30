import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BookmarkX, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import ModelCard from '../ModelCard';
import { favoriteApiService } from '../../lib/api/favorite_api';

const FavoritesTab = ({ user }) => {
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user favorites from API
  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const favoriteModels = await favoriteApiService.getUserFavorites();
      console.log('Raw favorites data:', favoriteModels);
      
      // Process favorites - now the API includes doll data
      const detailedModels = favoriteModels
        .filter(favorite => favorite.doll_id && favorite.doll_id !== 0 && favorite.doll)
        .map(favorite => {
          console.log('Processing favorite with doll data:', favorite.id);
          
          // Construct the proper image URL
          let mainImage = '';
          const backendUrl = import.meta.env.VITE_API_BASE_URL;
          
          if (Array.isArray(favorite.doll.images)) {
            // If images array exists, find the primary image
            const primary = favorite.doll.images.find((img) => img.is_primary);
            mainImage = primary ? `${backendUrl}${primary.image_url}` : '';
          } else if (favorite.doll.image) {
            // If direct image field exists, use it (might already be full URL)
            mainImage = favorite.doll.image.startsWith('http') 
              ? favorite.doll.image 
              : `${backendUrl}${favorite.doll.image}`;
          }
          
          return {
            favoriteId: favorite.id,
            model: {
              id: favorite.doll.id,
              name: favorite.doll.name,
              price: favorite.doll.price,
              description: favorite.doll.description,
              image: mainImage,
              category: favorite.doll.category,
              available_regions: favorite.doll.available_regions || ['usa', 'canada', 'mexico', 'uk', 'eu', 'australia', 'new_zealand']
            }
          };
        });
      
      setFavorites(detailedModels);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error("Failed to load your favorites");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user?.id]);

  // Refresh favorites when window gains focus (e.g., returning from model edit)
  useEffect(() => {
    const handleFocus = () => {
      if (!isLoading && user?.id) {
        console.log('Window focused - refreshing favorites');
        fetchFavorites();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isLoading, user?.id]);

  const removeFromFavorites = async (favoriteId) => {
    try {
      const success = await favoriteApiService.removeFromFavorites(favoriteId);
      
      if (success) {
        // Update the local state after successful removal
        setFavorites(favorites.filter(fav => fav.favoriteId !== favoriteId));
        toast.success("Removed from favorites");
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error("Failed to remove from favorites");
    }
  };

  if (isLoading) {
    return (
      <div className={`glass-card rounded-xl p-10 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-metadite-primary"></div>
          <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className={`glass-card rounded-xl p-10 text-center ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="flex flex-col items-center">
          <div className="h-20 w-20 mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <BookmarkX className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
            No Favorites Yet
          </h2>
          <p className={`max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Browse our models and click the heart icon to add items to your favorites list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
          Your Favorites
        </h2>
        <button
          onClick={fetchFavorites}
          disabled={isLoading}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
          }`}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favorites.map(({ favoriteId, model }) => (
          model && (
            <ModelCard 
              key={favoriteId} 
              model={model}
              isFavorite={true}
              onRemoveFavorite={() => removeFromFavorites(favoriteId)}
              user={user}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default FavoritesTab;
