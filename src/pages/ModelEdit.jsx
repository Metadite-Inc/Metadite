
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import StaffNavbar from '../components/StaffNavbar';
import StaffFooter from '../components/StaffFooter';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ModelImageUploader from '../components/ModelImageUploader';
import RegionSelector from '../components/admin/RegionSelector';

const ModelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
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
          available_regions: ['usa', 'canada', 'mexico', 'uk', 'eu', 'australia', 'new_zealand'], // Default to all regions
  });

  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [primaryImagePreview, setPrimaryImagePreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [removePrimaryImage, setRemovePrimaryImage] = useState(false);

  // Fetch model details on component mount
  useEffect(() => {
    const fetchModelDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const modelDetails = await apiService.getModelDetails(parseInt(id));
        
        if (modelDetails) {
          console.log('Received model details:', modelDetails);
          setModel(modelDetails);
          setFormData({
            name: modelDetails.name,
            description: modelDetails.longDescription,
            price: modelDetails.price.toString(),
            is_available: modelDetails.inStock,
            doll_category: modelDetails.category,
            doll_height: modelDetails.specifications.find(s => s.name === 'Height')?.value.replace(' CM', '') || '',
            doll_material: modelDetails.specifications.find(s => s.name === 'Material')?.value || '',
            doll_vaginal_depth: modelDetails.specifications.find(s => s.name === 'Vaginal Depth')?.value.replace(' CM', '') || '',
            doll_anal_depth: modelDetails.specifications.find(s => s.name === 'Anal Depth')?.value.replace(' CM', '') || '',
            doll_oral_depth: modelDetails.specifications.find(s => s.name === 'Oral Depth')?.value.replace(' CM', '') || '',
            doll_weight: modelDetails.specifications.find(s => s.name === 'Weight')?.value.replace(' KG', '') || '',
            doll_gross_weight: modelDetails.specifications.find(s => s.name === 'Gross Weight')?.value.replace(' KG', '') || '',
            doll_packing_size: modelDetails.specifications.find(s => s.name === 'Packing Size')?.value.replace(' CM', '') || '',
            doll_body_size: modelDetails.specifications.find(s => s.name === 'Body Size')?.value.replace(' CM', '') || '',
            available_regions: modelDetails.available_regions || ['usa', 'canada', 'mexico', 'uk', 'eu', 'australia', 'new_zealand'],
          });
          
          console.log('Set form data with regions:', modelDetails.available_regions || ['usa', 'canada', 'mexico', 'uk', 'eu', 'australia', 'new_zealand']);
          
          setPrimaryImagePreview(modelDetails.image);
          setExistingImages(modelDetails.gallery || []);
        } else {
          toast.error('Model not found');
          navigate('/admin');
        }
      } catch (error) {
        toast.error('Failed to fetch model details');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModelDetails();
  }, [id, navigate]);

  // Check admin access
  useEffect(() => {
    if (loading) return;
    
    if (!user || user.role !== 'admin') {
      navigate('/admin');
      return;
    }
  }, [user, loading, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.description) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (!formData.available_regions || formData.available_regions.length === 0) {
      toast.error("Region selection required", {
        description: "Please select at least one region where this model will be available.",
      });
      return;
    }

    try {
      setIsSaving(true);
      // Prepare the data for the API
      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        doll_height: parseFloat(formData.doll_height),
        doll_vaginal_depth: parseFloat(formData.doll_vaginal_depth),
        doll_anal_depth: parseFloat(formData.doll_anal_depth),
        doll_oral_depth: parseFloat(formData.doll_oral_depth),
        doll_weight: parseFloat(formData.doll_weight),
        doll_gross_weight: parseFloat(formData.doll_gross_weight),
        available_regions: formData.available_regions,
      };
      
      console.log('Sending update data:', updateData);
      
      await apiService.updateModel(parseInt(id), updateData);
      
      // Remove existing images that were marked for deletion
      if (imagesToRemove.length > 0) {
        for (const imageUrl of imagesToRemove) {
          await apiService.deleteModelImage(parseInt(id), imageUrl);
        }
      }
      
      // Remove primary image if marked for removal
      if (removePrimaryImage && model?.image) {
        await apiService.deleteModelImage(parseInt(id), model.image);
      }
      
      // If there are new images to upload
      if (primaryImageFile) {
        await apiService.uploadModelImage(parseInt(id), primaryImageFile, '', true);
      }
      if (additionalImages.length > 0) {
        const additionalFiles = additionalImages.map(img => img.file);
        await apiService.uploadModelImages(parseInt(id), additionalFiles);
      }
      navigate('/admin');
    } catch (error) {
      toast.error("Failed to update model");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAdditionalImage = (file) => {
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Images must be less than 20MB."
      });
      return;
    }

    const preview = URL.createObjectURL(file);
    setAdditionalImages([...additionalImages, { file, preview }]);
  };

  const handleRemoveAdditionalImage = (index) => {
    const newImages = [...additionalImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setImagesToRemove([...imagesToRemove, imageUrl]);
    setExistingImages(existingImages.filter(img => img !== imageUrl));
  };

  const handleRestoreExistingImage = (imageUrl) => {
    setImagesToRemove(imagesToRemove.filter(img => img !== imageUrl));
    setExistingImages([...existingImages, imageUrl]);
  };

  const handleRemovePrimaryImage = () => {
    setRemovePrimaryImage(true);
    setPrimaryImagePreview(null);
  };

  const handleRestorePrimaryImage = () => {
    setRemovePrimaryImage(false);
    setPrimaryImagePreview(model?.image || '');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <StaffNavbar />
        <div className={`flex-1 pt-20 pb-12 px-4 flex items-center justify-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-gray-100 to-white'
        }`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-metadite-primary mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading model details...</p>
          </div>
        </div>
        <StaffFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StaffNavbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-white via-gray-100 to-white'
      }`}>
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center text-metadite-primary hover:text-metadite-secondary transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Admin
            </button>
            <h1 className="text-2xl font-bold">Edit Model: {model?.name}</h1>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
              <h2 className="text-lg font-semibold">Model Details</h2>
            </div>

            <div className="p-6">
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className={`block text-sm font-medium mb-1 
                      ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                      Model Name*
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
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
                      value={formData.doll_category}
                      onValueChange={(value) => setFormData({...formData, doll_category: value})}
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
                      value={formData.doll_height}
                      onChange={(e) => setFormData({...formData, doll_height: e.target.value})}
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
                      value={formData.doll_material}
                      onChange={(e) => setFormData({...formData, doll_material: e.target.value})}
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
                      value={formData.doll_vaginal_depth}
                      onChange={(e) => setFormData({...formData, doll_vaginal_depth: e.target.value})}
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
                      value={formData.doll_anal_depth}
                      onChange={(e) => setFormData({...formData, doll_anal_depth: e.target.value})}
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
                      value={formData.doll_oral_depth}
                      onChange={(e) => setFormData({...formData, doll_oral_depth: e.target.value})}
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
                      value={formData.doll_weight}
                      onChange={(e) => setFormData({...formData, doll_weight: e.target.value})}
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
                      value={formData.doll_gross_weight}
                      onChange={(e) => setFormData({...formData, doll_gross_weight: e.target.value})}
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
                      value={formData.doll_packing_size}
                      onChange={(e) => setFormData({...formData, doll_packing_size: e.target.value})}
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
                      value={formData.doll_body_size}
                      onChange={(e) => setFormData({...formData, doll_body_size: e.target.value})}
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
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={formData.is_available}
                        onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                        className="rounded text-metadite-primary focus:ring-metadite-primary h-4 w-4"
                      />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                        Available for purchase
                      </span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <RegionSelector
                      selectedRegions={formData.available_regions}
                      onRegionsChange={(regions) => {
                        console.log('Regions changed to:', regions);
                        setFormData({...formData, available_regions: regions});
                      }}
                      label="Available Regions"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="border-t pt-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Update Images</h3>
                  
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-2">Primary Image</h4>
                    
                    {/* Current Primary Image */}
                    {primaryImagePreview && !removePrimaryImage && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Current Primary Image:</p>
                        <div className="relative inline-block">
                          <img 
                            src={primaryImagePreview} 
                            alt="Current Primary" 
                            className="w-full max-w-[200px] h-[150px] object-cover rounded border border-gray-200" 
                          />
                          <button 
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            onClick={handleRemovePrimaryImage}
                            title="Remove primary image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Primary Image Marked for Removal */}
                    {removePrimaryImage && model?.image && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Primary image to be removed:</p>
                        <div className="relative inline-block">
                          <img 
                            src={model.image} 
                            alt="Primary to Remove" 
                            className="w-full max-w-[200px] h-[150px] object-cover rounded border-2 border-red-300 opacity-60" 
                          />
                          <button 
                            type="button"
                            className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors"
                            onClick={handleRestorePrimaryImage}
                            title="Restore primary image"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Will be removed</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upload New Primary Image */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Upload New Primary Image:</p>
                      <ModelImageUploader
                        onImageChange={(file) => {
                          if (file && file.size > 20 * 1024 * 1024) {
                            toast.error("Image too large", {
                              description: "Images must be less than 20MB."
                            });
                            return;
                          }
                          setPrimaryImageFile(file);
                          // If user uploads a new image, unmark removal
                          setRemovePrimaryImage(false);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-2">Additional Images</h4>
                    
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Current Images:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {existingImages.map((imageUrl, index) => (
                            <div key={`existing-${index}`} className="relative">
                              <img 
                                src={imageUrl} 
                                alt={`Existing ${index + 1}`} 
                                className="w-full h-[120px] object-cover rounded border border-gray-200" 
                              />
                              <button 
                                type="button"
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                onClick={() => handleRemoveExistingImage(imageUrl)}
                                title="Remove image"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Images Marked for Removal */}
                    {imagesToRemove.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Images to be removed:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {imagesToRemove.map((imageUrl, index) => (
                            <div key={`remove-${index}`} className="relative">
                              <img 
                                src={imageUrl} 
                                alt={`To Remove ${index + 1}`} 
                                className="w-full h-[120px] object-cover rounded border-2 border-red-300 opacity-60" 
                              />
                              <button 
                                type="button"
                                className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 hover:bg-green-600 transition-colors"
                                onClick={() => handleRestoreExistingImage(imageUrl)}
                                title="Restore image"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Will be removed</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Images to Add */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Add New Images:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {additionalImages.map((img, index) => (
                          <div key={`new-${index}`} className="relative">
                            <img 
                              src={img.preview} 
                              alt={`New ${index + 1}`} 
                              className="w-full h-[120px] object-cover rounded border border-gray-200" 
                            />
                            <button 
                              type="button"
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              onClick={() => handleRemoveAdditionalImage(index)}
                              title="Remove new image"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        
                        <label className="border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer h-[120px] hover:border-metadite-primary transition-colors">
                          <div className="text-center">
                            <Plus className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                            <span className="text-sm text-gray-500">Add Image</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleAddAdditionalImage(e.target.files[0]);
                                e.target.value = '';
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex items-center px-4 py-2 rounded-md text-white transition-opacity ${
                      isSaving 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-metadite-primary to-metadite-secondary hover:opacity-90'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <StaffFooter />
    </div>
  );
};

export default ModelEdit;
