import React, { useState, useEffect } from 'react';
import { FileVideo, X, Upload, Image, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useTheme } from '../../../context/ThemeContext';
import { videoApiService } from '../../../lib/api/video_api';

const VideoUploader = ({ models, selectedModel, onVideoUploaded, fetchAllVideos }) => {
  const { theme } = useTheme();
  
  // Upload states
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    is_featured: false,
    doll_id: selectedModel || '',
  });
  
  const [videoFile, setVideoFile] = useState(null);
  const [uploadState, setUploadState] = useState('initial'); // 'initial', 'uploading', 'thumbnail'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadedVideoId, setUploadedVideoId] = useState(null);

  // Effect to update doll_id when selectedModel changes
  useEffect(() => {
    if (selectedModel) {
      setVideoData(prev => ({ ...prev, doll_id: selectedModel }));
    }
  }, [selectedModel]);

  // Function to get model name by ID
  const getModelNameById = (modelId) => {
    if (!modelId) return "Select model";
    const model = models.find(model => model.id === Number(modelId));
    return model ? model.name : "Select model";
  };

  // Simulate progress for smoother UX
  React.useEffect(() => {
    if (uploadState === 'uploading' && uploadProgress < 90) {
      const timer = setTimeout(() => {
        setUploadProgress(prev => Math.min(prev + 5, 90));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [uploadProgress, uploadState]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      toast.error("Please select a video file");
      return;
    }
    
    // Check if video is larger than 300MB
    if (file.size > 300 * 1024 * 1024) {
      toast.error("Video too large", {
        description: "Videos must be less than 300MB."
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
    
    if (!videoData.title || !videoData.description || !videoData.doll_id) { // Changed from model_id to doll_id
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
      toast.error("Failed to upload video", {
        description: error.message || "The upload was cancelled due to an error"
      });
      
      // Auto-cancel on failure
      resetUploadForm();
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
        fetchAllVideos();
        
        // Notify parent that upload is complete
        if (onVideoUploaded) onVideoUploaded();
      }
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      toast.error("Failed to upload thumbnail", {
        description: error.message || "The upload was cancelled due to an error"
      });
      
      // Reset form on failure
      resetUploadForm();
      fetchAllVideos();
    }
  };

  const resetUploadForm = () => {
    setVideoData({
      title: '',
      description: '',
      is_featured: false,
      doll_id: selectedModel || '',
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setUploadState('initial');
    setUploadProgress(0);
    setUploadedVideoId(null);
  };

  return (
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
                  value={videoData.doll_id} // Changed from model_id to doll_id
                  onValueChange={(value) => setVideoData({...videoData, doll_id: value})} // Changed from model_id to doll_id
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue>
                      {getModelNameById(videoData.doll_id)}
                    </SelectValue>
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

              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Release Date*
                </label>
                <input
                  type="date"
                  value={videoData.created_at}
                  onChange={e => setVideoData({ ...videoData, created_at: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                  required
                />
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
                    if (onVideoUploaded) onVideoUploaded();
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
  );
};

export default VideoUploader;
