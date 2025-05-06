
import { Video } from 'lucide-react';
import VideoCard from '../VideoCard';

const VideoGrid = ({ videos, isLoaded }) => {
  if (videos.length === 0) {
    return (
      <div className="glass-card rounded-xl p-10 text-center">
        <Video className="h-10 w-10 text-gray-300 mx-auto mb-2" />
        <h3 className="text-xl font-medium mb-2 dark:text-gray-100">No videos found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          We couldn't find any videos matching your search. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video, index) => (
        <div 
          key={video.id} 
          className={`transition-all duration-500 transform ${
            isLoaded 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: `${index * 50}ms` }}
        >
          <VideoCard video={video} vipAccess={true} />
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
