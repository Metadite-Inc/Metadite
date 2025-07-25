import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BookmarkX } from 'lucide-react';
import { toast } from 'sonner';
import ModelCard from '../ModelCard';
import { favoriteApiService } from '../../lib/api/favorite_api';

const FavoritesTab = ({ user }) => {
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user favorites from API
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        const favoriteModels = await favoriteApiService.getUserFavorites();
        // Fetch full model details for each favorite
        const detailedModels = await Promise.all(
          favoriteModels.map(async (favorite) => {
            const modelDetail = await import('../../lib/api').then(m => m.apiService.getModelDetails(favorite.doll_id));
            return {
              favoriteId: favorite.id,
              model: modelDetail
            };
          })
        );
        setFavorites(detailedModels);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        toast.error("Failed to load your favorites");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user?.id]);

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
      <h2 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-white' : ''}`}>
        Your Favorites
      </h2>
      
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
