
import React from 'react';
import { 
  Settings, Users, ShoppingBag, CreditCard, AlertTriangle,
  PackagePlus, UserCog, FileVideo
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminSidebar = ({ activeTab, setActiveTab, flaggedMessagesCount }) => {
  const { theme } = useTheme();
  
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
                {flaggedMessagesCount}
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
  );
};

export default AdminSidebar;
