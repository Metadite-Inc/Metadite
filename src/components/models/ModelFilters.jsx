
import { useState } from 'react';
import { Search, Filter, Tag, Grid } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ModelFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  priceFilter, 
  setPriceFilter,
  categories
}) => {
  const { theme } = useTheme();

  return (
    <>
      <div className="glass-card rounded-xl p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search models..."
                className={`w-full py-2 pl-10 pr-4 rounded-md border ${
                  theme === 'dark'
                    ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-400'
                    : 'border-gray-200 bg-white text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-metadite-primary`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className={`absolute left-3 top-2.5 h-5 w-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-4">
              <Filter className="h-5 w-5 text-metadite-primary" />
              <select
                className={`py-2 px-4 rounded-md border ${
                  theme === 'dark'
                    ? 'border-gray-700 bg-gray-800 text-white'
                    : 'border-gray-200 bg-white text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-metadite-primary`}
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="under100">Under $100</option>
                <option value="100to150">$100 - $150</option>
                <option value="over150">Over $150</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-metadite-primary" />
              <select
                className={`py-2 px-4 rounded-md border ${
                  theme === 'dark'
                    ? 'border-gray-700 bg-gray-800 text-white'
                    : 'border-gray-200 bg-white text-gray-800'
                } focus:outline-none focus:ring-2 focus:ring-metadite-primary`}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((cat) => cat !== 'all')
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(categoryFilter !== 'all' || priceFilter !== 'all') && (
          <div className="flex items-center flex-wrap mt-4 ml-2">
            <span
              className={`text-sm mr-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Active filters:
            </span>

            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center bg-metadite-primary/10 text-metadite-primary text-xs px-2 py-1 rounded-full mr-2">
                Category: {categoryFilter}
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="ml-1 hover:text-metadite-secondary"
                >
                  ×
                </button>
              </span>
            )}

            {priceFilter !== 'all' && (
              <span className="inline-flex items-center bg-metadite-primary/10 text-metadite-primary text-xs px-2 py-1 rounded-full">
                Price:{' '}
                {priceFilter === 'under100'
                  ? 'Under $100'
                  : priceFilter === '100to150'
                  ? '$100 - $150'
                  : 'Over $150'}
                <button
                  onClick={() => setPriceFilter('all')}
                  className="ml-1 hover:text-metadite-secondary"
                >
                  ×
                </button>
              </span>
            )}

            <button
              onClick={() => {
                setCategoryFilter('all');
                setPriceFilter('all');
              }}
              className="text-xs text-metadite-primary hover:underline ml-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Category Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            categoryFilter === 'all'
              ? 'bg-metadite-primary text-white'
              : theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Grid className="h-4 w-4 mr-2" />
          All Categories
        </button>

        {categories.filter(cat => cat !== 'all').map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              categoryFilter === category
                ? 'bg-metadite-primary text-white'
                : theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category === 'Premium' && <Tag className="h-4 w-4 mr-2" />}
            {category === 'Standard' && <Tag className="h-4 w-4 mr-2" />}
            {category === 'Limited Edition' && <Tag className="h-4 w-4 mr-2" />}
            {category}
          </button>
        ))}
      </div>
    </>
  );
};

export default ModelFilters;
