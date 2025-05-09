import React, { useState, useEffect } from 'react';
import SlideshowManager from '../SlideshowManager';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../lib/api';
import { Search, Edit, Trash2, PackagePlus } from 'lucide-react';
import { toast } from 'sonner';

const SlideshowTab = ({ isLoaded }) => {
  const { user } = useAuth ? useAuth() : { user: null };
  const { theme } = useTheme();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const modelsData = await apiService.getModels();
        setModels(modelsData);
      } catch (error) {
        toast.error('Failed to fetch models');
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  const handleDeleteModel = async (modelId) => {
    try {
      await apiService.deleteModel(modelId);
      setModels(models.filter(model => model.id !== modelId));
      toast.success('Model deleted successfully');
    } catch (error) {
      toast.error('Failed to delete model');
    }
  };

  return (
    <div className={`glass-card rounded-xl p-10 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <h2 className="text-xl font-semibold mb-2 text-center">Slideshow Management</h2>
      <p className="text-gray-500 mb-4 text-center">Upload, remove, and manage slideshow images, GIFs, and videos for the homepage slideshow.</p>
      <div className="mt-10 mb-14">
        <SlideshowManager isLoaded={isLoaded} />
      </div>
      {/* Model Management Section */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold">Manage Slideshow Models</h2>
          {/*<div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
            />
          </div>*/}
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
                <tr className={`text-left text-gray-500 text-sm ${theme === 'dark' ? 'bg-gray-100' : 'bg-gray-50'}`}>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3">Name</th>
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
                    <tr key={model.id} className={`border-t border-gray-100 transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <img
                          src={model.image || 'https://via.placeholder.com/150'}
                          alt={model.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium">{model.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:text-blue-700 transition-colors" disabled>
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

export default SlideshowTab;
