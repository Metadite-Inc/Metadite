
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ImageCarousel = ({ images, theme }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const effectTypes = [
    // Drop-in effect
    (isActive) => isActive ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0',
    // Water ripple effect
    (isActive) => isActive ? 'scale-110 skew-y-2 opacity-100' : 'scale-90 skew-y-0 opacity-0',
    // Love effect with shadow
    (isActive) => isActive ? 'scale-105 animate-pulse shadow-pink-300 shadow-lg opacity-100' : 'scale-90 opacity-0',
    // Classic fade/zoom
    (isActive) => isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
    // Rotate/zoom
    (isActive) => isActive ? 'scale-105 rotate-2 opacity-100' : 'scale-90 opacity-0',
    // Water drop (scaleY)
    (isActive) => isActive ? 'scale-y-110 opacity-100' : 'scale-y-90 opacity-0',
  ];

  return (
    <Carousel 
      className="w-full max-w-xl"
      setApi={(api) => {
        api?.on('select', () => {
          setCurrentSlide(api.selectedScrollSnap());
        });
      }}
    >
      <CarouselContent className="h-[450px]">
        {images.map((img, idx) => {
          const effectFn = effectTypes[idx % effectTypes.length];
          const effectClass = effectFn(idx === currentSlide);
          const loveShadow = (idx % effectTypes.length === 2 && idx === currentSlide) ? 'shadow-pink-400/70' : '';
          
          return (
            <CarouselItem key={idx} className="h-full flex items-center justify-center">
              <div className={`relative w-full h-full transition-all duration-700 ease-in-out ${effectClass} ${loveShadow} z-10`}>
                <div className={`w-[97%] h-[97%] mx-auto p-1 bg-white/80 dark:bg-gray-900/60 rounded-xl border-2 border-metadite-primary/40 flex items-center justify-center shadow-2xl ${loveShadow}`}>
                  <img
                    src={img}
                    alt={`Slide ${idx + 1}`}
                    className="w-full h-full object-contain rounded-lg drop-shadow-xl"
                    style={{ 
                      transition: 'filter 0.7s',
                      filter: idx === currentSlide ? 'brightness(1) contrast(1.1)' : 'brightness(0.8) blur(2px)',
                      maxHeight: '100%'
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
      
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${currentSlide === idx ? 'bg-metadite-primary' : 'bg-gray-300'} focus:outline-none`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default ImageCarousel;
