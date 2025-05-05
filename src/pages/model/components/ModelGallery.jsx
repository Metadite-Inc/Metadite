
import React from 'react';

const ModelGallery = ({ images, mainImage, setMainImage }) => {
  return (
    <div>
      {/* Large screens */}
      <div className="hidden sm:flex rounded-lg overflow-hidden bg-white mb-4 aspect-[3/4.5] h-100 w-96 items-center justify-center">
        <img 
          src={mainImage} 
          alt="Model" 
          className="w-full h-full object-contain"
        />
      </div>
      {/* Small screens */}
      <div className="flex sm:hidden rounded-lg overflow-hidden bg-white mb-4 w-100 h-100 aspect-[3/4.5] items-center justify-center">
        <img 
          src={mainImage} 
          alt="Model" 
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            className={`rounded-lg overflow-hidden border-2 ${mainImage === img ? 'border-metadite-primary' : 'border-transparent'}`}
            onClick={() => setMainImage(img)}
          >
            <img 
              src={img} 
              alt={`view ${index + 1}`} 
              className="w-full h-full object-cover aspect-square"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelGallery;
