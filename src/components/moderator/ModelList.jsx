
import React from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { format, isToday, isYesterday } from 'date-fns';

const ModelList = ({ models, searchTerm, setSearchTerm, selectedModel, onSelectModel, loading }) => {
  const { theme } = useTheme();

  // Filter models based on search term
  const filteredModels = searchTerm
    ? models.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : models;

  // Format the last message time
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'dd/MM/yyyy');
    }
  };

  return (
    <div className={`glass-card rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : ''}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>Assigned Models</h2>
        
        <div className={`flex items-center rounded-md border px-3 py-2 ${
          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
        }`}>
          <Search className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          <input 
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`bg-transparent border-none w-full focus:outline-none focus:ring-0 text-sm ${
              theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>
      
      <div className="h-[500px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-metadite-primary"></div>
          </div>
        ) : filteredModels.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredModels.map((model) => (
              <li 
                key={model.id}
                onClick={() => onSelectModel(model)}
                className={`cursor-pointer transition-colors ${
                  selectedModel?.id === model.id
                    ? `bg-gradient-to-r from-metadite-primary/20 to-metadite-secondary/20 ${theme === 'dark' ? 'text-white' : ''}`
                    : `hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-200' : ''}`
                }`}
              >
                <div className="flex items-center p-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/200?text=Model';
                      }}
                    />
                    {model.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {model.unreadCount > 9 ? '9+' : model.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${selectedModel?.id === model.id ? 'text-metadite-primary' : ''}`}>
                      {model.name}
                    </p>
                    <p className="text-xs truncate text-gray-500 dark:text-gray-400 mt-1">
                      {model.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  {model.lastMessageTime && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                      {formatLastMessageTime(model.lastMessageTime)}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
            <MessageSquare className={`h-8 w-8 mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {searchTerm ? 'No models match your search' : 'No models assigned yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelList;
