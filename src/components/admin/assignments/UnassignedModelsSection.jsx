
import React from 'react';
import { Bot, Plus } from 'lucide-react';

const UnassignedModelsSection = ({ 
  unassignedModels, 
  theme, 
  onAssignModel 
}) => {
  if (unassignedModels.length === 0) return null;

  return (
    <div className={`glass-card rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Unassigned Models ({unassignedModels.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {unassignedModels.map((model) => (
          <div
            key={model.id}
            className={`p-4 rounded-lg border-2 border-dashed transition-all hover:border-metadite-primary ${
              theme === 'dark' ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden">
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
              <button
                onClick={() => onAssignModel(model)}
                className="p-2 bg-metadite-primary text-white rounded-lg hover:bg-metadite-primary/80 transition-colors"
                title="Assign to moderator"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <h4 className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {model.name}
            </h4>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              ID: {model.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnassignedModelsSection;
