
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useVipVideos } from '../hooks/useVipVideos';
import { toast } from 'sonner';
import VideoContainer from '../components/video/VideoContainer';
import VideoSettingsDialog from '../components/video/VideoSettingsDialog';
import VideoInfo from '../components/video/VideoInfo';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { getVideoById, getPreviousVideoId, getNextVideoId } = useVipVideos();
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  
  // Get the video data
  const video = getVideoById(parseInt(videoId));
  
  // Get previous and next video IDs for navigation
  const previousVideoId = getPreviousVideoId(parseInt(videoId));
  const nextVideoId = getNextVideoId(parseInt(videoId));
  
  // Check VIP access
  useEffect(() => {
    if (!user?.membershipLevel || (user.membershipLevel !== 'vip' && user.membershipLevel !== 'vvip')) {
      navigate('/upgrade');
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

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
      setDuration(videoRef.current.duration || 100); // Fallback to 100 seconds if duration is not available
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
    
    if (!isFullScreen) {
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
  
  // Monitor fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);
  
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
  
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  
  // Quality change handler
  const handleQualityChange = (quality) => {
    setSelectedQuality(quality);
    
    // Save current playback position and playing state
    const currentPlaybackTime = videoRef.current ? videoRef.current.currentTime : 0;
    const wasPlaying = isPlaying;
    
    // Simulate quality change with a small loading delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Restore playback position
      if (videoRef.current) {
        videoRef.current.currentTime = currentPlaybackTime;
        
        // Resume playback if it was playing before
        if (wasPlaying) {
          videoRef.current.play()
            .catch(error => {
              console.error('Error playing video after quality change:', error);
            });
        }
      }
      
      toast.success(`Quality changed to ${quality}`);
    }, 1000);
    
    return () => clearTimeout(timer);
  };
  
  // Handle previous/next video navigation
  const navigateToVideo = (videoId) => {
    if (videoId) {
      navigate(`/video/${videoId}`);
      setIsPlaying(false);
      setCurrentTime(0);
      setIsLoading(true);
    }
  };
  
  // Handle if video not found
  if (!video && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className={`flex-1 pt-20 pb-12 px-4 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-white via-metadite-light to-white'
        }`}>
          <div className="container mx-auto max-w-6xl text-center py-20">
            <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
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
                video={video}
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
                selectedQuality={selectedQuality}
                handleQualityChange={handleQualityChange}
                formatTime={formatTime}
                setIsSettingsOpen={setIsSettingsOpen}
                videoRef={videoRef}
                videoContainerRef={videoContainerRef}
              />
              
              <VideoSettingsDialog
                isSettingsOpen={isSettingsOpen}
                setIsSettingsOpen={setIsSettingsOpen}
                selectedQuality={selectedQuality}
                handleQualityChange={handleQualityChange}
                videoRef={videoRef}
              />
              
              <VideoInfo
                video={video}
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