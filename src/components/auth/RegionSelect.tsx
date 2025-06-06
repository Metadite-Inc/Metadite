
import React from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useTheme } from '../../context/ThemeContext';

interface RegionSelectProps {
  region: string;
  setRegion: (region: string) => void;
  error?: string;
  onBlur?: () => void;
  onFocus?: () => void;
}

const regions = [
  { value: 'usa', label: 'USA' },
  { value: 'canada', label: 'Canada' },
  { value: 'mexico', label: 'Mexico' },
  { value: 'uk', label: 'UK' },
  { value: 'eu', label: 'EU' },
  { value: 'asia', label: 'Asia' },
  //{ value: 'africa', label: 'Africa' },
  { value: 'australia', label: 'Australia' },
];

const RegionSelect: React.FC<RegionSelectProps> = ({ region, setRegion, error, onBlur, onFocus }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="space-y-1">
      <label htmlFor="region" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Region</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
          <Globe className="h-5 w-5 text-gray-400" />
        </div>
        <Select
          value={region}
          onValueChange={setRegion}
        >
          <SelectTrigger
            id="region"
            className={`pl-10 border ${error ? 'border-red-500' : isDark ? 'border-gray-700' : 'border-gray-300'} ${isDark ? 'bg-gray-800 text-gray-200' : ''}`}
            aria-invalid={!!error}
            aria-describedby={error ? 'region-error' : undefined}
            onBlur={onBlur}
            onFocus={onFocus}
          >
            <SelectValue placeholder="Select your region" />
          </SelectTrigger>
          <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
            {regions.map(regionOption => (
              <SelectItem 
                key={regionOption.value} 
                value={regionOption.value}
                className={isDark ? 'text-gray-200 bg-gray-800 hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100'}
              >
                {regionOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RegionSelect;
