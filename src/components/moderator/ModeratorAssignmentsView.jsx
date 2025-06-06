
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { moderatorApiService } from '../../lib/api/moderator_api';
import { Bot, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ModeratorAssignmentsView = ({ user }) => {
  const { theme } = useTheme();
  const [assignedModels, setAssignedModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignedModels();
  }, [user]);

  const loadAssignedModels = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const models = await moderatorApiService.getDollsAssignedToModerator(user.id);
      setAssignedModels(models || []);
    } catch (error) {
      console.error('Error loading assigned models:', error);
      toast.error('Failed to load assigned models');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-12 w-12 text-metadite-primary animate-spin" />
        <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading your assigned models...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-metadite-primary to-metadite-secondary rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">My Assigned Models</h1>
              <p className="opacity-90">Models you are responsible for moderating</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{assignedModels.length}</div>
            <div className="opacity-80">Assigned Models</div>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      {assignedModels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedModels.map((model) => (
            <div
              key={model.id}
              className={`glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                theme === 'dark' ? 'bg-gray-800/70' : ''
              }`}
            >
              {/* Model Image */}
              <div className="h-48 overflow-hidden">
                {model.image_url ? (
                  <img
                    src={model.image_url}
                    alt={model.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x300?text=Model';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-metadite-primary to-metadite-secondary flex items-center justify-center">
                    <Bot className="h-16 w-16 text-white" />
                  </div>
                )}
              </div>

              {/* Model Info */}
              <div className="p-6">
                <h3 className={`font-semibold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {model.name}
                </h3>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Model ID: {model.id}
                </p>
                <div className={`text-xs px-3 py-1 rounded-full inline-block ${
                  theme === 'dark' 
                    ? 'bg-metadite-primary/20 text-metadite-primary' 
                    : 'bg-metadite-primary/10 text-metadite-primary'
                }`}>
                  Assigned to you
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`glass-card rounded-xl p-12 text-center ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
          <Bot className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            No Models Assigned
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            You don't have any models assigned to you yet. Contact your administrator for assignments.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModeratorAssignmentsView;
