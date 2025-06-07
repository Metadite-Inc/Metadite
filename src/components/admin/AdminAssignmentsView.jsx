
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { moderatorApiService } from '../../lib/api/moderator_api';
import { Users, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ModeratorCard from './assignments/ModeratorCard';
import ModeratorEditModal from './assignments/ModeratorEditModal';

const AdminAssignmentsView = () => {
  const { theme } = useTheme();
  const [moderators, setModerators] = useState([]);
  const [unassignedModels, setUnassignedModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedModerator, setSelectedModerator] = useState(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadModerators(), loadUnassignedModels()]);
  };

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

  const loadUnassignedModels = async () => {
    try {
      const unassigned = await moderatorApiService.getUnassignedDolls(0, 50);
      setUnassignedModels(unassigned || []);
    } catch (error) {
      console.error('Error loading unassigned models:', error);
      toast.error('Failed to load unassigned models');
    }
  };

  const handleUnassignModel = async (moderatorId, modelId) => {
    if (window.confirm('Are you sure you want to unassign this model?')) {
      try {
        await moderatorApiService.unassignDollFromModerator(moderatorId, modelId);
        toast.success('Model unassigned successfully');
        // Reload the data to reflect changes
        loadData();
      } catch (error) {
        console.error('Error unassigning model:', error);
        toast.error('Failed to unassign model');
      }
    }
  };

  const handleAssignModel = async (modelId) => {
    if (!selectedModerator) return;
    
    setAssigning(true);
    try {
      await moderatorApiService.assignDollToModerator(selectedModerator.id, modelId);
      setEditModalOpen(false);
      setSelectedModerator(null);
      toast.success('Model assigned successfully');
      // Reload the data to reflect changes
      loadData();
    } catch (error) {
      console.error('Error assigning model:', error);
      toast.error('Failed to assign model');
    } finally {
      setAssigning(false);
    }
  };

  const openEditModal = (moderator) => {
    setSelectedModerator(moderator);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedModerator(null);
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
          <ModeratorCard
            key={moderator.id}
            moderator={moderator}
            theme={theme}
            onUnassignModel={handleUnassignModel}
            onEditModerator={openEditModal}
          />
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

      {/* Edit Modal */}
      <ModeratorEditModal
        isOpen={editModalOpen}
        moderator={selectedModerator}
        unassignedModels={unassignedModels}
        theme={theme}
        assigning={assigning}
        onClose={closeEditModal}
        onAssignModel={handleAssignModel}
      />
    </div>
  );
};

export default AdminAssignmentsView;
