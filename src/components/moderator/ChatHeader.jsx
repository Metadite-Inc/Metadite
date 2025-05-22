
import React from 'react';
import { Filter, Clock, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ChatHeader = ({ selectedModel }) => {
  const { theme } = useTheme();
  
  if (!selectedModel) return null;
  
  return (
    <div className={`p-4 border-b flex items-center ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
        <img
          src={selectedModel.image}
          alt={selectedModel.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h2 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{selectedModel.name} Conversations</h2>
      </div>
      <div className="flex space-x-2">
        <button className={`p-2 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
          <Filter className="h-5 w-5" />
        </button>
        <button className={`p-2 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
          <Clock className="h-5 w-5" />
        </button>
        <button className={`p-2 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
          <User className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
