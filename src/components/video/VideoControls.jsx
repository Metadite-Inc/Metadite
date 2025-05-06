
import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Settings, Maximize } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useTheme } from '../../context/ThemeContext';

const VideoControls = ({ 
  isPlaying, 
  togglePlay, 
  currentTime, 
  duration, 
  handleSeek, 
  volume, 
  handleVolumeChange, 
  isMuted, 
  toggleMute, 
  toggleFullScreen, 
  previousVideoId, 
  nextVideoId, 
  navigateToVideo, 
  selectedQuality,
  handleQualityChange,
  formatTime,
  setIsSettingsOpen,
  showControls
}) => {
  const { theme } = useTheme();
  
  return (
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
          
          {/* Quality selector dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="text-white hover:text-gray-300 transition-colors flex items-center">
                <span className="text-xs mr-1">{selectedQuality}</span>
                <Settings className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              side="top"
              className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
            >
              {['480p', '720p', '1080p', '4K'].map(quality => (
                <DropdownMenuItem
                  key={quality}
                  onClick={() => handleQualityChange(quality)}
                  className={`cursor-pointer ${
                    selectedQuality === quality 
                      ? 'bg-metadite-primary text-white' 
                      : theme === 'dark'
                        ? 'hover:bg-gray-700 text-white'
                        : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  {quality}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Settings button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsSettingsOpen(true);
            }} 
            className="text-white hover:text-gray-300 transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
          
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
  );
};

export default VideoControls;
