import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2, Crown, X, Upload, Image as ImageIcon, CalendarDays } from 'lucide-react';
import { imageApiService } from '../../../lib/api/image_api';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ImageUploader = ({ models, selectedModel, onImageUploaded, fetchAllImages }) => {
  const { theme } = useTheme();
  
  // Upload states
  const [imageData, setImageData] = useState({
    title: '',
    description: '',
    is_featured: false,
    is_vip: true, // Default to VIP content
    doll_id: selectedModel || '',
    created_at: '', // For release date
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [uploadState, setUploadState] = useState('initial'); // 'initial', 'uploading', 'success', 'error'
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImageId, setUploadedImageId] = useState(null);
  const [isVip, setIsVip] = useState(true); // Separate state for the VIP toggle

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadState === 'initial') {
      setIsDragging(true);
    }
  }, [uploadState]);
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (uploadState !== 'initial') return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      validateAndSetImage(file);
    }
  }, [uploadState]);
  
  const validateAndSetImage = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please upload an image file (JPEG, PNG, GIF, etc.)'
      });
      return false;
    }
    
    // 10MB limit
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File too large', {
        description: `Image must be less than 10MB (current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
      });
      return false;
    }
    
    setImageFile(file);
    return true;
  };

  // Effect to update doll_id when selectedModel changes
  useEffect(() => {
    if (selectedModel) {
      setImageData(prev => ({
        ...prev,
        doll_id: selectedModel
      }));
    }
  }, [selectedModel]);
  
  // Update the imageData.is_vip when isVip changes
  useEffect(() => {
    setImageData(prev => ({
      ...prev,
      is_vip: isVip
    }));
  }, [isVip]);

  // Function to get model name by ID
  const getModelNameById = (modelId) => {
    if (!modelId) return "Select model";
    const model = models.find(model => model.id === Number(modelId));
    return model ? model.name : "Select model";
  };

  // Simulate progress for smoother UX
  useEffect(() => {
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
    validateAndSetImage(file);
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || uploadState === 'uploading') return;

    setUploadState('uploading');
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('title', imageData.title);
      formData.append('description', imageData.description);
      formData.append('is_featured', imageData.is_featured);
      formData.append('is_vip', isVip); // Use the isVip state
      if (imageData.doll_id) formData.append('doll_id', imageData.doll_id);
      if (imageData.created_at) formData.append('created_at', imageData.created_at);

      const response = await imageApiService.uploadImage(formData, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 90) / progressEvent.total);
        setUploadProgress(10 + percentCompleted); // Start from 10%
      });

      setUploadProgress(100);
      setUploadState('success');
      setUploadedImageId(response.id);
      
      // Reset form
      setImageFile(null);
      setImageData({
        title: '',
        description: '',
        is_featured: false,
        is_vip: true,
        doll_id: selectedModel || '',
        created_at: '',
      });
      setIsVip(true);
      
      // Notify parent components
      if (onImageUploaded) onImageUploaded();
      if (fetchAllImages) await fetchAllImages();
      
      // Show success message
      toast.success('Image uploaded successfully!');
      
      // Reset after success
      setTimeout(() => {
        setUploadState('initial');
        setUploadProgress(0);
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadState('error');
      toast.error('Failed to upload image', {
        description: error.message || 'An error occurred while uploading the image.'
      });
    }
  };

  const resetUploadForm = () => {
    setImageData({
      title: '',
      description: '',
      is_featured: false,
      is_vip: true, // Reset to VIP by default
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
                  value={imageData.doll_id.toString()}
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
                  Image Description
                </label>
                <Textarea
                  value={imageData.description}
                  onChange={(e) => setImageData({...imageData, description: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>

              <div className="md:col-span-2">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="image">Image File</Label>
                    <div 
                      className={cn(
                        'mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                        isDragging ? 'border-metadite-primary bg-metadite-primary/5' : 'border-gray-300 dark:border-gray-700',
                        uploadState === 'uploading' && 'opacity-70 cursor-not-allowed'
                      )}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={handleButtonClick}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        {imageFile ? (
                          <>
                            <div className="relative w-16 h-16 rounded-md overflow-hidden">
                              <img 
                                src={URL.createObjectURL(imageFile)} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setImageFile(null);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {imageFile.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              Click to change or drag a new image
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-gray-400" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium text-metadite-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </>
                        )}
                      </div>
                      <Input 
                        id="image" 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*" 
                        onChange={handleFileChange} 
                        disabled={uploadState === 'uploading'}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="relative flex items-center">
                    <Switch 
                      id="featured" 
                      checked={imageData.is_featured} 
                      onCheckedChange={(checked) => setImageData(prev => ({ ...prev, is_featured: checked }))}
                      disabled={uploadState === 'uploading'}
                      className={`${imageData.is_featured ? 'bg-blue-500' : 'bg-gray-300'}`}
                    />
                    <Label htmlFor="featured" className="ml-2 flex items-center cursor-pointer">
                      <span className={imageData.is_featured ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-300'}>
                        Featured
                      </span>
                    </Label>
                    {imageData.is_featured && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Showcased on homepage
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Switch 
                              id="vip" 
                              checked={isVip} 
                              onCheckedChange={setIsVip}
                              disabled={uploadState === 'uploading'}
                              className={`${isVip ? 'bg-yellow-500' : 'bg-gray-300'}`}
                            />
                            <Label htmlFor="vip" className="ml-2 flex items-center cursor-pointer">
                              <Crown className={`h-4 w-4 mr-1.5 ${isVip ? 'text-yellow-500' : 'text-gray-400'}`} />
                              <span className={isVip ? 'text-yellow-600 dark:text-yellow-400 font-medium' : 'text-gray-600 dark:text-gray-300'}>
                                VIP Content
                              </span>
                            </Label>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>VIP content is only visible to subscribers</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {isVip && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Visible to subscribers only
                      </span>
                    )}
                  </div>
                </div>
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
              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  disabled={!imageFile || uploadState === 'uploading'}
                  className="flex-1 bg-metadite-primary hover:bg-metadite-primary/90 text-white"
                >
                  {uploadState === 'uploading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setImageFile(null);
                    setImageData({
                      title: '',
                      description: '',
                      is_featured: false,
                      doll_id: selectedModel || '',
                      created_at: '',
                    });
                    setUploadState('initial');
                    setUploadProgress(0);
                    setIsVip(true);
                  }}
                  disabled={uploadState === 'uploading'}
                >
                  Reset
                </Button>
              </div>
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
