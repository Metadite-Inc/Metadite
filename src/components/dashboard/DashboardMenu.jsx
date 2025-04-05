import React from 'react';
import { 
  User, ShoppingBag, Video, Heart, CreditCard, 
  Bell, Settings, LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DashboardMenu = ({ activeTab, setActiveTab, logout, userVip, user }) => {
  const { theme } = useTheme();

  return (
    <div className={`glass-card rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
        <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Dashboard Menu</h3>
      </div>
      
      <ul className="p-2">
        <li>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-metadite-primary/10 text-metadite-primary' 
                : theme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="h-5 w-5 mr-3" />
            <span>Account Overview</span>
          </button>
        </li>
        {!user?.role !== 'moderator' && (
          <li>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-metadite-primary/10 text-metadite-primary' 
                  : theme === 'dark' 
                    ? 'text-gray-300 hover:bg-gray-700/50' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="h-5 w-5 mr-3" />
              <span>Orders</span>
            </button>
          </li>
        )}
        {userVip && (
          <li>
            <button 
              onClick={() => setActiveTab('vip')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'vip' 
                  ? 'bg-metadite-primary/10 text-metadite-primary' 
                  : theme === 'dark' 
                    ? 'text-gray-300 hover:bg-gray-700/50' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Video className="h-5 w-5 mr-3" />
              <span>VIP Content</span>
            </button>
          </li>
        )}
        {user?.role !== 'moderator' && (
          <li>
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'favorites' 
                  ? 'bg-metadite-primary/10 text-metadite-primary' 
                  : theme === 'dark' 
                    ? 'text-gray-300 hover:bg-gray-700/50' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Heart className="h-5 w-5 mr-3" />
              <span>Favorites</span>
            </button>
          </li>
        )}
        {user?.role !== 'moderator' && (
          <li>
            <button 
              onClick={() => setActiveTab('payment')}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'payment' 
                  ? 'bg-metadite-primary/10 text-metadite-primary' 
                  : theme === 'dark' 
                    ? 'text-gray-300 hover:bg-gray-700/50' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              <span>Payment Methods</span>
            </button>
          </li>
        )}
        <li>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'notifications' 
                ? 'bg-metadite-primary/10 text-metadite-primary' 
                : theme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-700/50' 
                  : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Bell className="h-5 w-5 mr-3" />
            <span>Notifications</span>
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
        <li>
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DashboardMenu;
