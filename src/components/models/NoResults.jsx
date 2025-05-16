
import { useTheme } from '../../context/ThemeContext';

const NoResults = ({ resetFilters }) => {
  const { theme } = useTheme();

  return (
    <div className="text-center py-16">
      <p
        className={`text-lg ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        No models found matching your criteria.
      </p>
      <button
        onClick={resetFilters}
        className="mt-4 text-metadite-primary hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
};

export default NoResults;
