import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModelGrid from '../components/models/ModelGrid';
import ModelFilters from '../components/models/ModelFilters';
import ModelPagination from '../components/models/ModelPagination';
import NoResults from '../components/models/NoResults';
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
  const modelsPerPage = 12;

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const fetchedModels = await apiService.getModels();
        setModels(fetchedModels);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to fetch models:', error);
        setIsLoaded(true);
      }
    };
    fetchModels();
  }, []);

  // Filter models based on search and filters
  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || model.category === categoryFilter;

    let matchesPrice = true;
    if (priceFilter === 'under100' && model.price < 100) matchesPrice = true;
    else if (priceFilter === '100to150' && model.price >= 100 && model.price <= 150) matchesPrice = true;
    else if (priceFilter === 'over150' && model.price > 150) matchesPrice = true;
    else if (priceFilter !== 'all') matchesPrice = false;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);
  const indexOfLastModel = currentPage * modelsPerPage;
  const indexOfFirstModel = indexOfLastModel - modelsPerPage;
  const currentModels = filteredModels.slice(indexOfFirstModel, indexOfLastModel);

  // Page change handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setPriceFilter('all');
    setCategoryFilter('all');
    setCurrentPage(1); // Also reset to first page when filters change
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, priceFilter, categoryFilter]);

  // Get available categories from model data
  const categories = ['all', ...new Set(models.map((model) => model.category))];

  console.log("Pagination info:", { currentPage, totalPages, modelsPerPage, filteredModelsCount: filteredModels.length });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div
        className={`flex-1 pt-24 pb-16 px-4 ${
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

          <ModelFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            categories={categories}
          />

          {isLoaded ? (
            filteredModels.length > 0 ? (
              <>
                <ModelGrid models={currentModels} isLoaded={isLoaded} />
                
                {totalPages > 1 && (
                  <ModelPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                  />
                )}

                {/* Display info about pagination for debugging */}
                <div className="text-center text-sm text-gray-500 mt-4">
                  Page {currentPage} of {totalPages} | 
                  Showing {(currentPage - 1) * modelsPerPage + 1} - {Math.min(currentPage * modelsPerPage, filteredModels.length)} of {filteredModels.length} models
                </div>
              </>
            ) : (
              <NoResults resetFilters={resetFilters} />
            )
          ) : (
            <ModelGrid models={[]} isLoaded={isLoaded} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Models;
