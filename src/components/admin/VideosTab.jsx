
import React, { useState, useEffect } from 'react';
import { FileVideo, Search, Edit, Trash2, Plus, X, Upload, Image } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
  
  // Upload states
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    is_featured: false,
    model_id: '',
  });
  
  const [videoFile, setVideoFile] = useState(null);
  const [uploadState, setUploadState] = useState('initial'); // 'initial', 'uploading', 'thumbnail'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadedVideoId, setUploadedVideoId] = useState(null);

  // Simulate progress for smoother UX
  useEffect(() => {
    if (uploadState === 'uploading' && uploadProgress < 90) {
      const timer = setTimeout(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [uploadProgress, uploadState]);

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

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file for the thumbnail");
      return;
    }
    
    setThumbnailFile(file);
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
    
    setUploadState('uploading');
    setUploadProgress(0);
    
    try {
      const result = await videoApiService.uploadVideo({
        ...videoData,
        file: videoFile
      });
      
      if (result) {
        setUploadProgress(100);
        toast.success("Video uploaded successfully!");
        
        // Save the video ID for thumbnail upload
        setUploadedVideoId(result.id);
        
        // Move to thumbnail upload state
        setTimeout(() => {
          setUploadState('thumbnail');
        }, 500);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadState('initial');
      toast.error("Failed to upload video");
    }
  };

  const handleThumbnailSubmit = async (e) => {
    e.preventDefault();
    
    if (!thumbnailFile) {
      toast.error("Please select a thumbnail image");
      return;
    }
    
    try {
      const success = await videoApiService.uploadThumbnail(uploadedVideoId, thumbnailFile);
      
      if (success) {
        toast.success("Thumbnail uploaded successfully!");
        
        // Reset the form and fetch updated videos
        resetUploadForm();
        await fetchAllVideos();
      }
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
    }
  };

  const resetUploadForm = () => {
    setVideoData({
      title: '',
      description: '',
      is_featured: false,
      model_id: selectedModel || '',
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setUploadState('initial');
    setUploadProgress(0);
    setUploadedVideoId(null);
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
          {uploadState === 'initial' && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Select Model*
                  </label>
                  <Select
                    value={videoData.model_id}
                    onValueChange={(value) => setVideoData({...videoData, model_id: value})}
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
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white hover:opacity-90 transition-opacity"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Video
                </Button>
              </div>
            </form>
          )}

          {uploadState === 'uploading' && (
            <div className="py-8 px-4">
              <div className="text-center mb-6">
                <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  Uploading Video...
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Please wait while your video is being uploaded
                </p>
              </div>
              
              <div className="mb-4">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-gray-500 mt-1 text-right">{uploadProgress}%</p>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="text-gray-600"
                  onClick={resetUploadForm}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {uploadState === 'thumbnail' && (
            <div className="py-4 px-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="rounded-full bg-green-100 p-2 text-green-500 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    Video Uploaded Successfully
                  </h3>
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  Now you can upload a thumbnail for your video
                </p>
              </div>

              <form onSubmit={handleThumbnailSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Thumbnail Image
                  </label>
                  <div className="mt-1">
                    <label className="block w-full">
                      <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-metadite-primary focus:outline-none">
                        <span className="flex items-center space-x-2">
                          <Image className="w-6 h-6 text-gray-400" />
                          <span className="font-medium text-gray-600">
                            {thumbnailFile ? thumbnailFile.name : "Click to upload thumbnail image"}
                          </span>
                        </span>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetUploadForm();
                      fetchAllVideos();
                    }}
                  >
                    Skip
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white hover:opacity-90 transition-opacity"
                    disabled={!thumbnailFile}
                  >
                    Upload Thumbnail
                  </Button>
                </div>
              </form>
            </div>
          )}
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
