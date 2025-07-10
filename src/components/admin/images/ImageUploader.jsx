import React, { useState, useEffect } from 'react';
import { Image, X, Upload, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTheme } from '../../../context/ThemeContext';
import { imageApiService } from '../../../lib/api/image_api';

const ImageUploader = ({ models, selectedModel, onImageUploaded, fetchAllImages }) => {
  const { theme } = useTheme();
  
  // Upload states
  const [imageData, setImageData] = useState({
    title: '',
    description: '',
    is_featured: false,
    doll_id: selectedModel || '',
    created_at: '', // For release date
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [uploadState, setUploadState] = useState('initial'); // 'initial', 'uploading'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImageId, setUploadedImageId] = useState(null);

  // Effect to update doll_id when selectedModel changes
  useEffect(() => {
    if (selectedModel) {
      setImageData(prev => ({ ...prev, doll_id: selectedModel }));
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
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    
    // Check if image is larger than 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Images must be less than 10MB."
      });
      return;
    }
    
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error("Please select an image file");
      return;
    }
    
    if (!imageData.title || !imageData.description || !imageData.doll_id) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields."
      });
      return;
    }
    
    setUploadState('uploading');
    setUploadProgress(0);
    
    try {
      console.log('Starting image upload with data:', imageData);
      
      const uploadData = {
        ...imageData,
        file: imageFile,
        doll_id: Number(imageData.doll_id)
      };
      
      const result = await imageApiService.uploadImage(uploadData);
      
      if (result) {
        console.log('Image uploaded successfully:', result);
        setUploadProgress(100);
        toast.success("Image uploaded successfully!");
        
        // Save the image ID
        setUploadedImageId(result.id);
        
        // Reset the form and fetch updated images
        setTimeout(() => {
          resetUploadForm();
          if (fetchAllImages) fetchAllImages();
          if (onImageUploaded) onImageUploaded();
        }, 1000);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", {
        description: error.response?.data?.detail || error.message || "The upload was cancelled due to an error"
      });
      
      // Auto-cancel on failure
      resetUploadForm();
    }
  };

  const resetUploadForm = () => {
    setImageData({
      title: '',
      description: '',
      is_featured: false,
      doll_id: selectedModel || '',
      created_at: '',
    });
    setImageFile(null);
    setUploadState('initial');
    setUploadProgress(0);
    setUploadedImageId(null);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
        <h2 className="text-lg font-semibold">Upload Model Image</h2>
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
                  value={imageData.doll_id ? imageData.doll_id.toString() : ""}
                  onValueChange={(value) => setImageData({...imageData, doll_id: value})}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue>
                      {getModelNameById(imageData.doll_id)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {models.map(model => (
                      <SelectItem key={model.id} value={model.id.toString()}>{model.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Image Title*
                </label>
                <input
                  type="text"
                  value={imageData.title}
                  onChange={(e) => setImageData({...imageData, title: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Image Description*
                </label>
                <Textarea
                  value={imageData.description}
                  onChange={(e) => setImageData({...imageData, description: e.target.value})}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Image File*
                </label>
                <div className="mt-1 flex items-center">
                  <label className="block w-full">
                    <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-metadite-primary focus:outline-none">
                      <span className="flex items-center space-x-2">
                        <Image className="w-6 h-6 text-gray-400" />
                        <span className="font-medium text-gray-600">
                          {imageFile ? imageFile.name : "Click to upload image (max 10MB)"}
                        </span>
                      </span>
                      <input 
                        type="file"
                        accept="image/*"
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
                    checked={imageData.is_featured}
                    onChange={(e) => setImageData({...imageData, is_featured: e.target.checked})}
                    className="rounded text-metadite-primary focus:ring-metadite-primary h-4 w-4"
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Feature this image
                  </span>
                </label>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Release Date
                </label>
                <input
                  type="date"
                  value={imageData.created_at}
                  onChange={e => setImageData({ ...imageData, created_at: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white hover:opacity-90 transition-opacity"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          </form>
        )}

        {uploadState === 'uploading' && (
          <div className="py-8 px-4">
            <div className="text-center mb-6">
              <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Uploading Image...
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Please wait while your image is being uploaded
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
      </div>
    </div>
  );
};

export default ImageUploader; 