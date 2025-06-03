
import React, { useState } from 'react';
import { Flag, Trash2, File, FileImage, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const MessageItem = ({ message, onFlag, onDelete }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [imageError, setImageError] = useState(false);
  
  // Check if this message is from the current user (moderator view)
  const isCurrentUser = user && message.sender_id === user.id;
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const renderFileContent = () => {
    if (message.message_type === 'IMAGE' && message.file_url && !imageError) {
      return (
        <div className="mt-2">
          <img
            src={message.file_url}
            alt={message.file_name || 'Shared image'}
            className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onError={handleImageError}
            onClick={() => window.open(message.file_url, '_blank')}
          />
        </div>
      );
    } else if (message.file_name) {
      return (
        <div className={`mt-2 p-3 rounded-lg border ${
          theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center">
            <File className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-sm font-medium">{message.file_name}</span>
            {message.file_url && (
              <button
                onClick={() => window.open(message.file_url, '_blank')}
                className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
              >
                Download
              </button>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isCurrentUser ? 'order-2' : 'order-1'}`}>
        <div className={`rounded-lg p-3 ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-metadite-primary to-metadite-secondary text-white'
            : theme === 'dark' 
              ? 'bg-gray-700 text-gray-200' 
              : 'bg-gray-100 text-gray-800'
        }`}>
          {!isCurrentUser && (
            <div className="text-xs font-medium mb-1 opacity-70">
              {message.sender_name || 'User'}
            </div>
          )}
          
          <div className="text-sm">
            {message.content}
          </div>
          
          {renderFileContent()}
          
          <div className={`text-xs mt-2 opacity-70 flex items-center ${
            isCurrentUser ? 'justify-end' : 'justify-between'
          }`}>
            <span>{formatTime(message.created_at || message.timestamp)}</span>
            {message.flagged && (
              <Flag className="h-3 w-3 text-red-400 ml-2" />
            )}
          </div>
        </div>
        
        {(onFlag || onDelete) && (
          <div className={`flex space-x-2 mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {onFlag && (
              <button
                onClick={onFlag}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  message.flagged
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : theme === 'dark'
                      ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Flag className="h-3 w-3" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;