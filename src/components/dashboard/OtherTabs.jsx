import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import AccountSettings from './AccountSettings';
import FavoritesTab from './FavoritesTab';
import OrdersTab from './OrdersTab';

const OtherTabs = ({ activeTab }) => {
  const { theme } = useTheme();

  // First handle the tabs that have dedicated components
  if (activeTab === 'settings') {
    return (
      <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <AccountSettings />
      </div>
    );
  }

  if (activeTab === 'favorites') {
    return (
      <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <FavoritesTab />
      </div>
    );
  }

  if (activeTab === 'orders') {
    return (
      <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
        <OrdersTab />
      </div>
    );
  }

  // Then handle all other tabs with the default layout
  return (
    <div className={`glass-card rounded-xl ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <div className="p-10 text-center">
        <h2 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
          {activeTab === 'vip' && 'VIP Content'}
          {activeTab === 'payment' && 'Payment Methods'}
          {activeTab === 'notifications' && 'Notifications'}
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
          This section is under development.
        </p>
        {activeTab === 'vip' && (
          <Link 
            to="/vip-content" 
            className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Go to VIP Content
          </Link>
        )}
      </div>
    </div>
  );
};

export default OtherTabs;
