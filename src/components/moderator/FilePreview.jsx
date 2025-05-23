
import React from 'react';
import { FileImage, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const FilePreview = ({ selectedFile, previewUrl, clearSelectedFile }) => {
  const { theme } = useTheme();
  
  if (!selectedFile) return null;
  
  return (
    <div className={`p-2 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {previewUrl ? (
            <div className="h-16 w-16 overflow-hidden rounded-md">
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className={`h-12 w-12 flex items-center justify-center rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <FileImage className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          )}
          <span className={`text-sm truncate max-w-[150px] ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {selectedFile.name}
          </span>
        </div>
        <button 
          onClick={clearSelectedFile}
          className={`p-1 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default FilePreview;
