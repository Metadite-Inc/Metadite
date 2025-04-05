import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { 
  Users, ShoppingBag, CreditCard, ChevronDown, ChevronUp, AlertTriangle,
  Bell, Settings, PlusCircle, Search, Edit, Trash2, CheckCircle, XCircle,
  Image, PackagePlus, UserCog, BadgeCheck, ShieldCheck, BanknoteIcon, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from '../context/ThemeContext';

// Mock data for admin dashboard
const moderators = [
  { id: 1, name: 'Anita Jones', email: 'anita.moderator@metadite.com', assignedModels: ['Sophia Elegance', 'Victoria Vintage'], status: 'Active' },
  { id: 2, name: 'Michael Brown', email: 'michael.moderator@metadite.com', assignedModels: ['Modern Mila'], status: 'Active' },
  { id: 3, name: 'Sarah Smith', email: 'sarah.moderator@metadite.com', assignedModels: [], status: 'Inactive' }
];

const subscriptions = [
  { id: 1, user: 'john@example.com', plan: 'VIP', startDate: '2023-06-15', endDate: '2024-06-15', status: 'Active', amount: 99.99 },
  { id: 2, user: 'emma@example.com', plan: 'VIP', startDate: '2023-07-22', endDate: '2024-07-22', status: 'Active', amount: 99.99 },
  { id: 3, user: 'robert@example.com', plan: 'VIP', startDate: '2023-05-10', endDate: '2023-11-10', status: 'Expired', amount: 59.99 }
];

const payments = [
  { id: 'PAY-12345', user: 'john@example.com', amount: 129.99, date: '2023-08-15', method: 'Credit Card', status: 'Completed' },
  { id: 'PAY-12346', user: 'emma@example.com', amount: 259.98, date: '2023-08-14', method: 'Stripe', status: 'Completed' },
  { id: 'PAY-12347', user: 'michael@example.com', amount: 99.99, date: '2023-08-13', method: 'Crypto', status: 'Processing' },
  { id: 'PAY-12348', user: 'sarah@example.com', amount: 159.99, date: '2023-08-12', method: 'Credit Card', status: 'Failed' }
];

const flaggedMessages = [
  { 
    id: 1, 
    user: 'john@example.com', 
    moderator: 'anita.moderator@metadite.com',
    content: 'Hey, can you share your personal phone number?', 
    date: '2023-08-15',
    reason: 'Personal information request'
  },
  { 
    id: 2, 
    user: 'emma@example.com', 
    moderator: 'michael.moderator@metadite.com',
    content: 'I have some inappropriate content to share with you.',
    date: '2023-08-14',
    reason: 'Potentially harmful content'
  }
];

// Mock data for models
const modelData = [
  {
    id: 1,
    name: 'Sophia Elegance',
    price: 129.99,
    description: 'Handcrafted porcelain doll with intricate details and premium fabric clothing.',
    category: 'Premium',
    assignedModerator: 'anita.moderator@metadite.com',
    image: 'https://images.unsplash.com/photo-1611042553365-9b101d749e31?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Victoria Vintage',
    price: 159.99,
    description: 'Inspired by Victorian era fashion with authentic period clothing.',
    category: 'Premium',
    assignedModerator: 'anita.moderator@metadite.com',
    image: 'https://images.unsplash.com/photo-1547277854-fa0bf6c8ba26?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Modern Mila',
    price: 99.99,
    description: 'Contemporary doll design with customizable features and modern fashion elements.',
    category: 'Standard',
    assignedModerator: 'michael.moderator@metadite.com',
    image: 'https://images.unsplash.com/photo-1603552489088-b8304faff8ad?q=80&w=1000&auto=format&fit=crop'
  }
];

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

const Admin = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  // const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newModeratorData, setNewModeratorData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  // New states for model management
  const [models, setModels] = useState(modelData);
  const [newModelData, setNewModelData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Standard',
    assignedModerator: '',
    image: ''
  });
  
  // New state for admin management
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'content'
  });
  
  // State for admins
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Admin User', email: 'admin@metadite.com', type: 'super', status: 'Active' }
  ]);
  
  useEffect(() => {
    // Redirect non-admin users
    if (!user?.role === 'admin') {
      navigate('/login');
    }
    
    setIsLoaded(true);
  }, [user, navigate]);
  
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
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
  
  // Handle adding a new model
  const handleAddModel = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newModelData.name || !newModelData.price || !newModelData.description || !newModelData.image) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    // Create new model object
    const newModel = {
      id: models.length + 1,
      name: newModelData.name,
      price: parseFloat(newModelData.price),
      description: newModelData.description,
      category: newModelData.category,
      assignedModerator: newModelData.assignedModerator,
      image: newModelData.image
    };
    
    // Add model to the list
    setModels([...models, newModel]);
    
    // Assign model to moderator if one was selected
    if (newModelData.assignedModerator) {
      const modIndex = moderators.findIndex(mod => mod.email === newModelData.assignedModerator);
      if (modIndex !== -1) {
        const updatedModerators = [...moderators];
        updatedModerators[modIndex].assignedModels.push(newModelData.name);
        // In a real app, you'd update the backend here
      }
    }
    
    toast.success("Model added successfully", {
      description: `${newModelData.name} has been added to the catalog.`,
    });
    
    // Reset form
    setNewModelData({
      name: '',
      price: '',
      description: '',
      category: 'Standard',
      assignedModerator: '',
      image: ''
    });
  };
  
  // Handle adding a new admin
  const handleAddAdmin = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newAdminData.name || !newAdminData.email || !newAdminData.password) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    // Create new admin object
    const newAdmin = {
      id: admins.length + 1,
      name: newAdminData.name,
      email: newAdminData.email,
      type: newAdminData.type,
      status: 'Active'
    };
    
    // Add admin to the list
    setAdmins([...admins, newAdmin]);
    
    toast.success("Admin added successfully", {
      description: `${newAdminData.name} has been added as a ${newAdminData.type} admin.`,
    });
    
    // Reset form
    setNewAdminData({
      name: '',
      email: '',
      password: '',
      type: 'content'
    });
  };

  /*
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className={`flex-1 flex items-center justify-center pt-16 ${
          theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'
        }`}>
          <div className="text-center px-4">
            <br /><br /><br /><br /><br /><br />
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="mb-6">You do not have permission to access this page.</p>
            <br /><br /><br /><br /><br /><br />
          </div>
        </div>
        <Footer />
      </div>
    );
  } */
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-20 pb-12 px-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-white via-gray-100 to-white'
        }`}>
        <div className="container mx-auto max-w-7xl">
          <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <p className="opacity-80">Manage your platform and users</p>
                </div>
              </div>
              
              <div>
                <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                  Admin Account
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl overflow-hidden sticky top-24">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-medium text-gray-800">Admin Menu</h3>
                </div>
                
                <ul className="p-2">
                  <li>
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'dashboard' 
                        ? 'bg-metadite-primary/10 text-metadite-primary' 
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700/50' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      <span>Dashboard</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('models')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'models' 
                        ? 'bg-metadite-primary/10 text-metadite-primary' 
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700/50' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    >
                      <PackagePlus className="h-5 w-5 mr-3" />
                      <span>Models</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('admins')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'admins' 
                        ? 'bg-metadite-primary/10 text-metadite-primary' 
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700/50' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    >
                      <UserCog className="h-5 w-5 mr-3" />
                      <span>Admins</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('moderators')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'moderators' 
                        ? 'bg-metadite-primary/10 text-metadite-primary' 
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700/50' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    >
                      <Users className="h-5 w-5 mr-3" />
                      <span>Moderators</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('subscriptions')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'subscriptions' 
                        ? 'bg-metadite-primary/10 text-metadite-primary' 
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700/50' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    >
                      <CreditCard className="h-5 w-5 mr-3" />
                      <span>Subscriptions</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('payments')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'payments' 
                        ? 'bg-metadite-primary/10 text-metadite-primary' 
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700/50' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    >
                      <ShoppingBag className="h-5 w-5 mr-3" />
                      <span>Payments</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('flagged')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'flagged' 
                        ? 'bg-metadite-primary/10 text-metadite-primary' 
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700/50' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    >
                      <AlertTriangle className="h-5 w-5 mr-3" />
                      <span>Flagged Messages</span>
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {flaggedMessages.length}
                      </span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                        activeTab === 'settings' 
                        ? 'bg-metadite-primary/10 text-metadite-primary' 
                        : theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700/50' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      <span>Settings</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              {/* Dashboard Overview */}
              {activeTab === 'dashboard' && (
                <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card rounded-xl p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                          <Users className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Total Users</p>
                          <h3 className="text-2xl font-bold">1,243</h3>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-green-500">
                        +12% from last month
                      </div>
                    </div>
                    
                    <div className="glass-card rounded-xl p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <CreditCard className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Active Subscriptions</p>
                          <h3 className="text-2xl font-bold">267</h3>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-blue-500">
                        +8% from last month
                      </div>
                    </div>
                    
                    <div className="glass-card rounded-xl p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
                          <ShoppingBag className="h-6 w-6 text-purple-500 dark:text-purple-200" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Monthly Revenue</p>
                          <h3 className="text-2xl font-bold">$24,389</h3>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-purple-500 dark:text-purple-200">
                        +15% from last month
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Recent Activity</h2>
                      <button className="text-sm text-metadite-primary hover:text-metadite-secondary transition-colors">
                        View All
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                          <CreditCard className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">New subscription</p>
                          <p className="text-sm text-gray-500">User emma@example.com purchased a VIP subscription</p>
                          <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-4 flex-shrink-0">
                          <Users className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-medium">New moderator</p>
                          <p className="text-sm text-gray-500">Added sarah.moderator@metadite.com as a moderator</p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium">Message flagged</p>
                          <p className="text-sm text-gray-500">The system flagged a potentially inappropriate message</p>
                          <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                          <ShoppingBag className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">New order</p>
                          <p className="text-sm text-gray-500">User john@example.com purchased Sophia Elegance model</p>
                          <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Models Management */}
              {activeTab === 'models' && (
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
                              Category
                            </label>
                            <Select
                              value={newModelData.category}
                              onValueChange={(value) => setNewModelData({...newModelData, category: value})}
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
                              Assign Moderator
                            </label>
                            <Select
                              value={newModelData.assignedModerator}
                              onValueChange={(value) => setNewModelData({...newModelData, assignedModerator: value})}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder="Select moderator" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {moderators.map(mod => (
                                  <SelectItem key={mod.id} value={mod.email}>
                                    {mod.name} ({mod.email})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className={`block text-sm font-medium mb-1 
                              ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                              Image URL*
                            </label>
                            <input
                              type="url"
                              value={newModelData.image}
                              onChange={(e) => setNewModelData({...newModelData, image: e.target.value})}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary"
                              placeholder="https://example.com/image.jpg"
                              required
                            />
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
                              model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              model.description.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((model) => (
                            <tr key={model.id} className={`border-t border-gray-100 transition-colors 
                              ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                              >
                              <td className="px-6 py-4">
                                <img 
                                  src={model.image} 
                                  alt={model.name} 
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                              </td>
                              <td className="px-6 py-4 font-medium">{model.name}</td>
                              <td className="px-6 py-4">${model.price}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  model.category === 'Premium' 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : model.category === 'Limited Edition'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {model.category}
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
                    
                    {models.length === 0 && (
                      <div className="text-center py-10">
                        <PackagePlus className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No models found.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Admins Management */}
              {activeTab === 'admins' && (
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
                                    {type.icon}
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
                              admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              admin.email.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((admin) => (
                            <tr key={admin.id} className={`border-t border-gray-100 transition-colors 
                              ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                              >
                              <td className="px-6 py-4 font-medium">{admin.name}</td>
                              <td className="px-6 py-4">{admin.email}</td>
                              <td className="px-6 py-4">
                                {adminTypes.find(type => type.id === admin.type)?.name}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  admin.status === 'Active' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {admin.status}
                                </span>
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

                    {admins.length === 0 && (
                      <div className="text-center py-10">
                        <UserPlus className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No admins found.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Moderators Management */}
              {activeTab === 'moderators' && (
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
                                  <button className="text-red-500 hover:text-red-700 transition-color
                                  s">
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
              )}

              {/* Subscriptions Management */}
              {activeTab === 'subscriptions' && (
                <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h2 className="font-semibold">Active Subscriptions</h2>
                      <div className="relative">
                        <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search subscriptions..."
                          className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className={`text-left text-gray-500 text-sm 
                            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Plan</th>
                            <th className="px-6 py-3">Start Date</th>
                            <th className="px-6 py-3">End Date</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscriptions.map((subscription) => (
                            <tr key={subscription.id} className={`border-t border-gray-100 transition-colors 
                              ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                              >
                              <td className="px-6 py-4 font-medium">{subscription.user}</td>
                              <td className="px-6 py-4">
                                <span className="bg-metadite-primary/10 text-metadite-primary px-2 py-1 rounded-full text-xs font-medium">
                                  {subscription.plan}
                                </span>
                              </td>
                              <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {subscription.startDate}</td>
                              <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {subscription.endDate}</td>
                              <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                ${subscription.amount}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  subscription.status === 'Active' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {subscription.status}
                                </span>
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
              )}
              
              {/* Payments Management */}
              {activeTab === 'payments' && (
                <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h2 className="font-semibold">Recent Payments</h2>
                      <div className="relative">
                        <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search payments..."
                          className="pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className={`text-left text-gray-500 text-sm 
                            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <th className="px-6 py-3">Payment ID</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Method</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <tr key={payment.id} className={`border-t border-gray-100 transition-colors 
                              ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                              >
                              <td className="px-6 py-4 font-medium">{payment.id}</td>
                              <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {payment.user}</td>
                              <td className="px-6 py-4 font-medium">${payment.amount}</td>
                              <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                {payment.date}</td>
                              <td className="px-6 py-4">{payment.method}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                  payment.status === 'Completed' 
                                    ? 'bg-green-100 text-green-700' 
                                    : payment.status === 'Processing'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Flagged Messages */}
              {activeTab === 'flagged' && (
                <div className={`space-y-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        <h2 className="font-semibold">Flagged Messages</h2>
                      </div>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                        {flaggedMessages.length} messages flagged
                      </span>
                    </div>
                    
                    <div>
                      {flaggedMessages.map((message) => (
                        <div key={message.id} className="border-b border-gray-100 last:border-b-0">
                          <button 
                            className={`w-full px-6 py-4 flex items-center justify-between transition-colors 
                            ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                            onClick={() => toggleSection(message.id)}
                          >
                            <div className="flex items-start">
                              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                              </div>
                              <div className="text-left">
                                <div className="flex items-center">
                                  <p className="font-medium">User: {message.user}</p>
                                  <span className="mx-2 text-gray-300">|</span>
                                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Moderator: {message.moderator}</p>
                                </div>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{message.content}</p>
                              </div>
                            </div>
                            
                            {expandedSection === message.id ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          
                          {expandedSection === message.id && (
                            <div className={`px-6 py-4 animate-slide-down 
                            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                              <div className="mb-4">
                                <h3 className="font-medium mb-2">Message Content:</h3>
                                <p className="p-3 bg-white rounded-md border border-gray-200">{message.content}</p>
                              </div>
                              
                              <div className="mb-4">
                                <h3 className="font-medium mb-2">Flagged Reason:</h3>
                                <p className="text-red-600">{message.reason}</p>
                              </div>
                              
                              <div className="flex space-x-4">
                                <button className="flex items-center text-green-600 hover:text-green-700 transition-colors">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve Message
                                </button>
                                <button className="flex items-center text-red-600 hover:text-red-700 transition-colors">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Delete Message
                                </button>
                                <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
                                  <Bell className="h-4 w-4 mr-1" />
                                  Notify Moderator
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {flaggedMessages.length === 0 && (
                      <div className="text-center py-10">
                        <CheckCircle className="h-10 w-10 text-green-300 mx-auto mb-2" />
                        <p className="text-gray-500">No flagged messages at this time.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Settings */}
              {activeTab === 'settings' && (
                <div className={`glass-card rounded-xl p-10 text-center transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                  <Settings className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <h2 className="text-xl font-semibold mb-2">Platform Settings</h2>
                  <p className="text-gray-500 mb-4">This section is under development.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
      
    </div>
  );
};

export default Admin;