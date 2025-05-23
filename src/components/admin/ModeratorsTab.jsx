import React, { useState, useEffect } from 'react';
import { Users, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';
import { adminApiService } from '../../lib/api/admin_api';
import { moderatorApiService } from '../../lib/api/moderator_api';

const ModeratorsTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [selectedModels, setSelectedModels] = useState([]);
  const [passwordError, setPasswordError] = useState('');
  const [newModeratorData, setNewModeratorData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [assignedDolls, setAssignedDolls] = useState({});
  
  // Fetch moderators and models on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch moderators
        const moderatorsData = await adminApiService.getModerators();
        setModerators(moderatorsData || []);
        setLoading(false);
        
        // Fetch models for assignment
        const modelsData = await moderatorApiService.getModelsForAssignment();
        setModels(modelsData || []);
        setModelsLoading(false);

        // Fetch assigned dolls for each moderator
        if (moderatorsData && moderatorsData.length > 0) {
          const dollsMap = {};
          await Promise.all(
            moderatorsData.map(async (mod) => {
              try {
                const dolls = await moderatorApiService.getDollsAssignedToModerator(mod.id);
                dollsMap[mod.id] = dolls || [];
              } catch (error) {
                console.error(`Failed to fetch dolls for moderator ${mod.id}:`, error);
                dollsMap[mod.id] = [];
              }
            })
          );
          setAssignedDolls(dollsMap);
        }
      } catch (error) {
        toast.error("Failed to load data", {
          description: error instanceof Error ? error.message : "Unknown error occurred",
        });
        setLoading(false);
        setModelsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleModelSelection = (modelId) => {
    setSelectedModels(prevSelected => {
      if (prevSelected.includes(modelId)) {
        return prevSelected.filter(id => id !== modelId);
      } else {
        return [...prevSelected, modelId];
      }
    });
  };
  
  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };
  
  const handleAddModerator = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (!validatePassword(newModeratorData.password)) {
      return;
    }
    
    try {
      await adminApiService.createModerator({
        email: newModeratorData.email,
        full_name: newModeratorData.name,
        region: "Asia", // Default value or could be added to form
        role: "moderator",
        membership_level: "standard",
        is_active: true,
        video_access_count: 0,
        assigned_dolls: selectedModels,
        password: newModeratorData.password
      });
      
      // Refresh moderators list after adding
      const updatedModerators = await adminApiService.getModerators();
      setModerators(updatedModerators || []);
      
      // Reset form
      setNewModeratorData({
        name: '',
        email: '',
        password: ''
      });
      setSelectedModels([]);
      setPasswordError('');
    } catch (error) {
      toast.error("Failed to add moderator", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handleDeleteModerator = async (moderatorId) => {
    if (window.confirm("Are you sure you want to delete this moderator?")) {
      try {
        await adminApiService.deleteModerator(moderatorId);
        // Remove the deleted moderator from state
        setModerators(moderators.filter(mod => mod.id !== moderatorId));
      } catch (error) {
        toast.error("Failed to delete moderator", {
          description: error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    }
  };

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="glass-card rounded-xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
          <h2 className="text-lg font-semibold">Add New Moderator</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleAddModerator}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={newModeratorData.name}
                  onChange={(e) => setNewModeratorData({...newModeratorData, name: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={newModeratorData.email}
                  onChange={(e) => setNewModeratorData({...newModeratorData, email: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Password
                </label>
                <input
                  type="password"
                  value={newModeratorData.password}
                  onChange={(e) => {
                    setNewModeratorData({...newModeratorData, password: e.target.value});
                    if (e.target.value.length > 0) {
                      validatePassword(e.target.value);
                    } else {
                      setPasswordError('');
                    }
                  }}
                  className={`block w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary`}
                  required
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {passwordError}
                  </p>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Assign Models
                </label>
                <div className={`mt-2 p-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'} rounded-md max-h-40 overflow-y-auto`}>
                  {modelsLoading ? (
                    <div className="text-center py-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-metadite-primary mx-auto"></div>
                      <p className="text-xs mt-1">Loading models...</p>
                    </div>
                  ) : models.length > 0 ? (
                    <div className="space-y-2">
                      {models.map((model) => (
                        <div key={model.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`model-${model.id}`}
                            checked={selectedModels.includes(model.id)}
                            onChange={() => handleModelSelection(model.id)}
                            className="mr-2 h-4 w-4 text-metadite-primary focus:ring-metadite-primary border-gray-300 rounded"
                          />
                          <label 
                            htmlFor={`model-${model.id}`}
                            className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                          >
                            {model.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">No models available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                className="flex items-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                <Users className="h-4 w-4 mr-2" />
                Add Moderator
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold">Manage Moderators</h2>
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search moderators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-metadite-primary mx-auto mb-2"></div>
            <p className="text-gray-500">Loading moderators...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={`text-left text-gray-500 text-sm 
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Assigned Models</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {moderators
                  .filter(mod => 
                    mod.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    mod.email?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((mod) => (
                  <tr key={mod.id} className={`border-t border-gray-100 transition-colors 
                    ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    >
                    <td className="px-6 py-4 font-medium">{mod.full_name}</td>
                    <td className="px-6 py-4">{mod.email}</td>
                    <td className="px-6 py-4">
                      {assignedDolls[mod.id] && assignedDolls[mod.id].length > 0
                        ? assignedDolls[mod.id].map(doll => doll.name).join(', ')
                        : 'None assigned'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteModerator(mod.id)} 
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && moderators.length === 0 && (
          <div className="text-center py-10">
            <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No moderators found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorsTab;
