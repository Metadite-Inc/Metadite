
import { Search, Filter, Video } from 'lucide-react';

const VideoSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-8">
      <div className="glass-card p-4 rounded-xl">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          
          <div className="flex space-x-2">
            <button className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
              <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>Filters</span>
            </button>
            <button className="flex items-center space-x-1 px-4 py-2 bg-metadite-primary text-white rounded-md hover:opacity-90 transition-opacity">
              <Video className="h-4 w-4" />
              <span>Recent</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSearch;
