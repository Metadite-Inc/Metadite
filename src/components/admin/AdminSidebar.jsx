import React, { useState, useEffect } from 'react';
import { 
  Settings, Users, ShoppingBag, CreditCard, AlertTriangle,
  PackagePlus, UserCog, FileVideo
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { adminApiService } from '../../lib/api/admin_api';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { theme } = useTheme();
  const [flaggedMessagesCount, setFlaggedMessagesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const fetchFlaggedMessagesCount = async () => {
    try {
      const count = await adminApiService.getFlaggedMessagesCount();
      setFlaggedMessagesCount(count);
    } catch (error) {
      console.error('Error fetching flagged messages count:', error);
      setFlaggedMessagesCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchFlaggedMessagesCount();
    
    // Set up interval to refresh every 10 minutes (600,000 ms)
    const interval = setInterval(fetchFlaggedMessagesCount, 600000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
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
              onClick={() => setActiveTab('videos')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'videos' 
                ? 'bg-metadite-primary/10 text-metadite-primary' 
                : theme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-700 hover:bg-gray-100'
            }`}
            >
              <FileVideo className="h-5 w-5 mr-3" />
              <span>Videos</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('slideshow')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'slideshow' 
                ? 'bg-metadite-primary/10 text-metadite-primary' 
                : theme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-700 hover:bg-gray-100'
            }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Slideshow</span>
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
              {flaggedMessagesCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {loading ? '...' : flaggedMessagesCount}
                </span>
              )}
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
  );
};

export default AdminSidebar;
