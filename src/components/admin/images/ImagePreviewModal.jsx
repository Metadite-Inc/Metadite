import React from 'react';
import { X } from 'lucide-react';

const ImagePreviewModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="max-w-full max-h-[80vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-sm">
          <p className="text-center">Click outside or press ESC to close</p>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
