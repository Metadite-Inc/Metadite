import React, { useState, useEffect } from 'react';
import { Users, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';
import { adminApiService } from '../../lib/api/admin_api';

const ModeratorsTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [moderators, setModerators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newModeratorData, setNewModeratorData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  // Fetch moderators on component mount
  useEffect(() => {
    const fetchModerators = async () => {
      try {
        // Note: We need to add a method to fetch moderators in the API service
        // This is a placeholder until the API method is implemented
        // const data = await adminApiService.getModerators();
        // setModerators(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load moderators", {
          description: error instanceof Error ? error.message : "Unknown error occurred",
        });
        setLoading(false);
      }
    };
    
    fetchModerators();
  }, []);
  
  const handleAddModerator = async (e) => {
    e.preventDefault();
    
    // Validate email format
    if (!newModeratorData.email.includes('.moderator@metadite.com')) {
      toast.error("Invalid email format", {
        description: "Moderator email must be in format: name.moderator@metadite.com",
      });
      return;
    }
    
    try {
      await adminApiService.createModerator({
        email: newModeratorData.email,
        full_name: newModeratorData.name,
        region: "global", // Default value or could be added to form
        role: "moderator",
        membership_level: "moderator",
        is_active: true,
        video_access_count: 0,
        assigned_dolls: [],
        password: newModeratorData.password
      });
      
      // Refresh moderators list after adding
      // Placeholder until getModerators method is implemented
      // const updatedModerators = await adminApiService.getModerators();
      // setModerators(updatedModerators);
      
      // Reset form
      setNewModeratorData({
        name: '',
        email: '',
        password: ''
      });
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
                  onChange={(e) => setNewModeratorData({...newModeratorData, password: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                  required
                />
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
                      {mod.assigned_dolls && mod.assigned_dolls.length > 0 
                        ? mod.assigned_dolls.join(', ')
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