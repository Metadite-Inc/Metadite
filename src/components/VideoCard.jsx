
import { useState } from 'react';
import { Play, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const VideoCard = ({ video, vipAccess = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { theme } = useTheme();

  return (
    <div className={`glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <div className="relative overflow-hidden h-48">
        {!imageLoaded && <div className="absolute inset-0 shimmer"></div>}
        <img
          src={video.thumbnail}
          alt={video.title}
          className={`w-full h-full object-cover ${imageLoaded ? 'image-fade-in loaded' : 'image-fade-in'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {vipAccess ? (
          <button className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors group">
            <div className="bg-white/90 rounded-full p-3 transform transition-transform group-hover:scale-110">
              <Play className="h-6 w-6 text-metadite-primary" fill="currentColor" />
            </div>
          </button>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="bg-white/80 rounded-full p-3 flex items-center space-x-2">
              <Lock className="h-5 w-5 text-metadite-primary" />
              <span className="font-medium text-metadite-dark">VIP Only</span>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <span className="text-white font-medium">{video.duration}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-1`}>{video.title}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>{video.modelName}</p>
        
        {vipAccess ? (
          <div className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>Last watched: {video.lastWatched || 'Never'}</div>
        ) : (
          <div className="mt-3">
            <button className="w-full bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-2 rounded-md hover:opacity-90 transition-opacity text-sm">
              Upgrade to VIP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
