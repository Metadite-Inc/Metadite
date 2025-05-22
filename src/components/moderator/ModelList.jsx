
import React from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ModelList = ({ 
  models, 
  searchTerm, 
  setSearchTerm, 
  selectedModel, 
  onSelectModel,
  loading 
}) => {
  const { theme } = useTheme();

  return (
    <div className={`glass-card rounded-xl overflow-hidden sticky top-24 ${
      theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : ''
    }`}>
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
        <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Assigned Models</h3>
      </div>
      
      <div className="p-2">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`block w-full pl-9 pr-3 py-2 border rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'border-gray-300 text-gray-900'
            }`}
          />
        </div>
        
        {loading && models.length === 0 ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-metadite-primary mx-auto mb-2"></div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Loading assigned models...
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {models
              .filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((model) => (
              <li key={model.id}>
                <button 
                  onClick={() => onSelectModel(model)}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                    selectedModel?.id === model.id 
                      ? 'bg-metadite-primary/10 text-metadite-primary' 
                      : theme === 'dark'
                        ? 'text-gray-200 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{model.name}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Assigned to you</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {!loading && models.length === 0 && (
          <div className="text-center py-6">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No models assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelList;
