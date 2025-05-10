
import React from 'react';
import { countries } from '../countries';

export interface RegionSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const RegionSelect: React.FC<RegionSelectProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border rounded-md text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-metadite-primary"
    >
      <option value="">Select your region</option>
      {countries.map((country) => (
        <option key={country.code} value={country.name}>
          {country.name}
        </option>
      ))}
    </select>
  );
};

export default RegionSelect;
