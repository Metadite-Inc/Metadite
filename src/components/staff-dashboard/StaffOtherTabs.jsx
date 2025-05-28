import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import StaffAccountSettings from './StaffAccountSettings';
import AdminSummaryTab from './AdminSummaryTab';
import ModerationSummaryTab from './ModerationSummaryTab';
import SystemHealthTab from './SystemHealthTab';
import ChatActivityTab from './ChatActivityTab';

const StaffOtherTabs = ({ activeTab, user }) => {
  const { theme } = useTheme();

  // Handle tabs with dedicated components
  if (activeTab === 'settings') {
    return (
      <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <StaffAccountSettings user={user} />
      </div>
    );
  }

  // Admin-specific tabs
  if (user?.role === 'admin') {
    if (activeTab === 'admin-summary') {
      return (
        <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <AdminSummaryTab />
        </div>
      );
    }

    if (activeTab === 'system-health') {
      return (
        <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <SystemHealthTab />
        </div>
      );
    }

    if (activeTab === 'user-management') {
      return (
        <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <div className="p-8 text-center">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>
              Quick User Management
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              Access full user management features from the admin panel.
            </p>
            <Link 
              to="/admin" 
              className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
            >
              Go to Admin Panel
            </Link>
          </div>
        </div>
      );
    }
  }

  // Moderator-specific tabs
  if (user?.role === 'moderator') {
    if (activeTab === 'moderation-summary') {
      return (
        <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <ModerationSummaryTab />
        </div>
      );
    }

    if (activeTab === 'chat-activity') {
      return (
        <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <ChatActivityTab />
        </div>
      );
    }

    if (activeTab === 'schedule') {
      return (
        <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <div className="p-8 text-center">
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>
              Moderation Schedule
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-6`}>
              Schedule management is coming soon.
            </p>
            <Link 
              to="/moderator" 
              className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
            >
              Go to Moderator Panel
            </Link>
          </div>
        </div>
      );
    }
  }

  // Default tab handling for notifications and other common tabs
  return (
    <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <div className="p-10 text-center">
        <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
          {activeTab === 'notifications' && 'Notifications'}
          {activeTab === 'admin-summary' && 'Admin Summary'}
          {activeTab === 'moderation-summary' && 'Moderation Summary'}
          {activeTab === 'system-health' && 'System Health'}
          {activeTab === 'chat-activity' && 'Chat Activity'}
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
          This section is under development.
        </p>
        
        {user?.role === 'admin' && (
          <Link 
            to="/admin" 
            className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity mr-4"
          >
            Go to Admin Panel
          </Link>
        )}
        
        {user?.role === 'moderator' && (
          <Link 
            to="/moderator" 
            className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Go to Moderator Panel
          </Link>
        )}
      </div>
    </div>
  );
};

export default StaffOtherTabs;
