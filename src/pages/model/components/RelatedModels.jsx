
import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const RelatedModels = ({ models }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  if (models.length === 0) return null;
  
  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <Grid className="h-5 w-5 text-metadite-primary mr-2" />
        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : ''}`}>You May Also Like</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {models.map((model) => (
          <Link 
            key={model.id} 
            to={`/model/${model.id}`}
            className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="w-full h-[444px] overflow-hidden flex items-center justify-center bg-white">
              <img 
                src={model.image} 
                alt={model.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className={`font-medium text-lg mb-1 ${isDark ? 'text-white' : ''}`}>{model.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-metadite-primary font-bold">${model.price}</span>
                <div className={`inline-block ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'} text-xs font-medium px-2.5 py-0.5 rounded`}>
                  {model.category}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedModels;
