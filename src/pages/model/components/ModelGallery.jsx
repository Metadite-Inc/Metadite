
import React from 'react';

const ModelGallery = ({ images, mainImage, setMainImage }) => {
  return (
    <div>
      <div className="rounded-lg overflow-hidden bg-white mb-4 aspect-square">
        <img 
          src={mainImage} 
          alt="Model" 
          className="w-full h-full object-cover"
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
