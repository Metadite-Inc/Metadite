
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { apiService } from '../../lib/api';

const HeroSection = ({ isLoaded, user, hasVipAccess, theme }) => {
  const [modelImages, setModelImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    apiService.getModels()
      .then(models => {
        if (!isMounted) return;
        const images = models
          .map(m => m.image)
          .filter(Boolean)
          .slice(0, 5);
        setModelImages(images);
        setLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        setError('Failed to load images');
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!modelImages.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % modelImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [modelImages]);
  return (
    <section className={`pt-24 px-2 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className={`md:w-1/2 md:pr-8 mb-8 md:mb-0 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="inline-block px-3 py-1 bg-metadite-primary/10 text-metadite-primary rounded-full text-sm font-medium mb-4">
              Premium Collectibles
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-metadite-dark via-metadite-primary to-metadite-secondary bg-clip-text text-transparent">
              Discover Exquisite Model Dolls
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Explore our collection of beautifully crafted model dolls with premium quality and attention to detail. Join our VIP membership for exclusive content.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/models"
                className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg font-medium"
              >
                Browse Models
              </Link>
              {!user && (
                <Link 
                  to="/login"
                  className="border-2 border-metadite-primary text-metadite-primary px-6 py-3 rounded-lg hover:bg-metadite-primary/5 transition-colors font-medium"
                >
                  Join VIP
                </Link>
              )}
              {user && !hasVipAccess && (
                <Link 
                  to="/upgrade"
                  className="border-2 border-metadite-primary text-metadite-primary px-6 py-3 rounded-lg hover:bg-metadite-primary/5 transition-colors font-medium"
                >
                  Upgrade to VIP
                </Link>
              )}
            </div>
          </div>
          
          <div className={`pt-5 pb-5 md:pl-10 md:w-1/2 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} flex justify-center md:block`}>
            <div className="relative">
              {/* Slideshow Start - Increased height */}
              <div className="relative w-11/18 max-w-sm sm:max-w-10 md:max-w-xl lg:max-w-2xl mx-auto md:w-full aspect-[4/3] h-auto rounded-xl z-10 min-h-[300px] max-h-[450px] md:min-h-[350px] md:max-h-[500px] overflow-hidden">
                {/* Navigation Buttons */}
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-metadite-primary/90 text-metadite-primary hover:text-white rounded-full p-2 shadow transition-colors focus:outline-none"
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + modelImages.length) % modelImages.length)}
                  aria-label="Previous slide"
                  style={{ backdropFilter: 'blur(4px)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-metadite-primary/90 text-metadite-primary hover:text-white rounded-full p-2 shadow transition-colors focus:outline-none"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % modelImages.length)}
                aria-label="Next slide"
                style={{ backdropFilter: 'blur(4px)' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
                {loading && (
                  <div className="flex items-center justify-center w-full h-full min-h-[250px] bg-gray-100 rounded-xl animate-pulse">
                    <span className="text-gray-400">Loading images...</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center justify-center w-full h-full min-h-[250px] bg-red-50 rounded-xl">
                    <span className="text-red-500">{error}</span>
                  </div>
                )}
                {!loading && !error && modelImages.map((img, idx) => {
                  // More creative effects: drop, water, love, etc. (width/aspect unchanged)
                  const effects = [
                    // Drop-in (slide from top)
                    currentSlide === idx ? 'translate-y-0 opacity-100 z-20 transition-all duration-700 ease-in-out' : '-translate-y-16 opacity-0 z-0 transition-all duration-700 ease-in-out',
                    // Water ripple (scale/skew)
                    currentSlide === idx ? 'scale-110 skew-y-2 opacity-100 z-20 transition-all duration-700 ease-in-out' : 'scale-90 skew-y-0 opacity-0 z-0 transition-all duration-700 ease-in-out',
                    // Love (pulse/scale with pink shadow)
                    currentSlide === idx ? 'scale-105 animate-pulse shadow-pink-300 shadow-lg opacity-100 z-20 transition-all duration-700 ease-in-out' : 'scale-90 opacity-0 z-0 transition-all duration-700 ease-in-out',
                    // Classic fade/zoom
                    currentSlide === idx ? 'scale-100 opacity-100 z-20 transition-all duration-700 ease-in-out' : 'scale-90 opacity-0 z-0 transition-all duration-700 ease-in-out',
                    // Rotate/zoom
                    currentSlide === idx ? 'scale-105 rotate-2 opacity-100 z-20 transition-all duration-700 ease-in-out' : 'scale-90 opacity-0 z-0 transition-all duration-700 ease-in-out',
                    // Water drop (scaleY)
                    currentSlide === idx ? 'scale-y-110 opacity-100 z-20 transition-all duration-700 ease-in-out' : 'scale-y-90 opacity-0 z-0 transition-all duration-700 ease-in-out',
                  ];
                  const effect = effects[idx % effects.length];
                  // For love effect, add a pink shadow only on the active slide
                  const loveShadow = (idx % effects.length === 2 && currentSlide === idx) ? 'shadow-pink-400/70' : '';
                  return (
                    <div
                      key={img}
                      className={`absolute top-0 left-0 w-full h-full flex items-center justify-center ${effect} ${loveShadow}`}
                      style={{ position: 'absolute' }}
                    >
                      <div className={`w-[97%] h-[97%] p-1 bg-white/80 dark:bg-gray-900/60 rounded-xl border-2 border-metadite-primary/40 flex items-center justify-center shadow-2xl ${loveShadow}`}>
                        <img
                          src={img}
                          alt={`Model ${idx + 1}`}
                          className="w-full h-full object-contain rounded-lg drop-shadow-xl"
                          style={{ 
                            display: 'block', 
                            transition: 'transform 0.7s, filter 0.7s', 
                            filter: currentSlide === idx ? 'brightness(1) contrast(1.1)' : 'brightness(0.8) blur(2px)',
                            maxHeight: '100%'
                          }}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  );
                })}
                {/* Dots Navigation */}
                {!loading && !error && modelImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                    {modelImages.map((_, idx) => (
                      <button
                        key={idx}
                        className={`w-2 h-2 rounded-full ${currentSlide === idx ? 'bg-metadite-primary' : 'bg-gray-300'} focus:outline-none`}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* Slideshow End */}
              <div className="text-sm absolute top-0 right-6 bg-white/70 backdrop-blur-sm rounded-full py-0 px-1 shadow-lg z-10">
                <span className="text-metadite-primary font-bold">New Collection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
