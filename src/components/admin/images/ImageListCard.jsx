import React from 'react';
import ImageTable from './ImageTable';

const ImageListCard = ({ 
  images, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  selectedModel, 
  handleModelChange, 
  models,
  getModelNameById,
  handleDeleteImage
}) => {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold">Manage Images</h2>
        {/* You can add a search bar here if needed */}
        <input
          type="text"
          placeholder="Search images..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary text-sm"
        />
      </div>
      <ImageTable 
        images={images}
        searchTerm={searchTerm}
        loading={loading}
        getModelNameById={getModelNameById}
        handleDeleteImage={handleDeleteImage}
      />
    </div>
  );
};

export default ImageListCard; 