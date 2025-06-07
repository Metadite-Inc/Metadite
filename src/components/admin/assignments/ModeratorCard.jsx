
import React from 'react';
import { Bot, UserCheck, Trash2, Edit3 } from 'lucide-react';

const ModeratorCard = ({ 
  moderator, 
  theme, 
  onUnassignModel,
  onEditModerator
}) => {
  return (
    <div
      className={`glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
        theme === 'dark' ? 'bg-gray-800/70' : ''
      }`}
    >
      {/* Moderator Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              moderator.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <UserCheck className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {moderator.full_name}
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {moderator.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <buttonAdd commentMore actions
              onClick={() => onEditModerator(moderator)}
              className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
              title="Edit moderator"
            >
              <Edit className="h-4 w-4" />
            </button>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              moderator.is_active
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {moderator.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            Region: {moderator.region}
          </span>
          <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <Bot className="h-4 w-4 mr-1" />
            {moderator.assignedModels?.length || 0} Models
          </span>
        </div>
      </div>

      {/* Assigned Models */}
      <div className="p-6">
        <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Assigned Models
        </h4>
        
        {moderator.assignedModels?.length > 0 ? (
          <div className="space-y-3">
            {moderator.assignedModels.map((model) => (
              <div
                key={model.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                    {model.image_url ? (
                      <img
                        src={model.image_url}
                        alt={model.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/40x40?text=M';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-metadite-primary to-metadite-secondary flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {model.name}
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      ID: {model.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onUnassignModel(moderator.id, model.id)}
                  className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                  title="Unassign model"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No models assigned</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorCard;
