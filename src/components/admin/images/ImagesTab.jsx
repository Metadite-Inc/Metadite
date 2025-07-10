import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from '../../../context/ThemeContext';
import { apiService } from '../../../lib/api'; // Import the real API service
import { imageApiService } from '../../../lib/api/image_api'; // Import the real image API service
import ImageUploader from './ImageUploader';
import ImageListCard from './ImageListCard';

const ImagesTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [models, setModels] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch models using the real API service
        const response = await apiService.getModels(0, 100); // Get up to 100 models
        setModels(response.data);
        
        // Fetch all images
        await fetchAllImages();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to fetch all images
  const fetchAllImages = async () => {
    setLoading(true);
    try {
      const imagesData = await imageApiService.getAllImages();
      setImages(imagesData);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  // Function to get model name by ID
  const getModelNameById = (modelId) => {
    const model = models.find(m => m.id === modelId);
    return model ? model.name : "Unknown Model";
  };

  // Handler for when image upload is completed
  const handleImageUploaded = () => {
    fetchAllImages();
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }
    try {
      const success = await imageApiService.deleteImage(imageId);
      if (success) {
        toast.success("Image deleted successfully");
        await fetchAllImages();
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Image Upload Component */}
      <ImageUploader 
        models={models}
        selectedModel={selectedModel}
        onImageUploaded={handleImageUploaded}
        fetchAllImages={fetchAllImages}
      />
      {/* Image List Component */}
      <ImageListCard 
        images={images}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedModel={selectedModel}
        handleModelChange={setSelectedModel}
        models={models}
        getModelNameById={getModelNameById}
        handleDeleteImage={handleDeleteImage}
      />
    </div>
  );
};

export default ImagesTab; 