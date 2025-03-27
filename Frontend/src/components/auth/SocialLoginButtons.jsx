
import React from 'react';
import { Facebook, Twitter } from 'lucide-react';

const SocialLoginButtons = ({ onSocialLogin }) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSocialLogin('Facebook')}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Facebook className="h-5 w-5 text-blue-600 mr-2" />
          Facebook
        </button>
        
        <button
          type="button"
          onClick={() => onSocialLogin('Twitter')}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Twitter className="h-5 w-5 text-blue-400 mr-2" />
          Twitter
        </button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
