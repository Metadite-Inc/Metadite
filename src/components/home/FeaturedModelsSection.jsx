
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ModelCard from '../ModelCard';

const FeaturedModelsSection = ({ models, theme }) => {
  return (
    <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Featured Models</h2>
          <Link to="/models" className="flex items-center text-metadite-primary hover:text-metadite-secondary transition-colors">
            <span>View All</span>
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedModelsSection;
