
import React, { useState, useEffect } from 'react';
import { FileVideo, Search, Edit, Trash2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../lib/api';
import { videoApiService } from '../../lib/api/video_api';

const VideosTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [models, setModels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);
  
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    is_featured: false,
    model_id: '',
  });
  
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  // New function to fetch all videos
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
    setVideoData({...videoData, model_id: modelId});
    
    // If a model is selected, filter videos by that model
    if (modelId) {
      fetchModelVideos(modelId);
    } else {
      // If no model is selected (or selection is cleared), fetch all videos
      fetchAllVideos();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      toast.error("Please select a video file");
      return;
    }
    
    // Check if video is larger than 200MB
    if (file.size > 200 * 1024 * 1024) {
      toast.error("Video too large", {
        description: "Videos must be less than 200MB."
      });
      return;
    }
    
    setVideoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast.error("Please select a video file");
      return;
    }
    
    if (!videoData.title || !videoData.description || !videoData.model_id) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields."
      });
      return;
    }
    
    setUploading(true);
    try {
      const success = await videoApiService.uploadVideo({
        ...videoData,
        file: videoFile
      });
      
      if (success) {
        toast.success("Video uploaded successfully!");
        setVideoData({
          title: '',
          description: '',
          is_featured: false,
          model_id: selectedModel
        });
        setVideoFile(null);
        
        // Refresh videos list
        await fetchAllVideos();
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setUploading(false);
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

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="glass-card rounded-xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
          <h2 className="text-lg font-semibold">Upload Model Video</h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Select Model*
                </label>
                <Select
                  value={videoData.model_id}
                  onValueChange={handleModelChange}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {models.map(model => (
                      <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Video Title*
                </label>
                <input
                  type="text"
                  value={videoData.title}
                  onChange={(e) => setVideoData({...videoData, title: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Video Description*
                </label>
                <Textarea
                  value={videoData.description}
                  onChange={(e) => setVideoData({...videoData, description: e.target.value})}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Video File*
                </label>
                <div className="mt-1 flex items-center">
                  <label className="block w-full">
                    <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-metadite-primary focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <FileVideo className="w-6 h-6 text-gray-400" />
                        <span className="font-medium text-gray-600">
                          {videoFile ? videoFile.name : "Click to upload video (max 200MB)"}
                        </span>
                      </span>
                      <input 
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={videoData.is_featured}
                    onChange={(e) => setVideoData({...videoData, is_featured: e.target.checked})}
                    className="rounded text-metadite-primary focus:ring-metadite-primary h-4 w-4"
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Feature this video
                  </span>
                </label>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className={`flex items-center ${uploading ? 'bg-gray-400' : 'bg-gradient-to-r from-metadite-primary to-metadite-secondary'} text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity`}
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold">Manage Videos</h2>
          <div className="flex items-center space-x-4">
            <Select
              value={selectedModel}
              onValueChange={handleModelChange}
            >
              <SelectTrigger className="w-40 bg-white">
                <SelectValue placeholder="Filter by model" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value={null}>All Models</SelectItem>
                {models.map(model => (
                  <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-metadite-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-10">
              <FileVideo className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No videos found</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className={`text-left text-gray-500 text-sm 
                  ${theme === 'dark' ? 'bg-gray-100' : 'bg-gray-50'}`}>
                  <th className="px-6 py-3">Thumbnail</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Doll Model</th>
                  <th className="px-6 py-3">Featured</th>
                  <th className="px-6 py-3">Added Date</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos
                  .filter(video => 
                    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    getModelNameById(video.model_id).toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((video) => (
                  <tr key={video.id} className={`border-t border-gray-100 transition-colors 
                    ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    >
                    <td className="px-6 py-4">
                      <img 
                        src={video.thumbnail_url || 'https://via.placeholder.com/150'} 
                        alt={video.title} 
                        className="w-16 h-9 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{video.title}</td>
                    <td className="px-6 py-4">{getModelNameById(video.model_id)}</td>
                    <td className="px-6 py-4">
                      {video.is_featured ? (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          Not Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{new Date(video.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideosTab;
