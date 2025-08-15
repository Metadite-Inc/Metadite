import React from 'react';
import { Check, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Region configuration
const regionConfig = {
  usa: { name: 'USA', flag: '🇺🇸', code: 'US' },
  canada: { name: 'Canada', flag: '🇨🇦', code: 'CA' },
  mexico: { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  uk: { name: 'UK', flag: '🇬🇧', code: 'GB' },
  eu: { name: 'EU', flag: '🇪🇺', code: 'EU' },
  australia: { name: 'Australia', flag: '🇦🇺', code: 'AU' },
  new_zealand: { name: 'New Zealand', flag: '🇳🇿', code: 'NZ' },
};

const RegionSelector = ({ selectedRegions = [], onRegionsChange, label = "Available Regions" }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleRegionToggle = (region) => {
    const newRegions = selectedRegions.includes(region)
      ? selectedRegions.filter(r => r !== region)
      : [...selectedRegions, region];
    onRegionsChange(newRegions);
  };

  const handleSelectAll = () => {
    const allRegions = Object.keys(regionConfig);
    onRegionsChange(allRegions);
  };

  const handleSelectNone = () => {
    onRegionsChange([]);
  };

  const isAllSelected = selectedRegions.length === Object.keys(regionConfig).length;
  const isNoneSelected = selectedRegions.length === 0;

  return (
    <div className="space-y-3">
      <label className={`block text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
        {label}
      </label>
      
      {/* Quick selection buttons */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={handleSelectAll}
          className={`px-3 py-1 text-xs rounded-md border transition-colors ${
            isAllSelected 
              ? 'bg-metadite-primary text-white border-metadite-primary' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Select All
        </button>
        <button
          type="button"
          onClick={handleSelectNone}
          className={`px-3 py-1 text-xs rounded-md border transition-colors ${
            isNoneSelected 
              ? 'bg-red-500 text-white border-red-500' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Select None
        </button>
      </div>

      {/* Region checkboxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(regionConfig).map(([regionKey, config]) => {
          const isSelected = selectedRegions.includes(regionKey);
          
          return (
            <label
              key={regionKey}
              className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-metadite-primary/10 border-metadite-primary'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              } ${isDark ? 'bg-gray-800 border-gray-600' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleRegionToggle(regionKey)}
                className="sr-only"
              />
              <div className="flex items-center space-x-2 flex-1">
                <span className="text-lg">{config.flag}</span>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {config.name}
                </span>
              </div>
              {isSelected && (
                <Check className="h-4 w-4 text-metadite-primary" />
              )}
            </label>
          );
        })}
      </div>

      {/* Summary */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {selectedRegions.length === 0 && "No regions selected"}
        {selectedRegions.length > 0 && selectedRegions.length < Object.keys(regionConfig).length && (
          <span>Available in {selectedRegions.length} region{selectedRegions.length !== 1 ? 's' : ''}</span>
        )}
        {isAllSelected && (
          <span className="flex items-center space-x-1">
            <Globe className="h-3 w-3" />
            <span>Available globally</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default RegionSelector; 