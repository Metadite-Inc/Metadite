import React, { useState } from 'react';
import { Users, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';

// Mock data for moderators
const moderatorsData = [
  { id: 1, name: 'Anita Jones', email: 'anita.moderator@metadite.com', assignedModels: ['Sophia Elegance', 'Victoria Vintage'], status: 'Active' },
  { id: 2, name: 'Michael Brown', email: 'michael.moderator@metadite.com', assignedModels: ['Modern Mila'], status: 'Active' },
  { id: 3, name: 'Sarah Smith', email: 'sarah.moderator@metadite.com', assignedModels: [], status: 'Inactive' }
];

const ModeratorsTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [moderators, setModerators] = useState(moderatorsData);
  const [newModeratorData, setNewModeratorData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const handleAddModerator = (e) => {
    e.preventDefault();
    
    // Validate email format
    if (!newModeratorData.email.includes('.moderator@metadite.com')) {
      toast.error("Invalid email format", {
        description: "Moderator email must be in format: name.moderator@metadite.com",
      });
      return;
    }
    
    // Add moderator logic would go here
    const newModerator = {
      id: moderators.length + 1,
      name: newModeratorData.name,
      email: newModeratorData.email,
      assignedModels: [],
      status: 'Active'
    };
    
    setModerators([...moderators, newModerator]);
    
    toast.success("Moderator added successfully", {
      description: `${newModeratorData.name} has been added as a moderator.`,
    });
    
    // Reset form
    setNewModeratorData({
      name: '',
      email: '',
      password: ''
    });
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
                  mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  mod.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((mod) => (
                <tr key={mod.id} className={`border-t border-gray-100 transition-colors 
                  ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                  <td className="px-6 py-4 font-medium">{mod.name}</td>
                  <td className="px-6 py-4">{mod.email}</td>
                  <td className="px-6 py-4">
                    {mod.assignedModels.length > 0 
                      ? mod.assignedModels.join(', ')
                      : 'None assigned'
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModeratorsTab;