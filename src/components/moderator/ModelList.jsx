import React, { useMemo } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { User } from 'lucide-react';

const ModelList = ({ 
  models, 
  searchTerm, 
  setSearchTerm, 
  selectedModel, 
  onSelectModel, 
  loading,
  lastMessageUpdates,
  animatingRooms
}) => {
  const { theme } = useTheme();

  const filteredModels = useMemo(() => {
    return models.filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [models, searchTerm]);

  const enhancedModels = useMemo(() => {
    return filteredModels.map(model => {
      const lastUpdate = lastMessageUpdates?.get(model.id);
      const isAnimating = animatingRooms?.has(model.id);
      
      return {
        ...model,
        lastMessage: lastUpdate?.content || model.lastMessage,
        lastMessageTime: lastUpdate?.timestamp || model.lastMessageTime,
        unreadCount: lastUpdate?.unreadCount || model.unreadCount,
        isAnimating
      };
    });
  }, [filteredModels, lastMessageUpdates, animatingRooms]);

  const formatLastMessageTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes}m ago`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return '';
    }
  };

  return (
    <div className={`glass-card rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : ''}`}>
      <div className="p-2 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>Model Chats</h2>
        
        <div className={`flex items-center rounded-md border px-2 py-1 ${
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
      
      <div className="h-[500px] overflow-y-auto chat-messages-container">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-metadite-primary"></div>
          </div>
        ) : enhancedModels.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {enhancedModels.map((model) => (
              <li 
                key={model.id}
                onClick={() => onSelectModel(model)}
                className={`cursor-pointer model-list-item transition-all duration-300 ${
                  selectedModel?.id === model.id
                    ? `bg-gradient-to-r from-metadite-primary/20 to-metadite-secondary/20 ${theme === 'dark' ? 'text-white' : ''}`
                    : `hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-200' : ''}`
                } ${model.isAnimating ? 'room-item-new-message' : ''}`}
              >
                <div className="flex items-center p-2 sm:p-3">
                  <div className="relative mr-3 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={model.image}
                        alt={model.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/200?text=Model';
                        }}
                      />
                    </div>
                    {model.unreadCount > 0 && (
                      <div className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center z-10 border-2 border-white ${
                        model.isAnimating ? 'bg-red-500 unread-badge-animate' : 'bg-red-500'
                      }`}>
                        {model.unreadCount > 9 ? '9+' : model.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${selectedModel?.id === model.id ? 'text-metadite-primary' : ''}`}>
                      {model.name} • {model.receiverName?.split(' ')[0] || model.receiverName}
                    </p>
                    <p className={`text-xs truncate mt-1 transition-colors duration-200 ${
                      model.isAnimating 
                        ? 'text-metadite-primary font-medium' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {model.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  {model.lastMessageTime && (
                    <div className={`text-xs whitespace-nowrap ml-2 transition-colors duration-200 ${
                      model.isAnimating 
                        ? 'text-metadite-primary font-medium' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatLastMessageTime(model.lastMessageTime)}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 px-2 sm:px-4 text-center">
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

export default React.memo(ModelList);
