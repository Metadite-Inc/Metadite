
import React from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface RegionSelectProps {
  region: string;
  setRegion: (region: string) => void;
}

const regions = [
  { value: 'usa', label: 'USA' },
  { value: 'canada', label: 'Canada' },
  { value: 'mexico', label: 'Mexico' },
  { value: 'uk', label: 'UK' },
  { value: 'eu', lable: 'EU' },
  { value: 'asia', label: 'Asia' },
  { value: 'africa', label: 'Africa' },
  { value: 'australia', label: 'Australia' },
];

const RegionSelect: React.FC<RegionSelectProps> = ({ region, setRegion }) => {
  return (
    <div className="space-y-1">
      <label htmlFor="region" className="text-sm font-medium text-gray-700">Region</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
          <Globe className="h-5 w-5 text-gray-400" />
        </div>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger id="region" className="pl-10">
            <SelectValue placeholder="Select your region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map(regionOption => (
              <SelectItem key={regionOption.value} value={regionOption.value}>
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
