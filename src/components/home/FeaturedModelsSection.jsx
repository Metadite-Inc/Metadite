
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import ModelCard from '../ModelCard';
import { useState, useEffect } from 'react';

const FeaturedModelsSection = ({ models = [], loading = false, theme, user }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Responsive models per view
  const getModelsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 1024) return 1; // Mobile/Tablet: 1 model (for carousel)
      return 3; // Desktop: 3 models
    }
    return 3; // Default for SSR
  };

  const [modelsPerView, setModelsPerView] = useState(getModelsPerView());
  const totalSlides = Math.ceil(models.length / modelsPerView);
  
  // Desktop carousel state (separate from mobile)
  const [desktopCurrentSlide, setDesktopCurrentSlide] = useState(0);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newModelsPerView = getModelsPerView();
      if (newModelsPerView !== modelsPerView) {
        setModelsPerView(newModelsPerView);
        setCurrentSlide(0); // Reset mobile slide
        setDesktopCurrentSlide(0); // Reset desktop slide
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [modelsPerView]);

  // Auto-scroll functionality for mobile only
  useEffect(() => {
    if (models.length > 0 && modelsPerView === 1) {
      const interval = setInterval(() => {
        if (!isTransitioning) {
          setCurrentSlide((prev) => (prev + 1) % models.length);
        }
      }, 4000); // 4 seconds for mobile carousel

      return () => clearInterval(interval);
    }
  }, [models.length, isTransitioning, modelsPerView]);

  // Auto-scroll functionality for desktop carousel
  useEffect(() => {
    if (models.length > 0 && modelsPerView > 1 && totalSlides > 1) {
      const interval = setInterval(() => {
        if (!isTransitioning) {
          setDesktopCurrentSlide((prev) => (prev + 1) % totalSlides);
        }
      }, 6000); // 6 seconds for desktop carousel

      return () => clearInterval(interval);
    }
  }, [models.length, isTransitioning, modelsPerView, totalSlides]);

  const nextSlide = () => {
    if (!isTransitioning && models.length > 0) {
      setIsTransitioning(true);
      if (modelsPerView === 1) {
        // Mobile: cycle through individual models
        setCurrentSlide((prev) => (prev + 1) % models.length);
      } else {
        // Desktop: cycle through slides
        setDesktopCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
      setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
    }
  };

  const prevSlide = () => {
    if (!isTransitioning && models.length > 0) {
      setIsTransitioning(true);
      if (modelsPerView === 1) {
        // Mobile: cycle through individual models
        setCurrentSlide((prev) => (prev - 1 + models.length) % models.length);
      } else {
        // Desktop: cycle through slides
        setDesktopCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      }
      setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning && models.length > 0) {
      setIsTransitioning(true);
      if (modelsPerView === 1) {
        // Mobile: go to specific model
        if (index < models.length) {
          setCurrentSlide(index);
        }
      } else {
        // Desktop: go to specific slide
        if (index < totalSlides) {
          setDesktopCurrentSlide(index);
        }
      }
      setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Get grid columns based on screen size
  const getGridCols = () => {
    if (modelsPerView === 1) return 'grid-cols-1';
    if (modelsPerView === 2) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  // Get current slide models for desktop carousel
  const getCurrentSlideModels = () => {
    const slideIndex = modelsPerView === 1 ? currentSlide : desktopCurrentSlide;
    const startIndex = slideIndex * modelsPerView;
    const endIndex = startIndex + modelsPerView;
    const slideModels = models.slice(startIndex, endIndex);
    
    // Debug logging
    console.log('Carousel Debug:', {
      modelsPerView,
      slideIndex,
      startIndex,
      endIndex,
      totalModels: models.length,
      slideModels: slideModels.length,
      isMobile: modelsPerView === 1
    });
    
    return slideModels;
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
            {/* Navigation Arrows - Only show on desktop screens (lg and above) */}
            {models.length > 0 && (
              <>
                <button
                  onClick={prevSlide}
                  disabled={isTransitioning}
                  className={`carousel-nav-button absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg hidden lg:block ${
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
                  className={`carousel-nav-button absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg hidden lg:block ${
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

            {/* Models Container - Auto-scroll carousel on mobile, grid carousel on desktop */}
            <div className="relative overflow-hidden">
              {/* Mobile: Auto-scrolling carousel with manual scroll support */}
              <div 
                className="lg:hidden overflow-x-auto scrollbar-hide"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="flex gap-4 pb-4 transition-transform duration-500 ease-in-out"
                  style={{ 
                    width: 'max-content',
                    transform: `translateX(-${currentSlide * (320 + 16)}px)` // 320px card width + 16px gap
                  }}
                >
                  {models.map((model) => (
                    <div key={model.id} className="flex-shrink-0 w-80">
                      <ModelCard model={model} user={user} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Desktop: Grid carousel */}
              <div className={`hidden lg:grid ${getGridCols()} gap-8`}>
                {getCurrentSlideModels().map((model) => (
                  <ModelCard key={model.id} model={model} user={user} />
                ))}
              </div>
            </div>

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
