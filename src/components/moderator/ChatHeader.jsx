import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ChatHeader = ({ selectedModel, connectionStatus }) => {
  const { theme } = useTheme();

  const getConnectionStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'reconnecting':
        return 'bg-orange-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getConnectionStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  return (
    <div className={`p-4 border-b flex items-center justify-between ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
    }`}>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          <img
            src={selectedModel.image}
            alt={selectedModel.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/200?text=Model';
            }}
          />
        </div>
        <div>
          <h2 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
            {selectedModel.name}
          </h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Room ID: {selectedModel.id} • User ID: {selectedModel.receiverId}
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className={`relative w-3 h-3 rounded-full mr-2 ${getConnectionStatusColor(connectionStatus)}`}>
          {connectionStatus === 'connecting' && (
            <span className="absolute inset-0 rounded-full bg-yellow-500 animate-ping opacity-75"></span>
          )}
        </div>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {getConnectionStatusText(connectionStatus)}
        </span>
      </div>
    </div>
  );
};

export default ChatHeader;
