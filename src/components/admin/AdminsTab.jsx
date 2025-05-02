import React, { useState, useEffect } from 'react';
import { UserCog, Search, Edit, Trash2, FileText, BanknoteIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from '../../context/ThemeContext';
import { adminApiService } from '../../lib/api/admin_api';

// Admin types
const adminTypes = [
  { 
    id: 'super', 
    name: 'Super Admin', 
    description: 'Complete access to all admin features',
    icon: <UserCog className="h-5 w-5 text-purple-500 dark:text-purple-200" />
  },
  { 
    id: 'content', 
    name: 'Content Admin', 
    description: 'Manages models and content moderation',
    icon: <FileText className="h-5 w-5 text-blue-500" />
  },
  { 
    id: 'financial', 
    name: 'Financial Admin', 
    description: 'Manages payments and subscriptions',
    icon: <BanknoteIcon className="h-5 w-5 text-green-500" />
  }
];

const AdminsTab = ({ isLoaded }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'content'
  });
  
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await adminApiService.getAdmins();
        setAdmins(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load admins", {
          description: error instanceof Error ? error.message : "Unknown error occurred",
        });
        setLoading(false);
      }
    };
    
    fetchAdmins();
  }, []);
  
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    if (!newAdminData.name || !newAdminData.email || !newAdminData.password) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    try {
      await adminApiService.createAdmin({
        email: newAdminData.email,
        full_name: newAdminData.name,
        region: "global",
        role: newAdminData.type,
        membership_level: "admin",
        is_active: true,
        video_access_count: 0,
        password: newAdminData.password
      });
      
      const updatedAdmins = await adminApiService.getAdmins();
      setAdmins(updatedAdmins);
      
      setNewAdminData({
        name: '',
        email: '',
        password: '',
        type: 'content'
      });
      
      toast.success("Admin added successfully", {
        description: `${newAdminData.name} has been added as a ${newAdminData.type} admin.`,
      });
    } catch (error) {
      toast.error("Failed to add admin", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };
  
  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await adminApiService.deleteAdmin(adminId);
        setAdmins(admins.filter(admin => admin.id !== adminId));
        toast.success("Admin deleted successfully");
      } catch (error) {
        toast.error("Failed to delete admin", {
          description: error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    }
  };
  
  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="glass-card rounded-xl overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary p-4 text-white">
          <h2 className="text-lg font-semibold">Add New Admin</h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleAddAdmin}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData({...newAdminData, name: e.target.value})}
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
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
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
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 
                  ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Admin Type
                </label>
                <Select
                  value={newAdminData.type}
                  onValueChange={(value) => setNewAdminData({...newAdminData, type: value})}
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select admin type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {adminTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                className="flex items-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                <UserCog className="h-4 w-4 mr-2" />
                Add Admin
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold">Manage Admins</h2>
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
            />
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-metadite-primary mx-auto mb-2"></div>
            <p className="text-gray-500">Loading admins...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={`text-left text-gray-500 text-sm 
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins
                  .filter(admin => 
                    admin.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((admin) => (
                  <tr key={admin.id} className={`border-t border-gray-100 transition-colors 
                    ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    >
                    <td className="px-6 py-4 font-medium">{admin.full_name}</td>
                    <td className="px-6 py-4">{admin.email}</td>
                    <td className="px-6 py-4">
                      {adminTypes.find(type => type.id === admin.role)?.name || admin.role}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        admin.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteAdmin(admin.id)} 
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

        {!loading && admins.length === 0 && (
          <div className="text-center py-10">
            <UserCog className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No admins found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminsTab;