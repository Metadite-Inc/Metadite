
import { SkipBack, SkipForward, Keyboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

const VideoInfo = ({ video, previousVideoId, nextVideoId }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  const keyboardShortcuts = [
    { key: 'Space', action: 'Play/Pause' },
    { key: '←', action: 'Seek backward 5s' },
    { key: '→', action: 'Seek forward 5s' },
    { key: '↑', action: 'Volume up' },
    { key: '↓', action: 'Volume down' },
    { key: 'M', action: 'Mute/Unmute' },
    { key: 'F', action: 'Fullscreen' },
    { key: 'P', action: 'Previous video' },
    { key: 'N', action: 'Next video' },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 mb-3">
        <h1 className={`text-2xl font-bold mb-2 md:mb-0 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {video.title}
        </h1>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => previousVideoId && navigate(`/video/${previousVideoId}`)}
            disabled={!previousVideoId}
            className={`p-2 rounded-full ${
              previousVideoId 
                ? 'hover:bg-gray-200/20' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            title="Previous Video (P)"
          >
            <SkipBack className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} />
          </button>
          <button
            onClick={() => nextVideoId && navigate(`/video/${nextVideoId}`)}
            disabled={!nextVideoId}
            className={`p-2 rounded-full ${
              nextVideoId 
                ? 'hover:bg-gray-200/20' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            title="Next Video (N)"
          >
            <SkipForward className={`h-5 w-5 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`} />
          </button>
        </div>
      </div>
      
      <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
        <p className="mb-4">Model: {video.modelName}</p>
        <p>Duration: {video.duration}</p>
      </div>
      
      <div className="glass-card p-6 rounded-xl mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Description
          </h2>
          <button 
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className={`flex items-center space-x-1 px-3 py-1 rounded ${
              theme === 'dark' 
                ? 'bg-gray-700/70 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title="Keyboard Shortcuts"
          >
            <Keyboard className="h-4 w-4 mr-1" />
            <span>Shortcuts</span>
          </button>
        </div>
        
        {showKeyboardShortcuts ? (
          <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {keyboardShortcuts.map((shortcut) => (
              <div 
                key={shortcut.key} 
                className={`flex items-center justify-between p-3 rounded ${
                  theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-100'
                }`}
              >
                <span className="font-medium">{shortcut.action}</span>
                <kbd 
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-white border border-gray-600' 
                      : 'bg-gray-200 text-gray-700 border border-gray-300'
                  }`}
                >
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        ) : (
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            This exclusive VIP video showcases detailed information about {video.modelName}. 
            Watch in your preferred quality to see all the intricate details and craftsmanship.
          </p>
        )}
      </div>
    </>
  );
};

export default VideoInfo;
