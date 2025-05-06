
import { useState, useEffect } from 'react';

// Mock data for VIP videos
const vipVideos = [
  {
    id: 1,
    title: 'Behind the Scenes: Making of Victoria Vintage',
    modelName: 'Victoria Vintage',
    duration: '12:34',
    thumbnail: 'https://images.unsplash.com/photo-1545239705-1564e6722e81?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '2 days ago'
  },
  {
    id: 2,
    title: 'Detailed Craftsmanship of Sophia Elegance',
    modelName: 'Sophia Elegance',
    duration: '8:45',
    thumbnail: 'https://images.unsplash.com/photo-1609726125291-190a9368cc3f?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '1 week ago'
  },
  {
    id: 3,
    title: 'Modern Mila Design Process',
    modelName: 'Modern Mila',
    duration: '15:22',
    thumbnail: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 4,
    title: 'Collector\'s Guide: Premium Storage Solutions',
    modelName: 'Various Models',
    duration: '10:18',
    thumbnail: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '3 days ago'
  },
  {
    id: 5,
    title: 'Exclusive Interview with Master Craftsman',
    modelName: 'Various Models',
    duration: '22:07',
    thumbnail: 'https://images.unsplash.com/photo-1599639957037-f791c72e853c?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 6,
    title: 'Restoration Techniques for Vintage Models',
    modelName: 'Victoria Vintage',
    duration: '18:33',
    thumbnail: 'https://images.unsplash.com/photo-1605289355680-75fb41239154?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 7,
    title: 'Limited Edition Models Showcase',
    modelName: 'Various Models',
    duration: '14:50',
    thumbnail: 'https://images.unsplash.com/photo-1595446472013-83748e352d7d?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '5 days ago'
  },
  {
    id: 8,
    title: 'Metadite Collection 2023 Preview',
    modelName: 'New Collection',
    duration: '9:42',
    thumbnail: 'https://images.unsplash.com/photo-1515660130198-1c888aac7ed1?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 9,
    title: 'Photography Tips for Collectors',
    modelName: 'Various Models',
    duration: '11:16',
    thumbnail: 'https://images.unsplash.com/photo-1580706483913-b6ea7db483a0?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '1 day ago'
  },
  {
    id: 10,
    title: 'Holiday Special: Gift Ideas for Collectors',
    modelName: 'Various Models',
    duration: '16:24',
    thumbnail: 'https://images.unsplash.com/photo-1607262807149-dda0a6e926e5?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 11,
    title: 'Advanced Display Techniques',
    modelName: 'Various Models',
    duration: '13:59',
    thumbnail: 'https://images.unsplash.com/photo-1615198996529-4d39019cc475?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 12,
    title: 'Material Science: Understanding Quality',
    modelName: 'Various Models',
    duration: '20:11',
    thumbnail: 'https://images.unsplash.com/photo-1594026112248-4572e9107ee9?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '4 days ago'
  },
  {
    id: 13,
    title: 'Exclusive: New York Collectors Exhibition',
    modelName: 'Various Models',
    duration: '17:33',
    thumbnail: 'https://images.unsplash.com/photo-1533658280853-e4a10c25a30d?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 14,
    title: 'Caring for Your Collection: Maintenance Tips',
    modelName: 'Various Models',
    duration: '12:48',
    thumbnail: 'https://images.unsplash.com/photo-1619596662922-58944c56554b?q=80&w=1000&auto=format&fit=crop',
    lastWatched: null
  },
  {
    id: 15,
    title: 'Collector Spotlight: Celebrity Collections',
    modelName: 'Various Models',
    duration: '19:26',
    thumbnail: 'https://images.unsplash.com/photo-1535571393765-ea44927160be?q=80&w=1000&auto=format&fit=crop',
    lastWatched: '1 week ago'
  }
];

export const useVipVideos = (searchTerm) => {
  const [filteredVideos, setFilteredVideos] = useState(vipVideos);
  const [isLoaded, setIsLoaded] = useState(false);

  // Set videos as loaded after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter videos based on search term
  useEffect(() => {
    if (searchTerm === undefined || searchTerm.trim() === '') {
      setFilteredVideos(vipVideos);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredVideos(
        vipVideos.filter(
          video => 
            video.title.toLowerCase().includes(term) || 
            video.modelName.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm]);

  // Get a specific video by ID
  const getVideoById = (id) => {
    return vipVideos.find(video => video.id === id);
  };
  
  // Get the previous video ID for navigation
  const getPreviousVideoId = (currentId) => {
    const currentIndex = vipVideos.findIndex(video => video.id === currentId);
    if (currentIndex > 0) {
      return vipVideos[currentIndex - 1].id;
    }
    return null;
  };
  
  // Get the next video ID for navigation
  const getNextVideoId = (currentId) => {
    const currentIndex = vipVideos.findIndex(video => video.id === currentId);
    if (currentIndex !== -1 && currentIndex < vipVideos.length - 1) {
      return vipVideos[currentIndex + 1].id;
    }
    return null;
  };

  return { 
    filteredVideos, 
    isLoaded, 
    getVideoById, 
    getPreviousVideoId, 
    getNextVideoId 
  };
};