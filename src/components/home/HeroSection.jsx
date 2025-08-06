import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { slideshowApi } from '../../lib/api/slideshow_api';

// Typewriter hook for word-by-word animation
function useTypewriterWords(words, typingSpeed = 200, deletingSpeed = 80, pause = 1200) {
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    if (isPaused) return;
    const currentWord = words[wordIndex];
    if (!isDeleting) {
      if (charIndex < currentWord.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(currentWord.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
      } else {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), pause);
      }
    } else {
      if (charIndex > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayed(currentWord.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, deletingSpeed);
      } else {
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(false);
          setWordIndex((wordIndex + 1) % words.length);
        }, 500);
      }
    }
    return () => clearTimeout(timeoutRef.current);
  }, [charIndex, isDeleting, wordIndex, isPaused, words, typingSpeed, deletingSpeed, pause]);

  // Pause on hover/focus for accessibility
  const pauseHandlers = {
    onMouseEnter: () => setIsPaused(true),
    onMouseLeave: () => setIsPaused(false),
    onFocus: () => setIsPaused(true),
    onBlur: () => setIsPaused(false),
  };

  return [displayed, pauseHandlers];
}

const HeroSection = ({ isLoaded, user, hasVipAccess, theme }) => {
  const [slideshowItems, setSlideshowItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [nextSlide, setNextSlide] = useState(null);
  const videoRef = React.useRef(null);
  const timeoutRef = React.useRef(null);

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

  // Custom crossfade logic
  useEffect(() => {
    if (!slideshowItems.length || isPaused) return;
    const current = slideshowItems[currentSlide];
    let interval;
    if (current && current.type !== 'video') {
      interval = setInterval(() => {
        handleNextSlide();
      }, 3500);
    }
    return () => interval && clearInterval(interval);
  }, [slideshowItems, currentSlide, isPaused]);

  // Handle next slide with crossfade
  function handleNextSlide(idx = null) {
    if (transitioning) return;
    setTransitioning(true);
    setNextSlide(idx !== null ? idx : (currentSlide + 1) % slideshowItems.length);
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide(idx !== null ? idx : (currentSlide + 1) % slideshowItems.length);
      setTransitioning(false);
      setNextSlide(null);
    }, 600); // Crossfade duration
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  const fixedPrefix = 'Your ';
  const fixedSuffix = ' Awaits';
  const animatedWords = ['Ultimate Companion'];
  const [typewriterText, typewriterHandlers] = useTypewriterWords(animatedWords, 200, 80, 1200);

  return (
    <section className={`pt-20 px-2 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-metadite-light to-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className={`md:w-3/5 md:pr-12 mb-8 md:mb-0 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="inline-block px-3 py-1 bg-metadite-primary/10 text-metadite-primary rounded-full text-sm font-medium mb-4">
              Real. Touchable. Irresistible.
            </span>
            <h1
              className="text-2xl md:text-5xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-metadite-dark via-metadite-primary to-metadite-secondary bg-clip-text text-transparent relative leading-tight"
              tabIndex={0}
            >
              <span {...typewriterHandlers}>
                <div className="leading-tight">
                  <div className="mb-1">{fixedPrefix}</div>
                  <div className="inline-block bg-gradient-to-r from-metadite-primary to-metadite-secondary  rounded text-white">
                    {typewriterText}
                    <span className="typewriter-cursor">|</span>
                  </div>
                  <div>{fixedSuffix}</div>
                </div>
              </span>
            </h1>
            <p className="text-gray-600 text-lg mb-6">
            Metadite isn’t fantasy — it’s real pleasure. Choose your perfect doll and make her yours today.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/models"
                className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg font-medium text-sm sm:text-base"
              >
                Browse Models
              </Link>
             {/* {!user && (
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
              )}*/}
            </div>
          </div>
          
          <div className={`pt-0 pb-10 md:pl-8 md:w-2/5 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} flex justify-center md:block`}>
            <div className="relative">
              {/* Slideshow Start */}
              <div className="relative w-screen max-w-none px-0 mx-0 rounded-none sm:w-auto sm:max-w-[97vw] sm:px-0 sm:mx-auto sm:rounded-xl aspect-[3.2/5.4] z-10 min-h-[420px] max-h-[500px] overflow-hidden">

                {slideshowItems.length === 0 && (
                  <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-gray-100 rounded-xl animate-pulse">
                    <span className="text-gray-400">Welcome to metadite </span>
                  </div>
                )}
                {slideshowItems.map((item, idx) => {
                  const isActive = currentSlide === idx;
                  const isNext = nextSlide === idx;
                  // More creative effects: drop, water, love, etc. (width/aspect unchanged)
                  const effects = [
                    // Drop-in (slide from top)
                    isActive ? 'translate-y-0 opacity-100 z-20 transition-all duration-700 ease-in-out' : '-translate-y-16 opacity-0 z-0 transition-all duration-700 ease-in-out',
                    // Water ripple (scale/skew)
                    currentSlide === idx ? 'scale-110 skew-y-0 opacity-100 z-20 transition-all duration-700 ease-in-out' : 'scale-90 skew-y-0 opacity-0 z-0 transition-all duration-700 ease-in-out',
                    // Love (scale with pink shadow, no pulse)
                    currentSlide === idx ? 'scale-105 shadow-pink-300 shadow-lg opacity-100 z-20 transition-all duration-700 ease-in-out' : 'scale-90 opacity-0 z-0 transition-all duration-700 ease-in-out',
                    // Classic fade/zoom
                    currentSlide === idx ? 'scale-100 opacity-100 z-20 transition-all duration-700 ease-in-out' : 'scale-90 opacity-0 z-0 transition-all duration-700 ease-in-out',
                    // Rotate/zoom
                    currentSlide === idx ? 'scale-105 rotate-2 opacity-100 z-20 transition-all duration-700 ease-in-out' : 'scale-90 opacity-0 z-0 transition-all duration-700 ease-in-out',
                  ];
                  return (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-all duration-600 ease-in-out z-10 slide-fade ${isActive ? (transitioning ? 'opacity-0' : 'opacity-100 z-20') : isNext ? 'opacity-100 z-30' : 'opacity-0 z-0'}`}
                      style={{
                        transition: 'opacity 0.6s, transform 0.6s, filter 0.6s',
                        opacity: isActive && !transitioning ? 1 : isNext ? 1 : 0,
                        pointerEvents: isNext ? 'auto' : 'none',
                        transform: isNext ? 'scale(1.03)' : 'scale(1)',
                        //filter: isNext ? 'brightness(1.1) contrast(1.15)' : 'brightness(0.9) blur(1.5px)',
                      }}
                    >
                      {item.type === 'video' ? (
                        <video
                          key={isActive ? `video-active-${currentSlide}` : `video-inactive-${idx}`}
                          src={item.url}
                          className="w-full h-full object-cover rounded-lg drop-shadow-xl"
                          style={{ display: 'block', width: '100%', height: '100%', margin: 'auto' }}
                          autoPlay
                          muted
                          playsInline
                          ref={isActive ? videoRef : null}
                          onEnded={() => {
                            if (slideshowItems.length > 1) {
                              handleNextSlide();
                            } else {
                              if (videoRef.current) videoRef.current.currentTime = 0;
                              if (videoRef.current) videoRef.current.play();
                            }
                          }}
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.name || `Slide ${idx + 1}`}
                          className="w-full h-full object-contain rounded-lg drop-shadow-xl"
                          style={{ display: 'block', width: '100%', height: '100%' }}
                        />
                      )}
                      {/* Pause/Play Button - bottom right, always on mobile, hover on desktop */}
                      {isNext && (
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
                  );
                })}
                {/* Dots Navigation */}
                {slideshowItems.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                    {slideshowItems.map((_, idx) => (
                      <button
                        key={idx}
                        className={`w-2 h-2 rounded-full ${currentSlide === idx ? 'bg-metadite-primary' : 'bg-gray-300'} focus:outline-none`}
                        onClick={() => handleNextSlide(idx)}
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
}

export default HeroSection;