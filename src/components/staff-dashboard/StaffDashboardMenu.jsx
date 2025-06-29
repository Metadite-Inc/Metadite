
import React from 'react';
import { 
  User, MessageSquare, Settings, Calendar, BarChart3,
  Bell, LogOut, Shield, Users, UserCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const StaffDashboardMenu = ({ activeTab, setActiveTab, logout, user }) => {
  const { theme } = useTheme();
  
  // Get menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      { id: 'overview', label: 'Account Overview', icon: User },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'settings', label: 'Settings', icon: Settings }
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems.slice(0, 1), // Overview
        { id: 'admin-summary', label: 'Admin Summary', icon: BarChart3 },
        //{ id: 'system-health', label: 'System Health', icon: Shield },
        { id: 'user-management', label: 'Quick User Mgmt', icon: Users },
        ...commonItems.slice(1)
      ];
    }

    if (user?.role === 'moderator') {
      return [
        ...commonItems.slice(0, 1), // Overview
        { id: 'moderation-summary', label: 'Moderation Summary', icon: MessageSquare },
        { id: 'chat-activity', label: 'Chat Activity', icon: BarChart3 },
        ...commonItems.slice(1) // Notifications, Settings
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  const handleItemClick = (item) => {
    if (item.external) {
      // Navigate to external page
      navigate('/moderator-assignments');
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <div className={`glass-card rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
        <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {user?.role === 'admin' ? 'Admin Menu' : 
           user?.role === 'moderator' ? 'Moderator Menu' : 
           'Staff Menu'}
        </h3>
      </div>
      
      <ul className="p-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <li key={item.id}>
              <button 
                onClick={() => handleItemClick(item)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id && !item.external
                    ? 'bg-metadite-primary/10 text-metadite-primary' 
                    : theme === 'dark' 
                      ? 'text-gray-300 hover:bg-gray-700/50' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <IconComponent className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
        
        {/* Logout button */}
        <li className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
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

export default StaffDashboardMenu;
