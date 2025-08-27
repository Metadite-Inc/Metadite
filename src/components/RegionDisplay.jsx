import React from 'react';
import { useTheme } from '../context/ThemeContext';

// Region configuration with flags and names
const regionConfig = {
  usa: { name: 'USA', flag: '🇺🇸', code: 'US' },
  canada: { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  mexico: { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  uk: { name: 'UK', flag: '🇬🇧', code: 'GB' },
  eu: { name: 'EU', flag: '🇪🇺', code: 'EU' },
  australia: { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  new_zealand: { name: 'New Zealand', flag: '🇳🇿', code: 'NZ' },
};

const RegionDisplay = ({ regions = [], showFlags = true, showNames = false, maxDisplay = 3, currentRegion = null }) => {
  const { theme } = useTheme();
  
  // If currentRegion is provided, show it prominently
  if (currentRegion && regionConfig[currentRegion]) {
    const config = regionConfig[currentRegion];
    return (
      <div className="flex items-center space-x-1">
        {showFlags && <span className="text-lg">{config.flag}</span>}
        {showNames && <span className="text-xs text-gray-600 dark:text-gray-400">{config.name}</span>}
      </div>
    );
  }

  if (!regions || regions.length === 0) {
    return null;
  }

  // If all regions are available, show "Global"
  const allRegions = ["usa", "canada", "mexico", "uk", "eu", "australia", "new_zealand"];
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
          <div key={region} className="flex items-center space-x-1">
            {showFlags && <span className="text-lg">{config.flag}</span>}
            {showNames && <span className="text-xs text-gray-600 dark:text-gray-400">{config.name}</span>}
            {index < displayRegions.length - 1 && <span className="text-gray-400">•</span>}
          </div>
        );
      })}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};

export default RegionDisplay; 