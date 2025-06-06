
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { moderatorApiService } from '../../lib/api/moderator_api';
import { Users, Bot, Search, Filter, Loader2, UserCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminAssignmentsView = () => {
  const { theme } = useTheme();
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  useEffect(() => {
    loadModerators();
  }, []);

  const loadModerators = async () => {
    try {
      setLoading(true);
      // Get all moderators for admin view
      const moderatorData = await moderatorApiService.getModerators();
      
      // Fetch assigned models for each moderator
      const moderatorsWithModels = await Promise.all(
        moderatorData.map(async (moderator) => {
          try {
            const assignedModels = await moderatorApiService.getDollsAssignedToModerator(moderator.id);
            return {
              ...moderator,
              assignedModels: assignedModels || []
            };
          } catch (error) {
            console.error(`Error fetching models for moderator ${moderator.id}:`, error);
            return {
              ...moderator,
              assignedModels: []
            };
          }
        })
      );
      
      setModerators(moderatorsWithModels);
    } catch (error) {
      console.error('Error loading moderators:', error);
      toast.error('Failed to load moderator assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignModel = async (moderatorId, modelId) => {
    if (window.confirm('Are you sure you want to unassign this model?')) {
      try {
        await moderatorApiService.unassignDollFromModerator(moderatorId, modelId);
        // Reload the data to reflect changes
        loadModerators();
      } catch (error) {
        console.error('Error unassigning model:', error);
      }
    }
  };

  const filteredModerators = moderators.filter(moderator => {
    const matchesSearch = moderator.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         moderator.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterActive === 'active') return matchesSearch && moderator.is_active;
    if (filterActive === 'inactive') return matchesSearch && !moderator.is_active;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-12 w-12 text-metadite-primary animate-spin" />
        <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading moderator assignments...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mr-6">
              <Users className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Moderator Assignments</h1>
              <p className="opacity-90 text-lg">Manage model assignments for moderators</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{moderators.length}</div>
            <div className="opacity-80">Total Moderators</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search moderators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-metadite-primary`}
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterActive(filter)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors capitalize ${
                  filterActive === filter
                    ? 'bg-metadite-primary text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Moderator Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModerators.map((moderator) => (
          <div
            key={moderator.id}
            className={`glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
              theme === 'dark' ? 'bg-gray-800/70' : ''
            }`}
          >
            {/* Moderator Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    moderator.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {moderator.full_name}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {moderator.email}
                    </p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  moderator.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {moderator.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  Region: {moderator.region}
                </span>
                <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Bot className="h-4 w-4 mr-1" />
                  {moderator.assignedModels?.length || 0} Models
                </span>
              </div>
            </div>

            {/* Assigned Models */}
            <div className="p-6">
              <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Assigned Models
              </h4>
              
              {moderator.assignedModels?.length > 0 ? (
                <div className="space-y-3">
                  {moderator.assignedModels.map((model) => (
                    <div
                      key={model.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                          {model.image_url ? (
                            <img
                              src={model.image_url}
                              alt={model.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/40x40?text=M';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-metadite-primary to-metadite-secondary flex items-center justify-center">
                              <Bot className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {model.name}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            ID: {model.id}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleUnassignModel(moderator.id, model.id)}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                        title="Unassign model"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No models assigned</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredModerators.length === 0 && (
        <div className={`glass-card rounded-xl p-12 text-center ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <Users className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            No moderators found
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {searchTerm ? 'Try adjusting your search terms.' : 'No moderators have been created yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminAssignmentsView;
