import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { slideshowApi } from '../../lib/api/slideshow_api';

const HeroSection = ({ isLoaded, user, hasVipAccess, theme }) => {
  const [slideshowItems, setSlideshowItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = React.useRef(null);

  useEffect(() => {
    // Load slideshow items from API
    const fetchSlides = async () => {
      try {
        const data = await slideshowApi.getSlideshows();
        setSlideshowItems(data);
      } catch {
        setSlideshowItems([]);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (!slideshowItems.length || isPaused) return;
    const current = slideshowItems[currentSlide];
    let interval;
    if (current && current.type !== 'video') {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideshowItems.length);
      }, 3000);
    }
    return () => interval && clearInterval(interval);
  }, [slideshowItems, currentSlide, isPaused]);
  return (
    <section className={`pt-5 px-2 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className={`md:w-1/2 md:pr-8 mb-8 md:mb-0 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="inline-block px-3 py-1 bg-metadite-primary/10 text-metadite-primary rounded-full text-sm font-medium mb-4">
              Curated intimacy
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-metadite-dark via-metadite-primary to-metadite-secondary bg-clip-text text-transparent">
              A New Era of Connection
            </h1>
            <p className="text-gray-600 text-lg mb-6">
            Where every glance lingers a little longer, every word touches a little deeper, and intimacy, access, and interaction blend into an irresistible experience that leaves you wanting more.
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
          
          <div className={`pt-5 pb-10 md:pl-10 md:w-1/2 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} flex justify-center md:block`}>
            <div className="relative">
              {/* Slideshow Start */}
              <div className="relative w-full max-w-[97vw] px-1 sm:w-96 sm:max-w-full sm:px-0 mx-auto aspect-[3/4.3] rounded-xl z-10 min-h-[420px] max-h-[480px] overflow-hidden">

                {slideshowItems.length === 0 && (
                  <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-gray-100 rounded-xl animate-pulse">
                    <span className="text-gray-400">Welcome to metadite </span>
                  </div>
                )}
                {slideshowItems.map((item, idx) => {
                  // More creative effects: drop, water, love, etc. (width/aspect unchanged)
                  const effects = [
                    // Drop-in (slide from top)
                    currentSlide === idx ? 'translate-y-0 opacity-100 z-20 transition-all duration-700 ease-in-out' : '-translate-y-16 opacity-0 z-0 transition-all duration-700 ease-in-out',
                    // Water ripple (scale/skew)
                    currentSlide === idx ? 'scale-110 opacity-100 z-20 transition-all duration-700 ease-in-out' : 'scale-90 skew-y-0 opacity-0 z-0 transition-all duration-700 ease-in-out',
                    // Love (pulse/scale with pink shadow)
                    currentSlide === idx ? 'scale-105 animate-pulse shadow-pink-300 shadow-lg opacity-100 z-20 transition-all duration-700 ease-in-out' : 'scale-90 opacity-0 z-0 transition-all duration-700 ease-in-out',
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
                      key={item.url || idx}
                      className={`absolute top-0 left-0 w-50 h-50 flex items-center justify-center ${effect} ${loveShadow}`}
                      style={{ position: 'absolute' }}
                    >
                      <div className={`w-full h-full p-1 bg-white/80 dark:bg-gray-900/60 rounded-xl border-2 border-metadite-primary/40 flex items-center justify-center shadow-2xl relative group ${loveShadow}`}>
                        {item.type === 'video' ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover rounded-lg drop-shadow-xl scale-90"
                            style={{ display: 'block', transition: 'transform 0.7s, filter 0.7s', filter: currentSlide === idx ? 'brightness(1) contrast(1.1)' : 'brightness(0.8) blur(2px)' }}
                            autoPlay
                            muted
                            playsInline
                            ref={currentSlide === idx ? videoRef : null}
                            onEnded={() => setCurrentSlide((prev) => (prev + 1) % slideshowItems.length)}
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={item.name || `Slide ${idx + 1}`}
                            className="w-full h-full object-contain rounded-lg drop-shadow-xl scale-90"
                            style={{ display: 'block', transition: 'transform 0.7s, filter 0.7s', filter: currentSlide === idx ? 'brightness(1) contrast(1.1)' : 'brightness(0.8) blur(2px)' }}
                          />
                        )}
                        {/* Pause/Play Button - bottom right, always on mobile, hover on desktop */}
                        {currentSlide === idx && (
                          <button
                            className="absolute bottom-3 right-3 z-30 flex items-center px-3 py-1 bg-gray-800 text-white rounded-full shadow hover:bg-gray-700 transition-colors text-xs flex sm:flex md:hidden lg:hidden xl:hidden 2xl:hidden group-hover:flex"
                            style={{ pointerEvents: 'auto' }}
                            onClick={() => {
                              setIsPaused((prev) => {
                                const next = !prev;
                                if (videoRef.current) {
                                  if (next) videoRef.current.pause();
                                  else videoRef.current.play();
                                }
                                return next;
                              });
                            }}
                          >
                            {isPaused ? (
                              <span>&#9654;</span>
                            ) : (
                              <span>&#10073;&#10073;</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* Dots Navigation */}
                {slideshowItems.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                    {slideshowItems.map((_, idx) => (
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
              {/*<div className="text-sm absolute top-0 right-10 bg-white/70 backdrop-blur-sm rounded-full py-0 px-1 shadow-lg z-10">
                <span className="text-metadite-primary font-bold">Our Models</span>
              </div>*/}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;