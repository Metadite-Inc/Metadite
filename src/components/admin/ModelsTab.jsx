import React, { useState, useEffect } from 'react';
import { PackagePlus, Search, Edit, Trash2, Image, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ModelImageUploader from '../ModelImageUploader';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../lib/api';

const ModelsTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalModels, setTotalModels] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const modelsPerPage = 10;

  const [newModelData, setNewModelData] = useState({
    name: '',
    description: '',
    price: '',
    is_available: true,
    doll_category: 'standard',
    doll_height: '',
    doll_vaginal_depth: '',
    doll_material: '',
    doll_anal_depth: '',
    doll_oral_depth: '',
    doll_weight: '',
    doll_gross_weight: '',
    doll_packing_size: '',
    doll_body_size: '',
  });

  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [primaryImagePreview, setPrimaryImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [createdModelId, setCreatedModelId] = useState(null);

  // Fetch models with the new pagination API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const skip = (currentPage - 1) * modelsPerPage;

        const response = await apiService.getModels(skip, modelsPerPage);

        setModels(response.data);
        setTotalModels(response.total);
        setTotalPages(Math.max(1, Math.ceil(response.total / modelsPerPage)));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching models:", error);
        setLoading(false);
      }
    };

    fetchModels();
  }, [currentPage, searchTerm]);

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!newModelData.name || !newModelData.price || !newModelData.description) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const createdModel = await apiService.createModel(newModelData);
      if (createdModel) {
        setCreatedModelId(createdModel.id);
        toast.success("Model details saved successfully!");
      }
    } catch (err) {
      toast.error("Failed to save model details", { description: err.message });
    }
  };

  const handleAddAdditionalImage = (file) => {
    if (!file) return;

    // Check if image is larger than 20MB
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Images must be less than 20MB."
      });
      return;
    }

    const preview = URL.createObjectURL(file);
    setAdditionalImages([...additionalImages, { file, preview }]);
  };

  const handleAddMultipleImages = (files) => {
    const validFiles = Array.from(files).filter(file => {
      // Check if image is larger than 20MB
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`Image ${file.name} is too large`, {
          description: "Images must be less than 20MB."
        });
        return false;
      }
      return true;
    });

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setAdditionalImages([...additionalImages, ...newImages]);
  };

  const handleRemoveAdditionalImage = (index) => {
    const newImages = [...additionalImages];
    URL.revokeObjectURL(newImages[index].preview); // Clean up the URL object
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleAddMultipleImages(files);
    }
  };

  const handleUploadImages = async () => {
    if (!primaryImageFile || !createdModelId) {
      toast.error("Please upload a primary image and ensure the model details are saved.");
      return;
    }

    try {
      // First upload the primary image
      const primarySuccess = await apiService.uploadModelImage(createdModelId, primaryImageFile, '', true);
      
      if (!primarySuccess) {
        throw new Error("Failed to upload primary image");
      }
      
      // Then upload additional images if there are any
      if (additionalImages.length > 0) {
        const additionalFiles = additionalImages.map(img => img.file);
        const additionalSuccess = await apiService.uploadModelImages(createdModelId, additionalFiles);
        
        if (!additionalSuccess) {
          toast.warning("Primary image uploaded, but there was an issue with additional images");
          return;
        }
      }
      
      toast.success("All images uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload images", { description: err.message });
    }
  };

  // Handle model creation success
  const handleModelCreated = async () => {
    // Reset form and state
    setNewModelData({
      name: '',
      description: '',
      price: 0,
      is_available: true,
      doll_category: 'premium',
      doll_height: 0,
      doll_vaginal_depth: 0,
      doll_anal_depth: 0,
      doll_oral_depth: 0,
      doll_weight: 0,
      doll_gross_weight: 0,
      doll_packing_size: '',
      doll_body_size: '',
    });
    setPrimaryImageFile(null);
    setPrimaryImagePreview(null);
    setAdditionalImages([]);
    setCreatedModelId(null);

    // Refresh the models list with the first page
    setCurrentPage(1);
    setLoading(true);
    try {
      const skip = 0; // First page
      const response = await apiService.getModels(skip, modelsPerPage, searchTerm); // Pass searchTerm to the API
      setModels(response.data);
      setTotalModels(response.total);
      setTotalPages(Math.ceil(response.total / modelsPerPage));
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }

    toast.success("Model added successfully!");
  };

  // Handle model deletion
  const handleDeleteModel = async (modelId) => {
    try {
      await apiService.deleteModel(modelId);
      
      // Refresh the current page
      setLoading(true);
      const skip = (currentPage - 1) * modelsPerPage;
      const response = await apiService.getModels(skip, modelsPerPage, searchTerm); // Pass searchTerm to the API
      
      // If the current page is now empty (except for the last page), go to the previous page
      if (response.data.length === 0 && currentPage > 1) {
        setCurrentPage(Math.max(currentPage - 1, 1)); // Ensure currentPage doesn't go below 1
      } else {
        setModels(response.data);
        setTotalModels(response.total);
        setTotalPages(Math.ceil(response.total / modelsPerPage));
        setLoading(false);
      }
      
      toast.success("Model deleted successfully");
    } catch (error) {
      toast.error("Failed to delete model");
      setLoading(false);
    }
  };

  // Change page handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    }
  };

  useEffect(() => {
    const fetchModelsAndModerators = async () => {
      try {
        setLoading(true);
        const skip = (currentPage - 1) * modelsPerPage;
        const response = await apiService.getModels(skip, modelsPerPage);

        setModels(response.data);
        setTotalModels(response.total);
        setTotalPages(Math.max(1, Math.ceil(response.total / modelsPerPage)));

        // Removed moderator fetching to prevent 404 errors
        setLoading(false);
      } catch (error) {
        console.error("Error fetching models:", error);
        setLoading(false);
      }
    };

    fetchModelsAndModerators();
  }, [currentPage, searchTerm]);

  // Handle edit button click
  const handleEditModel = (modelId) => {
    console.log('Edit button clicked for model ID:', modelId);
    console.log('Navigating to:', `/admin/model/edit/${modelId}`);
    navigate(`/admin/model/edit/${modelId}`);
  };

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="glass-card rounded-xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
          <h2 className="text-lg font-semibold">Add New Model</h2>
        </div>

        <div className="p-6">
          {!createdModelId ? (
            <form onSubmit={handleSaveDetails}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Release Date*
                  </label>
                  <input
                    type="date"
                    value={newModelData.created_at}
                    onChange={e => setNewModelData({ ...newModelData, created_at: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Model Name*
                  </label>
                  <input
                    type="text"
                    value={newModelData.name}
                    onChange={(e) => setNewModelData({...newModelData, name: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Price*
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newModelData.price}
                    onChange={(e) => setNewModelData({...newModelData, price: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <Select
                    value={newModelData.doll_category}
                    onValueChange={(value) => setNewModelData({...newModelData, doll_category: value})}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="limited_edition">Limited Edition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Height (CM)*
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newModelData.doll_height}
                    onChange={(e) => setNewModelData({...newModelData, doll_height: parseFloat(e.target.value) || 0})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Material*
                  </label>
                  <input
                    type="text"
                    value={newModelData.doll_material}
                    onChange={(e) => setNewModelData({...newModelData, doll_material: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Vaginal Depth (CM)*
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newModelData.doll_vaginal_depth}
                    onChange={(e) => setNewModelData({...newModelData, doll_vaginal_depth: parseFloat(e.target.value) || 0})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Anal Depth (CM)*
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newModelData.doll_anal_depth}
                    onChange={(e) => setNewModelData({...newModelData, doll_anal_depth: parseFloat(e.target.value) || 0})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Oral Depth (CM)*
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newModelData.doll_oral_depth}
                    onChange={(e) => setNewModelData({...newModelData, doll_oral_depth: parseFloat(e.target.value) || 0})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Weight (KG)*
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newModelData.doll_weight}
                    onChange={(e) => setNewModelData({...newModelData, doll_weight: parseFloat(e.target.value) || 0})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Gross Weight (KG)*
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newModelData.doll_gross_weight}
                    onChange={(e) => setNewModelData({...newModelData, doll_gross_weight: parseFloat(e.target.value) || 0})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Packing Size (CM)*
                  </label>
                  <input
                    type="text"
                    value={newModelData.doll_packing_size}
                    onChange={(e) => setNewModelData({...newModelData, doll_packing_size: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Body Size (CM)*
                  </label>
                  <input
                    type="text"
                    value={newModelData.doll_body_size}
                    onChange={(e) => setNewModelData({...newModelData, doll_body_size: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-1 
                    ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Description*
                  </label>
                  <Textarea
                    value={newModelData.description}
                    onChange={(e) => setNewModelData({...newModelData, description: e.target.value})}
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={newModelData.is_available}
                      onChange={(e) => setNewModelData({...newModelData, is_available: e.target.checked})}
                      className="rounded text-metadite-primary focus:ring-metadite-primary h-4 w-4"
                    />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Available for purchase
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  Save Details
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">Upload Model Images</h3>
              
              <div className="mb-6">
                <h4 className="text-md font-medium mb-2">Primary Image</h4>
                <ModelImageUploader
                  onImageChange={(file) => {
                    // Check if image is larger than 20MB
                    if (file && file.size > 20 * 1024 * 1024) {
                      toast.error("Image too large", {
                        description: "Images must be less than 20MB."
                      });
                      return;
                    }
                    setPrimaryImageFile(file);
                    setPrimaryImagePreview(file ? URL.createObjectURL(file) : null);
                  }}
                />
                {primaryImagePreview && (
                  <div className="mt-2 relative inline-block">
                    <img 
                      src={primaryImagePreview} 
                      alt="Primary Preview" 
                      className="max-w-[150px] max-h-[150px] rounded border border-gray-200" 
                    />
                    <button 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      onClick={() => {
                        URL.revokeObjectURL(primaryImagePreview);
                        setPrimaryImageFile(null);
                        setPrimaryImagePreview(null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h4 className="text-md font-medium mb-2">Additional Images</h4>
                <div 
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {additionalImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={img.preview} 
                        alt={`Additional ${index + 1}`} 
                        className="w-full h-[120px] object-cover rounded border border-gray-200" 
                      />
                      <button 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        onClick={() => handleRemoveAdditionalImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  
                  <label 
                    className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer h-[120px] hover:border-metadite-primary transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <Plus className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                      <span className="text-sm text-gray-500">Add Image</span>
                      <span className="text-xs text-gray-400 block mt-1">or drag & drop multiple images</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.length > 0) {
                          handleAddMultipleImages(e.target.files);
                          e.target.value = ''; // Reset input value for reuse
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={handleUploadImages}
                  disabled={!primaryImageFile}
                  className={`flex items-center ${!primaryImageFile ? 'bg-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-metadite-primary to-metadite-secondary hover:opacity-90'} text-white px-4 py-2 rounded-md transition-opacity`}
                >
                  Upload Images
                </button>
                <button
                  onClick={handleModelCreated}
                  className="flex items-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  Add Model
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold">Manage Models</h2>
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-metadite-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading models...</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className={`text-left text-gray-500 text-sm 
                  ${theme === 'dark' ? 'bg-gray-100' : 'bg-gray-50'}`}>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Assigned Moderator</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id} className={`border-t border-gray-100 transition-colors 
                    ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    >
                    <td className="px-6 py-4">
                      <img 
                        src={model.image || 'https://via.placeholder.com/150'} 
                        alt={model.name} 
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{model.name}</td>
                    <td className="px-6 py-4">${model.price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        model.category === 'premium' || model.category === 'Premium' 
                          ? 'bg-purple-100 text-purple-700' 
                          : model.category === 'limited' || model.category === 'Limited Edition'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {model.category.charAt(0).toUpperCase() + model.category.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {/* Removed assigned moderator display */}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                          onClick={() => {
                            console.log('Model data:', model);
                            handleEditModel(model.id);
                          }}
                          title="Edit Model"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => handleDeleteModel(model.id)}
                          title="Delete Model"
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
        
        {!loading && models.length === 0 && (
          <div className="text-center py-10">
            <PackagePlus className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No models found.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && models.length > 0 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Showing {totalModels > 0 ? (currentPage - 1) * modelsPerPage + 1 : 0}-{Math.min(currentPage * modelsPerPage, totalModels)} of {totalModels} models
            </div>
            <div className="flex space-x-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage <= 1}
                className={`flex items-center px-3 py-1 rounded-md ${
                  currentPage <= 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-metadite-primary bg-opacity-10 text-metadite-primary hover:bg-opacity-20'
                } transition-colors`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <div className={`px-4 py-1 rounded-md bg-gray-100 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-800'}`}>
                {currentPage} of {totalPages || 1}
              </div>
              <button
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
                className={`flex items-center px-3 py-1 rounded-md ${
                  currentPage >= totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-metadite-primary bg-opacity-10 text-metadite-primary hover:bg-opacity-20'
                } transition-colors`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsTab;
