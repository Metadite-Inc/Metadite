import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModelCard from '../components/ModelCard';
import { Search, Filter, Bookmark, Grid, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../lib/api';

const Models = () => {
  const [models, setModels] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { theme } = useTheme();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalModels, setTotalModels] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const modelsPerPage = 10;

  // Prepare filters for API request
  const getFilterParams = () => {
    const filters = {};
    
    if (categoryFilter !== 'all') {
      filters.category = categoryFilter;
    }
    
    if (priceFilter !== 'all') {
      if (priceFilter === 'under100') {
        filters.price_lte = '100';
      } else if (priceFilter === '100to150') {
        filters.price_gte = '100';
        filters.price_lte = '150';
      } else if (priceFilter === 'over150') {
        filters.price_gte = '150';
      }
    }
    
    if (searchTerm) {
      filters.search = searchTerm;
    }
    
    return filters;
  };

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoaded(false);
      try {
        const filters = getFilterParams();
        const result = await apiService.getModels(currentPage, modelsPerPage, filters);
        setModels(result.models);
        setTotalModels(result.total);
        setTotalPages(result.totalPages);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to fetch models:', error);
        setIsLoaded(true);
      }
    };
    fetchModels();
  }, [currentPage, categoryFilter, priceFilter, searchTerm]);

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0); // Scroll to top when changing page
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0); // Scroll to top when changing page
    }
  };

  // Reset filters and search
  const clearFilters = () => {
    setCategoryFilter('all');
    setPriceFilter('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Apply search with slight delay for typing
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Get available categories from model data
  const categories = ['all', ...new Set(models.map((model) => model.category))];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div
        className={`flex-1 pt-24 pb-12 px-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}
      >
        <div className="container mx-auto max-w-6xl">
          <h1
            className={`text-3xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Our Model Collection
          </h1>
          <p className={`mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Explore our premium selection of beautifully crafted model dolls
          </p>

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
                    onChange={handleSearchChange}
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
                  onClick={clearFilters}
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
                {category === 'Premium' && <Bookmark className="h-4 w-4 mr-2" />}
                {category === 'Standard' && <Tag className="h-4 w-4 mr-2" />}
                {category === 'Limited Edition' && <Bookmark className="h-4 w-4 mr-2 fill-current" />}
                {category}
              </button>
            ))}
          </div>

          {isLoaded ? (
            models.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {models.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
                
                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-10 px-4">
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Showing {totalModels > 0 ? (currentPage - 1) * modelsPerPage + 1 : 0}-{Math.min(currentPage * modelsPerPage, totalModels)} of {totalModels} models
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-metadite-primary bg-opacity-10 text-metadite-primary hover:bg-opacity-20'
                      } transition-colors`}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </button>
                    <div className={`px-4 py-1 rounded-md bg-gray-100 ${theme === 'dark' ? 'text-gray-700' : 'text-gray-800'}`}>
                      {currentPage} of {totalPages || 1}
                    </div>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage >= totalPages}
                      className={`flex items-center px-3 py-1 rounded-md ${
                        currentPage >= totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-metadite-primary bg-opacity-10 text-metadite-primary hover:bg-opacity-20'
                      } transition-colors`}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p
                  className={`text-lg ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  No models found matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-metadite-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="glass-card rounded-xl overflow-hidden h-96 shimmer"></div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Models;
