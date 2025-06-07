
import ModelCard from '../ModelCard';
import { useAuth } from '../../context/AuthContext';

const ModelGrid = ({ models, isLoaded }) => {
  const { user } = useAuth();

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="glass-card rounded-xl overflow-hidden h-96">
            <div className="aspect-square w-full bg-gray-200 dark:bg-gray-700 shimmer"></div>
            <div className="p-5">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded shimmer mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          No models found matching your criteria.
        </p>
        <button
          onClick={() => {
            window.location.reload();
          }}
          className="mt-4 text-metadite-primary hover:underline"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {models.map((model, index) => (
        <ModelCard 
          key={model.id} 
          model={model} 
          user={user}
          style={{
            // Prioritize loading of first 6 images (above the fold)
            ...(index < 6 && { loadingPriority: 'high' })
          }}
        />
      ))}
    </div>
  );
};

export default ModelGrid;
