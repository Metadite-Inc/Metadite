
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
  const [totalModels, setTotalModels] = useState(0);
  const modelsPerPage = 24;
  
  // Categories derived from fetched models
  const [categories, setCategories] = useState(['all']);

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        // Fetch all models in batches to retrieve all categories
        const batchSize = 50; // Define a constant for batch size
        let allModels = [];
        let skip = 0;
        let hasMore = true;
        
        while (hasMore) {
          const response = await apiService.getModels(skip, batchSize);
          allModels = [...allModels, ...response.data];
          hasMore = response.data.length === batchSize; // Continue if batch is full
          skip += batchSize;
        }
        
        const uniqueCategories = ['all', ...new Set(allModels.map((model) => model.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchAllCategories();
  }, []); // Only run once on mount

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoaded(false);
        const skip = (currentPage - 1) * modelsPerPage;
        
        let response;
        if (categoryFilter === 'all') {
          // Fetch all models with pagination
          response = await apiService.getModels(skip, modelsPerPage);
        } else {
          // Fetch filtered models by category
          response = await apiService.getModelsByCategory(categoryFilter, skip, modelsPerPage);
        }
        
        setModels(response.data);
        setTotalModels(response.total);
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to fetch models:', error);
        setIsLoaded(true);
      }
    };
    fetchModels();
  }, [currentPage, categoryFilter]); // Add categoryFilter to dependencies

  // Filter models based on search and price filters (category filtering now handled by API)
  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesPrice = true;
    if (priceFilter === 'under200' && model.price < 200) matchesPrice = true;
    else if (priceFilter === '200to550' && model.price >= 200 && model.price <= 550) matchesPrice = true;
    else if (priceFilter === 'over550' && model.price > 550) matchesPrice = true;
    else if (priceFilter !== 'all') matchesPrice = false;

    return matchesSearch && matchesPrice;
  });

  // Calculate pagination values
  const totalItems = totalModels;
  const totalPages = Math.ceil(totalItems / modelsPerPage);

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

  console.log("Pagination info:", { currentPage, totalPages, modelsPerPage, totalItems, filteredModelsCount: filteredModels.length });

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
                <ModelGrid models={filteredModels} isLoaded={isLoaded} />
                
                {totalPages > 1 && (
                  <ModelPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                  />
                )}

                {/* Display info about pagination */}
                <div className="text-center text-sm text-gray-500 mt-4">
                  Page {currentPage} of {totalPages} | 
                  Showing {Math.min((currentPage - 1) * modelsPerPage + 1, totalItems)} - {Math.min(currentPage * modelsPerPage, totalItems)} of {totalItems} models
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
