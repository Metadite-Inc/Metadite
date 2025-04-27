
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PackagePlus, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { toast } from 'sonner';

interface ModelFormData {
  name: string;
  price: string;
  category: string;
  assignedModerator: string;
  description: string;
  doll_height: string;
  material: string;
  origin: string;
  articulation: string;
  hair_type: string;
  images: string[];
}

const ModelForm = ({ onSubmit }: { onSubmit: (data: ModelFormData) => void }) => {
  const { theme } = useTheme();
  const [modelData, setModelData] = useState<ModelFormData>({
    name: '',
    price: '',
    category: 'Standard',
    assignedModerator: '',
    description: '',
    doll_height: '',
    material: '',
    origin: '',
    articulation: '',
    hair_type: '',
    images: []
  });

  const handleImageAdd = (url: string) => {
    if (modelData.images.length >= 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setModelData({
      ...modelData,
      images: [...modelData.images, url]
    });
  };

  const handleRemoveImage = (index: number) => {
    setModelData({
      ...modelData,
      images: modelData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(modelData);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
        <h2 className="text-lg font-semibold">Add New Model</h2>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={`block text-sm font-medium mb-1 
                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Model Name*
              </label>
              <input
                type="text"
                value={modelData.name}
                onChange={(e) => setModelData({...modelData, name: e.target.value})}
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
                value={modelData.price}
                onChange={(e) => setModelData({...modelData, price: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 
                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Doll Height (cm)*
              </label>
              <input
                type="number"
                value={modelData.doll_height}
                onChange={(e) => setModelData({...modelData, doll_height: e.target.value})}
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
                value={modelData.material}
                onChange={(e) => setModelData({...modelData, material: e.target.value})}
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
                value={modelData.origin}
                onChange={(e) => setModelData({...modelData, origin: e.target.value})}
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
                value={modelData.articulation}
                onChange={(e) => setModelData({...modelData, articulation: e.target.value})}
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
                value={modelData.hair_type}
                onChange={(e) => setModelData({...modelData, hair_type: e.target.value})}
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
                value={modelData.category}
                onValueChange={(value) => setModelData({...modelData, category: value})}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Limited Edition">Limited Edition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 
                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Moderator Email
              </label>
              <input
                type="email"
                value={modelData.assignedModerator}
                onChange={(e) => setModelData({...modelData, assignedModerator: e.target.value})}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                placeholder="moderator@example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-1 
                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Images (up to 5)*
              </label>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {modelData.images.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Model ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {modelData.images.length < 5 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md">
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Enter image URL:');
                        if (url) handleImageAdd(url);
                      }}
                      className="flex flex-col items-center text-gray-600 hover:text-gray-800"
                    >
                      <ImageIcon className="h-8 w-8 mb-2" />
                      <span className="text-sm">Add Image</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-1 
                ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                Description*
              </label>
              <Textarea
                value={modelData.description}
                onChange={(e) => setModelData({...modelData, description: e.target.value})}
                className="min-h-[100px]"
                required
              />
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
  );
};

export default ModelForm;
