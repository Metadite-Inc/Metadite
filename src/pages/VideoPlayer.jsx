
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useVipVideos } from '../hooks/useVipVideos';
import { useChatAccess } from '../hooks/useChatAccess';
import { toast } from 'sonner';
import VideoContainer from '../components/video/VideoContainer';
import VideoInfo from '../components/video/VideoInfo';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { getVideoById, fetchVideoById, getPreviousVideoId, getNextVideoId } = useVipVideos();
  const { canWatchVideos, loading: accessLoading } = useChatAccess();
  
  // All state hooks at the top
  const [isLoading, setIsLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // All ref hooks at the top
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  
  // Get previous and next video IDs for navigation
  const previousVideoId = getPreviousVideoId(parseInt(videoId));
  const nextVideoId = getNextVideoId(parseInt(videoId));
  
  // All useEffect hooks at the top
  // Check VIP access
  useEffect(() => {
    if (!user?.membership_level || (user.membership_level !== 'vip' && user.membership_level !== 'vvip')) {
      navigate('/upgrade');
    }
  }, [user, navigate]);

  // Check video access
  useEffect(() => {
    if (!accessLoading && !canWatchVideos) {
      navigate('/vip-content');
      toast.error("You don't have permission to watch videos");
    }
  }, [canWatchVideos, accessLoading, navigate]);

  // Load video data
  useEffect(() => {
    const loadVideo = async () => {
      if (!canWatchVideos && !accessLoading) return;
      
      setIsLoading(true);
      
      // Try to get from cache first
      const cachedVideo = getVideoById(parseInt(videoId));
      
      if (cachedVideo) {
        setVideoData(cachedVideo);
        setIsLoading(false);
      } else {
        // Fetch from API if not in cache
        const fetchedVideo = await fetchVideoById(parseInt(videoId));
        if (fetchedVideo) {
          setVideoData(fetchedVideo);
        } else {
          toast.error("Failed to load video");
        }
        setIsLoading(false);
      }
    };
    
    if (user?.membership_level === 'vip' || user?.membership_level === 'vvip') {
      loadVideo();
    }
  }, [videoId, user, getVideoById, fetchVideoById, canWatchVideos, accessLoading]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  
  // Function definitions
  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play()
          .catch(error => {
            console.error('Error playing video:', error);
            toast.error('Unable to play video. Please try again.');
          });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Update progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  // Set video duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 100);
    }
  };
  
  // Format time in MM:SS format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };
  
  // Handle fullscreen toggle
  const toggleFullScreen = () => {
    if (!videoContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      } else if (videoContainerRef.current.mozRequestFullScreen) {
        videoContainerRef.current.mozRequestFullScreen();
      } else if (videoContainerRef.current.webkitRequestFullscreen) {
        videoContainerRef.current.webkitRequestFullscreen();
      } else if (videoContainerRef.current.msRequestFullscreen) {
        videoContainerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };
  
  // Auto-hide controls after inactivity
  const showControlsTemporarily = () => {
    setShowControls(true);
    
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  // Handle navigation between videos
  const navigateToVideo = (id) => {
    if (id) {
      navigate(`/video/${id}`);
    }
  };
  
  // Now all conditional rendering logic after all hooks
  // Show loading while checking access
  if (accessLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-20 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-12 w-12 text-metadite-primary animate-spin" />
              <span className="ml-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                Checking access permissions...
              </span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show access denied if user can't watch videos
  if (!canWatchVideos) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-20 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="container mx-auto max-w-6xl text-center py-20">
            <Lock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Access Restricted
            </h1>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              You don't have permission to watch videos.
            </p>
            <button 
              onClick={() => navigate('/vip-content')}
              className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Back to Videos
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Handle if video not found
  if (!videoData && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-20 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="container mx-auto max-w-6xl text-center py-20">
            <div className="h-16 w-16 mx-auto mb-4 text-gray-400 flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Video Not Found
            </h1>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              The video you're looking for could not be found.
            </p>
            <button 
              onClick={() => navigate('/vip-content')}
              className="bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Back to Videos
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className={`flex-1 pt-20 pb-12 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-white via-metadite-light to-white'
      }`}>
        {isLoading ? (
          <div className="container mx-auto max-w-6xl px-4">
            <div className="w-full aspect-video bg-gray-800/40 rounded-lg shimmer mb-6"></div>
            <div className="h-8 w-1/3 bg-gray-800/40 rounded shimmer mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-800/40 rounded shimmer"></div>
          </div>
        ) : (
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-6">
              <VideoContainer
                video={videoData}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
                duration={duration}
                setDuration={setDuration}
                volume={volume}
                setVolume={setVolume}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                togglePlay={togglePlay}
                handleTimeUpdate={handleTimeUpdate}
                handleLoadedMetadata={handleLoadedMetadata}
                handleVideoEnd={handleVideoEnd}
                toggleFullScreen={toggleFullScreen}
                showControls={showControls}
                setShowControls={setShowControls}
                showControlsTemporarily={showControlsTemporarily}
                previousVideoId={previousVideoId}
                nextVideoId={nextVideoId}
                navigateToVideo={navigateToVideo}
                formatTime={formatTime}
                videoRef={videoRef}
                videoContainerRef={videoContainerRef}
              />
              
              <VideoInfo
                video={videoData}
                previousVideoId={previousVideoId}
                nextVideoId={nextVideoId}
              />
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default VideoPlayer;
