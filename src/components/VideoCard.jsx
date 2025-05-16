
import { useState } from 'react';
import { Play, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const VideoCard = ({ video, vipAccess = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { theme } = useTheme();

  const handlePreview = (e) => {
    if (vipAccess) {
      e.preventDefault();
      setShowPreview(true);
    }
  };

  // Format the video duration or use a default
  const formatDuration = (seconds) => {
    if (!seconds) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get the appropriate thumbnail URL
  const getThumbnailUrl = () => {
    if (video.thumbnail_url && video.thumbnail_url.startsWith('http')) {
      return video.thumbnail_url;
    } else if (video.thumbnail_url) {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      return `${apiBaseUrl}${video.thumbnail_url}`;
    }
    // Fallback to placeholder
    return 'https://images.unsplash.com/photo-1545239705-1564e6722e81?q=80&w=1000&auto=format&fit=crop';
  };

  return (
    <div className={`glass-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${theme === 'dark' ? 'bg-gray-800/70' : ''}`}>
      <div className="relative overflow-hidden h-48">
        {!imageLoaded && <div className="absolute inset-0 shimmer"></div>}
        <img
          src={getThumbnailUrl()}
          alt={video.title}
          className={`w-full h-full object-cover ${imageLoaded ? 'image-fade-in loaded' : 'image-fade-in'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            console.error('Error loading image:', e);
            e.target.src = 'https://images.unsplash.com/photo-1545239705-1564e6722e81?q=80&w=1000&auto=format&fit=crop';
          }}
        />
        
        {vipAccess ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Link 
              to={`/video/${video.id}`} 
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors group"
            >
              <div className="bg-white/90 rounded-full p-3 transform transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 text-metadite-primary" fill="currentColor" />
              </div>
            </Link>
            
            <button 
              onClick={handlePreview}
              className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded hover:bg-black/80 transition-colors"
            >
              Preview
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="bg-white/80 rounded-full p-3 flex items-center space-x-2">
              <Lock className="h-5 w-5 text-metadite-primary" />
              <span className="font-medium text-metadite-dark">VIP Only</span>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <span className="text-white font-medium">{formatDuration(video.duration)}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-1 truncate`}>{video.title}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
          {video.model_name || 'Various Models'}
        </p>
        
        {vipAccess ? (
          <div className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
            Added: {new Date(video.created_at).toLocaleDateString()}
          </div>
        ) : (
          <div className="mt-3">
            <Link to="/upgrade" className="block w-full">
              <button className="w-full bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white py-2 rounded-md hover:opacity-90 transition-opacity text-sm">
                Upgrade to VIP
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Video Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-black overflow-hidden">
          <div className="relative aspect-video">
            <video
              className="w-full h-full object-contain"
              autoPlay
              controls
              poster={getThumbnailUrl()}
              src={video.url}
            >
              Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white text-lg font-medium">{video.title} (Preview)</h3>
              <Link 
                to={`/video/${video.id}`}
                className="inline-block mt-2 bg-metadite-primary text-white px-4 py-1.5 rounded-md hover:bg-opacity-90 transition-colors text-sm"
                onClick={() => setShowPreview(false)}
              >
                Watch Full Video
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoCard;
