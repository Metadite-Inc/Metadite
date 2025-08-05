import React from 'react';
import { useTheme } from '../context/ThemeContext';

// Region configuration with flags and names
const regionConfig = {
  usa: { name: 'USA', flag: '🇺🇸', code: 'US' },
  canada: { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  mexico: { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  uk: { name: 'UK', flag: '🇬🇧', code: 'GB' },
  eu: { name: 'EU', flag: '🇪🇺', code: 'EU' },
  asia: { name: 'Asia', flag: '🌏', code: 'AS' },
};

const RegionDisplay = ({ regions = [], showFlags = true, showNames = false, maxDisplay = 3 }) => {
  const { theme } = useTheme();
  
  if (!regions || regions.length === 0) {
    return null;
  }

  // If all regions are available, show "Global"
  const allRegions = ["usa", "canada", "mexico", "uk", "eu", "asia"];
  const isGlobal = allRegions.every(region => regions.includes(region));
  
  if (isGlobal) {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-lg">🌍</span>
        {showNames && <span className="text-xs text-gray-600 dark:text-gray-400">Global</span>}
      </div>
    );
  }

  const displayRegions = regions.slice(0, maxDisplay);
  const remainingCount = regions.length - maxDisplay;

  return (
    <div className="flex items-center space-x-1">
      {displayRegions.map((region, index) => {
        const config = regionConfig[region];
        if (!config) return null;
        
        return (
          <div key={region} className="flex items-center space-x-1" title={config.name}>
            {showFlags && <span className="text-sm">{config.flag}</span>}
            {showNames && <span className="text-xs text-gray-600 dark:text-gray-400">{config.name}</span>}
            {!showFlags && !showNames && <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{config.code}</span>}
          </div>
        );
      })}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400">+{remainingCount}</span>
      )}
    </div>
  );
};

export default RegionDisplay; 