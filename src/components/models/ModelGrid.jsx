
import ModelCard from '../ModelCard';
import { useAuth } from '../../context/AuthContext';

const ModelGrid = ({ models, isLoaded }) => {
  const { user } = useAuth();

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="glass-card rounded-xl overflow-hidden h-96 shimmer"></div>
        ))}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-500">
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
      {models.map((model) => (
        <ModelCard 
          key={model.id} 
          model={model} 
          user={user}
        />
      ))}
    </div>
  );
};

export default ModelGrid;
