import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';
import ImageListCard from './ImageListCard';
import { imageApiService } from '../../../lib/api/image_api';
import { Button } from '@/components/ui/button';

const ImagesAdmin = ({ models }) => {
  const { toast } = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [showUploader, setShowUploader] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1
  });

  // Fetch images with pagination
  const fetchImages = async () => {
    try {
      setLoading(true);
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
      console.error('Error fetching images:', error);
      toast({
        title: 'Error',
        description: 'Failed to load images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchImages();
  }, []);

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
        toast({
          title: 'Success',
          description: 'Image deleted successfully',
        });
        fetchImages(); // Refresh the list
      } catch (error) {
        console.error('Error deleting image:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete image. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  // Handle successful upload
  const handleImageUploaded = () => {
    setShowUploader(false);
    fetchImages();
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">VIP Images Management</h1>
        <Button 
          onClick={() => setShowUploader(!showUploader)}
          className="bg-gradient-to-r from-metadite-primary to-metadite-secondary hover:opacity-90"
        >
          {showUploader ? 'Hide Uploader' : 'Upload New Image'}
        </Button>
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

export default ImagesAdmin;
