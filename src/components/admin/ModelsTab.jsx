import React, { useState, useEffect } from 'react';
import { PackagePlus, Search, Edit, Trash2, Image } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ModelImageUploader from '../ModelImageUploader';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../lib/api';

// Mock data for moderators
const moderators = [
  { id: 1, name: 'Anita Jones', email: 'anita.moderator@metadite.com', assignedModels: ['Sophia Elegance', 'Victoria Vintage'], status: 'Active' },
  { id: 2, name: 'Michael Brown', email: 'michael.moderator@metadite.com', assignedModels: ['Modern Mila'], status: 'Active' },
  { id: 3, name: 'Sarah Smith', email: 'sarah.moderator@metadite.com', assignedModels: [], status: 'Inactive' }
];

const ModelsTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  // State for models
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newModelData, setNewModelData] = useState({
    name: '',
    description: '',
    price: '',
    stock: 0,
    is_available: true,
    doll_category: 'premium',
    doll_height: 0,
    doll_material: '',
    doll_origin: '',
    doll_articulation: '',
    doll_hair_type: '',
  });
  
  // For drag-and-drop image upload
  const [modelImageFile, setModelImageFile] = useState(null);
  const [modelImagePreview, setModelImagePreview] = useState(null);
  
  // Fetch models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const modelsData = await apiService.getModels();
        setModels(modelsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching models:", error);
        setLoading(false);
      }
    };
    
    fetchModels();
  }, []);
  
  // Handle adding a new model
  const handleAddModel = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!newModelData.name || !newModelData.price || !newModelData.description) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }
    try {
      // Prepare model data for API
      const modelData = {
        name: newModelData.name,
        description: newModelData.description,
        price: parseFloat(newModelData.price),
        stock: parseInt(newModelData.stock),
        is_available: newModelData.is_available,
        doll_category: newModelData.doll_category,
        doll_height: parseFloat(newModelData.doll_height),
        doll_material: newModelData.doll_material,
        doll_origin: newModelData.doll_origin,
        doll_articulation: newModelData.doll_articulation,
        doll_hair_type: newModelData.doll_hair_type,
      };

      // Create the model
      const createdModel = await apiService.createModel(modelData);
      
      if (createdModel && modelImageFile) {
        // Upload the image for the newly created model
        await apiService.uploadModelImage(createdModel.id, modelImageFile, newModelData.name, true);
        
        // Update the model with image URL
        createdModel.image = modelImagePreview;
      }
      
      // Update models list with the new model
      setModels(prevModels => [...prevModels, createdModel]);
      
      // Reset form
      setNewModelData({
        name: '',
        description: '',
        price: '',
        stock: 0,
        is_available: true,
        doll_category: 'premium',
        doll_height: 0,
        doll_material: '',
        doll_origin: '',
        doll_articulation: '',
        doll_hair_type: '',
      });
      setModelImageFile(null);
      setModelImagePreview(null);
      
    } catch (err) {
      toast.error("Failed to add model", { description: err.message });
    }
  };
  
  // Handle deleting a model
  const handleDeleteModel = async (modelId) => {
    try {
      await apiService.deleteModel(modelId);
      // Remove the model from the state
      setModels(models.filter(model => model.id !== modelId));
    } catch (error) {
      toast.error("Failed to delete model");
    }
  };

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="glass-card rounded-xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
          <h2 className="text-lg font-semibold">Add New Model</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleAddModel}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                  Stock*
                </label>
                <input
                  type="number"
                  value={newModelData.stock}
                  onChange={(e) => setNewModelData({...newModelData, stock: parseInt(e.target.value) || 0})}
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
                    <SelectItem value="limited">Limited Edition</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Height (inches)*
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
                  Origin*
                </label>
                <input
                  type="text"
                  value={newModelData.doll_origin}
                  onChange={(e) => setNewModelData({...newModelData, doll_origin: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Articulation*
                </label>
                <input
                  type="text"
                  value={newModelData.doll_articulation}
                  onChange={(e) => setNewModelData({...newModelData, doll_articulation: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Hair Type*
                </label>
                <input
                  type="text"
                  value={newModelData.doll_hair_type}
                  onChange={(e) => setNewModelData({...newModelData, doll_hair_type: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Image*</label>
                <ModelImageUploader 
                  onImageChange={file => {
                    setModelImageFile(file);
                    setModelImagePreview(file ? URL.createObjectURL(file) : null);
                  }}
                />
                {modelImagePreview && (
                  <img src={modelImagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 150, margin: '8px 0' }} />
                )}
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
                <PackagePlus className="h-4 w-4 mr-2" />
                Add Model
              </button>
            </div>
          </form>
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
                {models
                  .filter(model => 
                    model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    model.description?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((model) => (
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
                      {model.assignedModerator ? model.assignedModerator : 'None assigned'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => handleDeleteModel(model.id)}
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
      </div>
    </div>
  );
};

export default ModelsTab;