
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ModelCard from '../ModelCard';

const FeaturedModelsSection = ({ models = [], loading = false, theme, user }) => {
  return (
    <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Featured Models</h2>
          <Link
            to="/models"
            className="inline-flex items-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white rounded-md px-4 py-2 font-medium shadow hover:opacity-90 focus:ring-2 focus:ring-metadite-primary transition"
          >
            <span>View All</span>
            <ChevronRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <div className="aspect-square w-full bg-gray-200 animate-pulse"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : models && models.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {models.map((model) => (
              <ModelCard key={model.id} model={model} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              No featured models available at the moment.
            </p>
            <Link 
              to="/models" 
              className="inline-block mt-4 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Browse All Models
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedModelsSection;
