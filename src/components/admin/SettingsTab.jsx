import React from 'react';
import { Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SettingsTab = ({ isLoaded }) => {
  return (
    <div className={`glass-card rounded-xl p-10 text-center transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Settings className="h-10 w-10 text-gray-300 mx-auto mb-2" />
      <h2 className="text-xl font-semibold mb-2">Platform Settings</h2>
      <p className="text-gray-500 mb-4">This section is under development.</p>
    </div>
  );
};

export default SettingsTab;