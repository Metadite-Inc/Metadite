
import React from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MessageInput = ({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage, 
  handleTyping,
  selectedModel, 
  promptFileSelection, 
  isUploading, 
  selectedFile,
  connectionStatus
}) => {
  const { theme } = useTheme();
  
  const isConnectionActive = connectionStatus === 'connected';
  
  const handleChange = (e) => {
    setNewMessage(e.target.value);
    if (handleTyping) handleTyping();
  };
  
  return (
    <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <div className="relative flex-1">
          <textarea
            placeholder={`${isConnectionActive ? `Send a message as ${selectedModel?.name || 'Moderator'}...` : 'Reconnecting to chat...'}`}
            value={newMessage}
            onChange={handleChange}
            disabled={!isConnectionActive}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-metadite-primary focus:border-metadite-primary resize-none h-12 min-h-[3rem] max-h-[8rem] ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'border-gray-300 text-gray-900'
            } ${!isConnectionActive ? 'opacity-70' : ''}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            rows={1}
          ></textarea>
        </div>
        
        <button 
          type="button"
          onClick={promptFileSelection}
          disabled={!isConnectionActive}
          className={`flex-shrink-0 p-3 rounded-md ${
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200'
          } ${!isConnectionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Paperclip className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
        
        <button 
          type="submit"
          disabled={(!newMessage.trim() && !selectedFile) || isUploading || !isConnectionActive}
          className="flex-shrink-0 bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white p-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isUploading ? (
            <span className="inline-block h-5 w-5 rounded-full border-2 border-white border-r-transparent animate-spin"></span>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
      
      {!isConnectionActive && (
        <div className="mt-2 text-xs text-center text-red-500">
          {connectionStatus === 'connecting' 
            ? 'Connecting to chat server...' 
            : 'Connection lost. Trying to reconnect...'}
        </div>
      )}
    </div>
  );
};

export default MessageInput;
