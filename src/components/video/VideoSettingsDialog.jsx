
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';

const VideoSettingsDialog = ({ 
  isSettingsOpen, 
  setIsSettingsOpen, 
  selectedQuality,
  handleQualityChange,
  videoRef
}) => {
  const { theme } = useTheme();

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Video Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className={`text-lg mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Video Quality
          </h3>
          <div className="space-y-2">
            {['480p', '720p', '1080p', '4K'].map(quality => (
              <button
                key={quality}
                onClick={() => handleQualityChange(quality)}
                className={`w-full py-2 px-4 flex items-center justify-between rounded-md transition-colors ${
                  selectedQuality === quality
                    ? theme === 'dark'
                      ? 'bg-metadite-primary text-white'
                      : 'bg-metadite-primary text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700/70 text-white hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span>{quality}</span>
                {selectedQuality === quality && (
                  <span className="text-sm bg-white/20 px-2 py-0.5 rounded">Active</span>
                )}
              </button>
            ))}
          </div>
          
          <h3 className={`text-lg mt-6 mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Playback Speed
          </h3>
          <div className="flex items-center justify-center space-x-4">
            <button 
              className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              onClick={() => {
                if (videoRef.current && videoRef.current.playbackRate > 0.25) {
                  videoRef.current.playbackRate -= 0.25;
                  toast.success(`Playback speed: ${videoRef.current.playbackRate}x`);
                }
              }}
            >
              <MinusCircle className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
            </button>
            <span className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {videoRef.current ? videoRef.current.playbackRate : 1}x
            </span>
            <button 
              className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              onClick={() => {
                if (videoRef.current && videoRef.current.playbackRate < 2) {
                  videoRef.current.playbackRate += 0.25;
                  toast.success(`Playback speed: ${videoRef.current.playbackRate}x`);
                }
              }}
            >
              <PlusCircle className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoSettingsDialog;
