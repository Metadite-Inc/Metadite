
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ModelGrid from '../components/models/ModelGrid';
import ModelFilters from '../components/models/ModelFilters';
import ModelPagination from '../components/models/ModelPagination';
import NoResults from '../components/models/NoResults';
import { useTheme } from '../context/ThemeContext';
import { detectUserRegion } from '../lib/utils';
import { apiService } from '../lib/api';
import { toast } from 'sonner';

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
  const modelsPerPage = 16; // Show 16 models per page for public view
  
  // Categories derived from fetched models
  const [categories, setCategories] = useState(['all']);
  const [userRegion, setUserRegion] = useState('usa'); // Default to 'usa'

  // Fetch categories on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Always try to detect region, regardless of authentication status
      try {
        const region = await detectUserRegion();
        setUserRegion(region);
      } catch (error) {
        console.error('Failed to detect region:', error);
        // Set default region on error
        setUserRegion('usa');
      }

      try {
        const predefinedCategories = ['all', 'limited_edition', 'standard', 'premium'];
        setCategories(predefinedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories(['all', 'limited_edition', 'standard']);
      }
    };
    fetchInitialData();
  }, []); // Only run once on mount

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoaded(false);
        const skip = (currentPage - 1) * modelsPerPage;
        
        let response;
        if (categoryFilter === 'all') {
          // Fetch all models with pagination
          response = await apiService.getModels(userRegion, skip, modelsPerPage);
        } else {
          // Fetch filtered models by category
          response = await apiService.getModelsByCategory(categoryFilter, skip, modelsPerPage);
        }
        
        if (response && response.data) {
          setModels(response.data);
          setTotalModels(response.total || 0);
        } else {
          // Handle empty response
          setModels([]);
          setTotalModels(0);
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to fetch models:', error);
        // Reset state on error
        setModels([]);
        setTotalModels(0);
        setIsLoaded(true);
        // Show error toast
        toast.error('Failed to load models. Please try again.');
      }
    };
    
    // Add a small delay to prevent rapid successive calls
    const timeoutId = setTimeout(fetchModels, 100);
    return () => clearTimeout(timeoutId);
  }, [currentPage, categoryFilter, userRegion, modelsPerPage]); // Add modelsPerPage to dependencies

  // Filter models based on search and price filters (category filtering now handled by API)
  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesPrice = true;
    if (priceFilter === 'under1000' && model.price < 1000) matchesPrice = true;
    else if (priceFilter === '1000to1500' && model.price >= 1000 && model.price <= 1500) matchesPrice = true;
    else if (priceFilter === 'over1500' && model.price > 1500) matchesPrice = true;
    else if (priceFilter !== 'all') matchesPrice = false;

    return matchesSearch && matchesPrice;
  });

  // Calculate pagination values - use totalModels for pagination, filteredModels for display
  const totalItems = totalModels;
  const totalPages = Math.max(1, Math.ceil(totalItems / modelsPerPage));

  // Page change handler
  const handlePageChange = (pageNumber) => {
    // Validate page number
    if (pageNumber < 1 || pageNumber > totalPages) {
      console.warn(`Invalid page number: ${pageNumber}`);
      return;
    }
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show loading state during page changes
  const isPageChanging = !isLoaded;

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

  // Validate current page when totalPages changes
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

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
                    isLoading={isPageChanging}
                  />
                )}

                {/* Display info about pagination */}
                <div className="text-center text-sm text-gray-500 mt-4">
                  Page {currentPage} of {totalPages} | 
                  Showing {filteredModels.length} of {totalItems} models
                  {(searchTerm || priceFilter !== 'all') && ` (filtered results)`}
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
