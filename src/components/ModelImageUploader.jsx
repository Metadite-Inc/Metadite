import React, { useState, useRef } from 'react';
import { Image, Upload } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ModelImageUploader = ({ onImageChange }) => {
  const { theme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // Check if the file is an image
      if (!file.type.match('image.*')) {
        alert('Please upload an image file');
        return;
      }
      onImageChange(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onImageChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragging 
          ? 'border-metadite-primary bg-metadite-primary/10' 
          : 'border-gray-300 hover:border-metadite-primary hover:bg-gray-50'}
        ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center">
        <div className={`p-3 rounded-full mb-2 
          ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Upload className={`h-6 w-6 
            ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`} />
        </div>
        <p className={`text-sm font-medium 
          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          Drag and drop an image here, or click to select
        </p>
        <p className={`text-xs mt-1 
          ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </div>
  );
};

export default ModelImageUploader;