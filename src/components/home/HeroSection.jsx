
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
    <section className={`pt-24 pb-20 px-2 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
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
          
          <div className={`pt-10 md:pl-32 md:w-1/2 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} flex justify-center md:block`}>
            <div className="relative">
             {/* <div className="absolute -top-2 -right-2 -bottom-2 -left-2 bg-gradient-to-br from-metadite-primary/20 via-metadite-secondary/20 to-metadite-accent/20 rounded-xl animate-pulse-soft"></div> */}
              {/* Slideshow Start */}
              <div className="relative w-11/12 max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto md:w-full aspect-[4/3] h-auto rounded-xl z-10 min-h-[260px] max-h-[400px] md:min-h-[260px] md:max-h-[400px]">
                {loading && (
                  <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-gray-100 rounded-xl animate-pulse">
                    <span className="text-gray-400">Loading images...</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center justify-center w-full h-full min-h-[180px] bg-red-50 rounded-xl">
                    <span className="text-red-500">{error}</span>
                  </div>
                )}
                {!loading && !error && modelImages.map((img, idx) => (
                  <div
                    key={img}
                    className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-700 ${currentSlide === idx ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}
                    style={{ position: 'absolute' }}
                  >
                    <div className="w-[97%] h-[97%] p-1 bg-white/80 dark:bg-gray-900/60 rounded-xl border-2 border-metadite-primary/40 flex items-center justify-center">
                      <img
                        src={img}
                        alt={`Model ${idx + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                        style={{ display: 'block' }}
                      />
                    </div>
                  </div>
                ))}
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
              <div className="text-sm absolute top-0 right-5 bg-white/70 backdrop-blur-sm rounded-full py-0 px-1 shadow-lg z-10">
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
