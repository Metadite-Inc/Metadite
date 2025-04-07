
import React from 'react';
import { User, Shield, Key } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from '../../context/ThemeContext';

const roleIcons = {
  user: <User className="h-4 w-4" />,
  moderator: <Shield className="h-4 w-4" />,
  admin: <Key className="h-4 w-4" />
};

const roleLabels = {
  user: "Regular User",
  moderator: "Moderator",
  admin: "Administrator"
};

const RoleSelector = ({ role, setRole }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className="space-y-1">
      <label htmlFor="role" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Login as</label>
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className={`w-full ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : ''}`}>
          <div className="flex items-center">
            <div className={`mr-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {roleIcons[role]}
            </div>
            <SelectValue placeholder="Select account type" />
          </div>
        </SelectTrigger>
        <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-200'}>
          {Object.keys(roleIcons).map((roleKey) => (
            <SelectItem 
              key={roleKey}
              value={roleKey} 
              className={isDark ? 'text-gray-200 bg-gray-800 hover:bg-gray-700 focus:bg-gray-700' : 'hover:bg-gray-100'}
            >
              <div className="flex items-center">
                <span className={`mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {roleIcons[roleKey]}
                </span>
                <span>{roleLabels[roleKey]}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleSelector;
