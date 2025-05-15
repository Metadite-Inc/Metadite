
import { useState, useEffect } from 'react';
import { videoApiService } from '../lib/api/video_api';
import { toast } from 'sonner';

export const useVipVideos = (searchTerm) => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const fetchedVideos = await videoApiService.getAllVideos();
        console.log('Fetched videos:', fetchedVideos);
        setVideos(fetchedVideos);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Failed to load videos', {
          description: 'Please try again later',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);
  
  // Filter videos based on search term
  useEffect(() => {
    if (searchTerm === undefined || searchTerm.trim() === '') {
      setFilteredVideos(videos);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredVideos(
        videos.filter(
          video => 
            video.title.toLowerCase().includes(term) || 
            (video.description && video.description.toLowerCase().includes(term))
        )
      );
    }
  }, [searchTerm, videos]);

  // Get a specific video by ID
  const getVideoById = (id) => {
    return videos.find(video => video.id === id);
  };
  
  // Get the previous video ID for navigation
  const getPreviousVideoId = (currentId) => {
    const currentIndex = videos.findIndex(video => video.id === currentId);
    if (currentIndex > 0) {
      return videos[currentIndex - 1].id;
    }
    return null;
  };
  
  // Get the next video ID for navigation
  const getNextVideoId = (currentId) => {
    const currentIndex = videos.findIndex(video => video.id === currentId);
    if (currentIndex !== -1 && currentIndex < videos.length - 1) {
      return videos[currentIndex + 1].id;
    }
    return null;
  };

  // Fetch a specific video by ID from the API
  const fetchVideoById = async (id) => {
    try {
      setIsLoading(true);
      const video = await videoApiService.getVideoById(id);
      return video;
    } catch (error) {
      console.error(`Error fetching video ${id}:`, error);
      toast.error('Failed to load video', {
        description: 'Please try again later',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get featured videos
  const fetchFeaturedVideos = async () => {
    try {
      setIsLoading(true);
      const fetchedVideos = await videoApiService.getFeaturedVideos();
      return fetchedVideos;
    } catch (error) {
      console.error('Error fetching featured videos:', error);
      toast.error('Failed to load featured videos', {
        description: 'Please try again later',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    filteredVideos, 
    isLoaded,
    isLoading,
    getVideoById,
    fetchVideoById,
    fetchFeaturedVideos,
    getPreviousVideoId, 
    getNextVideoId 
  };
};
