
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../lib/api';
import { videoApiService } from '../../lib/api/video_api';

// Import the new components
import VideoUploader from './videos/VideoUploader';
import VideoListCard from './videos/VideoListCard';

const VideosTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [models, setModels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch models
        const response = await apiService.getModels(0, 100); // Get up to 100 models
        setModels(response.data);
        
        // Fetch all videos
        await fetchAllVideos();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to fetch all videos
  const fetchAllVideos = async () => {
    setLoading(true);
    try {
      const videosData = await videoApiService.getAllVideos();
      setVideos(videosData);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  // This function will now only be used when filtering by model
  const fetchModelVideos = async (modelId) => {
    setLoading(true);
    try {
      const videosData = await videoApiService.getModelVideos(modelId);
      setVideos(videosData);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    
    // If a model is selected, filter videos by that model
    if (modelId) {
      fetchModelVideos(modelId);
    } else {
      // If no model is selected (or selection is cleared), fetch all videos
      fetchAllVideos();
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!confirm("Are you sure you want to delete this video?")) {
      return;
    }
    
    try {
      const success = await videoApiService.deleteVideo(videoId);
      if (success) {
        toast.success("Video deleted successfully");
        // Refresh videos list
        await fetchAllVideos();
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  // Function to get model name by ID
  const getModelNameById = (modelId) => {
    const model = models.find(m => m.id === modelId);
    return model ? model.name : "Unknown Model";
  };

  // Handler for when video upload is completed
  const handleVideoUploaded = () => {
    fetchAllVideos();
  };

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Video Upload Component */}
      <VideoUploader 
        models={models}
        selectedModel={selectedModel}
        onVideoUploaded={handleVideoUploaded}
        fetchAllVideos={fetchAllVideos}
      />

      {/* Video List Component */}
      <VideoListCard 
        videos={videos}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedModel={selectedModel}
        handleModelChange={handleModelChange}
        models={models}
        getModelNameById={getModelNameById}
        handleDeleteVideo={handleDeleteVideo}
      />
    </div>
  );
};

export default VideosTab;
