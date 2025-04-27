
import React from 'react';
import { Facebook, Twitter } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SocialLoginButtons = ({ onSocialLogin }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className={`px-2 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
            Or continue with
          </span>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSocialLogin('Facebook')}
          className={`w-full flex items-center justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-gray ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200'
          } transition-colors`}
        >
          <Facebook className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
          Facebook
        </button>
        
        <button
          type="button"
          onClick={() => onSocialLogin('Twitter')}
          className={`w-full flex items-center justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-gray ${
            isDark 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200'
          } transition-colors`}
        >
          <Twitter className={`h-5 w-5 ${isDark ? 'text-blue-300' : 'text-blue-400'} mr-2`} />
          Twitter
        </button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;