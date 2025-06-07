
import React from 'react';
import { Bot, X, Loader2 } from 'lucide-react';

const AssignmentModal = ({ 
  isOpen, 
  selectedModel, 
  moderators, 
  theme, 
  assigning, 
  onClose, 
  onAssignModel 
}) => {
  if (!isOpen || !selectedModel) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl max-w-md w-full p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Assign Model to Moderator
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className={`p-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
              {selectedModel.image_url ? (
                <img
                  src={selectedModel.image_url}
                  alt={selectedModel.name}
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
            <div>
              <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {selectedModel.name}
              </h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                ID: {selectedModel.id}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Select Moderator:
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {moderators.filter(mod => mod.is_active).map((moderator) => (
              <button
                key={moderator.id}
                onClick={() => onAssignModel(moderator.id)}
                disabled={assigning}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                } ${assigning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{moderator.full_name}</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {moderator.email}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {moderator.assignedModels?.length || 0} models
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {assigning && (
          <div className="flex items-center justify-center py-4">
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

export default AssignmentModal;
