
import React, { useState } from 'react';
import { Bot, X, Loader2, Search, Plus } from 'lucide-react';

const ModeratorEditModal = ({ 
  isOpen, 
  moderator, 
  unassignedModels, 
  theme, 
  assigning, 
  onClose, 
  onAssignModel 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen || !moderator) return null;

  const filteredUnassignedModels = unassignedModels.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Edit Assignments for {moderator.full_name}
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {moderator.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search unassigned models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-metadite-primary`}
            />
          </div>
        </div>

        {/* Models List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredUnassignedModels.length > 0 ? (
            <div className="space-y-3">
              {filteredUnassignedModels.map((model) => (
                <div
                  key={model.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:border-metadite-primary ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-600/50' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
                      {model.image_url ? (
                        <img
                          src={model.image_url}
                          alt={model.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/48x48?text=M';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-metadite-primary to-metadite-secondary flex items-center justify-center">
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {model.name}
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        ID: {model.id}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onAssignModel(model.id)}
                    disabled={assigning}
                    className="p-2 bg-metadite-primary text-white rounded-lg hover:bg-metadite-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Assign to moderator"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h4 className="text-lg font-medium mb-2">
                {searchTerm ? 'No models match your search' : 'No unassigned models'}
              </h4>
              <p className="text-sm">
                {searchTerm 
                  ? 'Try adjusting your search terms.'
                  : 'All models are currently assigned to moderators.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {assigning && (
          <div className="flex items-center justify-center py-4 border-t border-gray-200 dark:border-gray-700">
            <Loader2 className="h-5 w-5 animate-spin text-metadite-primary mr-2" />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Assigning model...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorEditModal;
