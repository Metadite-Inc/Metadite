
import { useRef, useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import VideoControls from './VideoControls';

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
  selectedQuality,
  handleQualityChange,
  formatTime,
  setIsSettingsOpen,
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

      // Prevent default behavior for certain keys
      if (['Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'f', 'F', 'm', 'M'].includes(e.code) ||
          e.code === 'KeyM' || e.code === 'KeyF') {
        e.preventDefault();
      }
      
      // Play/pause with spacebar
      if (e.code === 'Space') {
        togglePlay();
      }
      
      // Seek with arrow keys (5 seconds)
      if (e.code === 'ArrowLeft' && videoRef.current) {
        const newTime = Math.max(videoRef.current.currentTime - 5, 0);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        showControlsTemporarily();
      }
      
      if (e.code === 'ArrowRight' && videoRef.current) {
        const newTime = Math.min(videoRef.current.currentTime + 5, duration);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        showControlsTemporarily();
      }
      
      // Volume control with up/down arrows
      if (e.code === 'ArrowUp') {
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
      
      // Navigate videos with 'p' (previous) and 'n' (next) keys
      if ((e.code === 'KeyP') && previousVideoId) {
        navigateToVideo(previousVideoId);
      }
      
      if ((e.code === 'KeyN') && nextVideoId) {
        navigateToVideo(nextVideoId);
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
    previousVideoId, 
    nextVideoId, 
    navigateToVideo,
    showControlsTemporarily
  ]);

  return (
    <div 
      ref={videoContainerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden cursor-pointer" 
      onClick={togglePlay}
      onMouseMove={showControlsTemporarily}
    >
      {/* Using a real video element but with a placeholder source */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnd}
        poster={video.thumbnail}
        preload="metadata"
      >
        {/* In a real implementation, this would be a real video source */}
        {/* <source src={`/videos/${video.id}-${selectedQuality}.mp4`} type="video/mp4" /> */}
        Your browser does not support the video tag.
      </video>
      
      {/* Video title overlay */}
      <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-white text-lg font-medium truncate">{video.title}</h3>
      </div>
      
      {/* Play/Pause button overlay */}
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
      <VideoControls
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        currentTime={currentTime}
        duration={duration}
        handleSeek={handleSeek}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        isMuted={isMuted}
        toggleMute={toggleMute}
        toggleFullScreen={toggleFullScreen}
        previousVideoId={previousVideoId}
        nextVideoId={nextVideoId}
        navigateToVideo={navigateToVideo}
        selectedQuality={selectedQuality}
        handleQualityChange={handleQualityChange}
        formatTime={formatTime}
        setIsSettingsOpen={setIsSettingsOpen}
        showControls={showControls}
      />
    </div>
  );
};

export default VideoContainer;
