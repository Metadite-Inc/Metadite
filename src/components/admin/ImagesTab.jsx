import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../lib/api';
import { imageApiService } from '../../lib/api/image_api';

// Import components
import ImageUploader from './images/ImageUploader';
import ImageListCard from './images/ImageListCard';

const ImagesTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [models, setModels] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch models
        const response = await apiService.getModels(0, 100); // Get up to 100 models
        setModels(response.data);
        
        // Fetch all images
        await fetchImages();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to fetch images with pagination
  const fetchImages = async () => {
    setLoading(true);
    try {
      const { page, pageSize } = pagination;
      const response = await imageApiService.getImages({ 
        is_vip: true,
        page,
        page_size: pageSize,
        model_id: selectedModel || undefined,
        search: searchTerm || undefined
      });
      
      setImages(response.items || []);
      setPagination(prev => ({
        ...prev,
        totalItems: response.total || 0,
        totalPages: Math.ceil((response.total || 0) / pageSize)
      }));
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newSize,
      page: 1 // Reset to first page when changing page size
    }));
  };

  // Fetch images when pagination or filters change
  useEffect(() => {
    fetchImages();
  }, [pagination.page, pagination.pageSize, selectedModel, searchTerm]);

  // Handle model selection change
  const handleModelChange = (modelId) => {
    setSelectedModel(modelId === 'all' ? null : modelId);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  // Get model name by ID
  const getModelNameById = (modelId) => {
    if (!modelId) return 'N/A';
    const model = models.find(m => m.id === Number(modelId));
    return model ? model.name : 'Unknown Model';
  };

  // Handle image deletion
  const handleDeleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      try {
        await imageApiService.deleteImage(id);
        toast.success('Image deleted successfully');
        fetchImages(); // Refresh the list
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image');
      }
    }
  };

  // Handle successful upload
  const handleImageUploaded = () => {
    setShowUploader(false);
    fetchImages();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">VIP Images Management</h1>
        <button 
          onClick={() => setShowUploader(!showUploader)}
          className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
        >
          {showUploader ? 'Hide Uploader' : 'Upload New Image'}
        </button>
      </div>

      {showUploader && (
        <ImageUploader 
          models={models}
          selectedModel={selectedModel}
          onImageUploaded={handleImageUploaded}
          fetchAllImages={fetchImages}
        />
      )}

      <ImageListCard 
        images={images}
        loading={loading}
        searchTerm={searchTerm}
        setSearchTerm={(term) => {
          setSearchTerm(term);
          setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
        }}
        selectedModel={selectedModel}
        handleModelChange={handleModelChange}
        models={models}
        getModelNameById={getModelNameById}
        handleDeleteImage={handleDeleteImage}
        page={pagination.page}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default ImagesTab;
