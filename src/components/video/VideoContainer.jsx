
import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Maximize } from 'lucide-react';

const VideoContainer = ({
  video,
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  togglePlay,
  handleTimeUpdate,
  handleLoadedMetadata,
  handleVideoEnd,
  toggleFullScreen,
  showControls,
  setShowControls,
  showControlsTemporarily,
  previousVideoId,
  nextVideoId,
  navigateToVideo,
  formatTime,
  videoRef,
  videoContainerRef,
}) => {
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      if (!isMuted) {
        videoRef.current.muted = true;
      } else {
        videoRef.current.muted = false;
        if (volume === 0) {
          setVolume(0.5);
          videoRef.current.volume = 0.5;
        }
      }
      setIsMuted(!isMuted);
    }
  };
  
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Play/pause with spacebar
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      
      // Seek with arrow keys (5 seconds)
      if (e.code === 'ArrowLeft' && videoRef.current) {
        e.preventDefault();
        const newTime = Math.max(videoRef.current.currentTime - 5, 0);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        showControlsTemporarily();
      }
      
      if (e.code === 'ArrowRight' && videoRef.current) {
        e.preventDefault();
        const newTime = Math.min(videoRef.current.currentTime + 5, duration);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        showControlsTemporarily();
      }
      
      // Volume control with up/down arrows
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        const newVolume = Math.min(volume + 0.05, 1);
        setVolume(newVolume);
        if (videoRef.current) {
          videoRef.current.volume = newVolume;
        }
        if (isMuted && newVolume > 0) {
          setIsMuted(false);
          if (videoRef.current) {
            videoRef.current.muted = false;
          }
        }
        showControlsTemporarily();
      }
      
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        const newVolume = Math.max(volume - 0.05, 0);
        setVolume(newVolume);
        if (videoRef.current) {
          videoRef.current.volume = newVolume;
        }
        if (newVolume === 0) {
          setIsMuted(true);
          if (videoRef.current) {
            videoRef.current.muted = true;
          }
        }
        showControlsTemporarily();
      }
      
      // Toggle mute with 'm' key
      if (e.code === 'KeyM') {
        toggleMute();
        showControlsTemporarily();
      }
      
      // Toggle fullscreen with 'f' key
      if (e.code === 'KeyF') {
        toggleFullScreen();
      }
    };

    // Add event listener when component mounts
    document.addEventListener('keydown', handleKeyPress);
    
    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [
    togglePlay,
    videoRef,
    duration,
    setCurrentTime,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    toggleFullScreen,
    showControlsTemporarily
  ]);
  
  // Get appropriate video source URL
  const getVideoUrl = () => {
    if (video?.url && video.url.startsWith('http')) {
      return video.url;
    } else if (video?.url) {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      return `${apiBaseUrl}${video.url}`;
    }
    return '';
  };

  // Get appropriate thumbnail URL
  const getThumbnailUrl = () => {
    if (video?.thumbnail_url && video.thumbnail_url.startsWith('http')) {
      return video.thumbnail_url;
    } else if (video?.thumbnail_url) {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      return `${apiBaseUrl}${video.thumbnail_url}`;
    }
    return '';
  };

  return (
    <div 
      ref={videoContainerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden cursor-pointer" 
      onClick={togglePlay}
      onMouseMove={showControlsTemporarily}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnd}
        poster={getThumbnailUrl()}
        src={getVideoUrl()}
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Video title overlay */}
      <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-white text-lg font-medium truncate">{video?.title}</h3>
      </div>
      
      {/* Play button overlay (only when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            onClick={togglePlay} 
            className="w-20 h-20 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all transform hover:scale-110"
          >
            <Play className="h-10 w-10 text-white" fill="white" />
          </button>
        </div>
      )}
      
      {/* Video controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress bar */}
        <div className="flex items-center mb-2">
          <span className="text-white text-xs mr-2">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-white text-xs ml-2">
            {formatTime(duration)}
          </span>
        </div>
        
        {/* Controls row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }} 
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </button>
            
            {/* Volume control */}
            <div className="hidden sm:flex items-center space-x-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }} 
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation controls */}
            <div className="hidden sm:flex items-center space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToVideo(previousVideoId);
                }}
                disabled={!previousVideoId}
                className={`text-white ${!previousVideoId ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-300 transition-colors'}`}
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToVideo(nextVideoId);
                }}
                disabled={!nextVideoId}
                className={`text-white ${!nextVideoId ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-300 transition-colors'}`}
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
            
            {/* Fullscreen button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleFullScreen();
              }} 
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoContainer;
