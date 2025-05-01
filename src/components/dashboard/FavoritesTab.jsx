
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BookmarkX } from 'lucide-react';
import { toast } from 'sonner';
import ModelCard from '../ModelCard';

const FavoritesTab = ({ user }) => {
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API based on the user's ID
    // For demo purposes, we'll use mock data
    const fetchFavorites = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock favorite models
        const mockFavorites = [
          {
            id: 'model-1',
            name: 'Emma Watson',
            description: 'Popular celebrity model with multiple looks and styles.',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=688&auto=format&fit=crop'
          },
          {
            id: 'model-2',
            name: 'John Smith',
            description: 'Professional fitness model for sports and activewear.',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop'
          },
          // Add more mock data as needed
        ];
        
        setFavorites(mockFavorites);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [user?.id]);

  const removeFromFavorites = (modelId) => {
    setFavorites(favorites.filter(model => model.id !== modelId));
    toast.success('Removed from favorites');
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
        {favorites.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesTab;
