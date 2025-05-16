
import React from 'react';
import VideoSearch from './VideoSearch';
import VideoTable from './VideoTable';

const VideoListCard = ({ 
  videos, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  selectedModel, 
  handleModelChange, 
  models,
  getModelNameById,
  handleDeleteVideo
}) => {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-semibold">Manage Videos</h2>
        <VideoSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedModel={selectedModel}
          handleModelChange={handleModelChange}
          models={models}
        />
      </div>
      
      <VideoTable 
        videos={videos}
        searchTerm={searchTerm}
        loading={loading}
        getModelNameById={getModelNameById}
        handleDeleteVideo={handleDeleteVideo}
      />
    </div>
  );
};

export default VideoListCard;
