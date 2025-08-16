
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import ModelCard from '../ModelCard';
import { useState, useEffect } from 'react';

const FeaturedModelsSection = ({ models = [], loading = false, theme, user }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Responsive models per view
  const getModelsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1; // Mobile: 1 model
      if (window.innerWidth < 1024) return 2; // Tablet: 2 models
      return 3; // Desktop: 3 models
    }
    return 3; // Default for SSR
  };

  const [modelsPerView, setModelsPerView] = useState(getModelsPerView());
  const totalSlides = Math.ceil(models.length / modelsPerView);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newModelsPerView = getModelsPerView();
      if (newModelsPerView !== modelsPerView) {
        setModelsPerView(newModelsPerView);
        setCurrentSlide(0); // Reset to first slide when screen size changes
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [modelsPerView]);

  // Auto-scroll functionality with smooth transitions
  useEffect(() => {
    if (models.length > modelsPerView && totalSlides > 1) {
      const interval = setInterval(() => {
        if (!isTransitioning) {
          setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }
      }, 6000); // 6 seconds for slower transitions

      return () => clearInterval(interval);
    }
  }, [models.length, totalSlides, isTransitioning, modelsPerView]);

  const nextSlide = () => {
    if (!isTransitioning && totalSlides > 1) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      setTimeout(() => setIsTransitioning(false), 800); // Match transition duration
    }
  };

  const prevSlide = () => {
    if (!isTransitioning && totalSlides > 1) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      setTimeout(() => setIsTransitioning(false), 800); // Match transition duration
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentSlide && index < totalSlides) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 800); // Match transition duration
    }
  };

  // Get grid columns based on screen size
  const getGridCols = () => {
    if (modelsPerView === 1) return 'grid-cols-1';
    if (modelsPerView === 2) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  // Get current slide models
  const getCurrentSlideModels = () => {
    const startIndex = currentSlide * modelsPerView;
    const endIndex = startIndex + modelsPerView;
    return models.slice(startIndex, endIndex);
  };

  return (
    <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Featured Models</h2>
          <Link
            to="/models"
            className="inline-flex items-center bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white rounded-md px-3 py-1.5 sm:px-4 sm:py-2 font-medium shadow hover:opacity-90 focus:ring-2 focus:ring-metadite-primary transition text-sm sm:text-base whitespace-nowrap"
          >
            <span>View All</span>
            <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
          </Link>
        </div>
        
        {loading ? (
          <div className={`grid ${getGridCols()} gap-8`}>
            {Array.from({ length: modelsPerView }, (_, i) => (
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
          <div className="featured-carousel-container">
            {/* Navigation Arrows - Only show if there are more models than can fit in one view */}
            {models.length > modelsPerView && totalSlides > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={isTransitioning}
                  className={`carousel-nav-button absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50' 
                      : 'bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50'
                  }`}
                  aria-label="Previous featured models"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={isTransitioning}
                  className={`carousel-nav-button absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50' 
                      : 'bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-50'
                  }`}
                  aria-label="Next featured models"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Models Container - Simplified approach */}
            <div className="relative overflow-hidden">
              <div className={`grid ${getGridCols()} gap-8`}>
                {getCurrentSlideModels().map((model) => (
                  <ModelCard key={model.id} model={model} user={user} />
                ))}
              </div>
            </div>

            {/* Dots Indicator - Only show if there are multiple slides */}
            {models.length > modelsPerView && totalSlides > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalSlides }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    disabled={isTransitioning}
                    className={`carousel-dot w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'active'
                        : theme === 'dark'
                        ? 'bg-gray-600 hover:bg-gray-500'
                        : 'bg-gray-300 hover:bg-gray-400'
                    } ${isTransitioning ? 'pointer-events-none' : ''}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              No featured models available at the moment.
            </p>
            <Link 
              to="/models" 
              className="inline-block mt-4 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity w-full sm:w-auto text-center"
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
